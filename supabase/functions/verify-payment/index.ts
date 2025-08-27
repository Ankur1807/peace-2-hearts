
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || '';
const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
const webhookSecret = Deno.env.get('RZP_WEBHOOK_SECRET') || '';

// Set up CORS headers for browser requests
const appOrigin = Deno.env.get('APP_ORIGIN') || '*';
const corsHeaders = {
  "Access-Control-Allow-Origin": appOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
};

// Create Supabase client with service role for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface VerifyPaymentRequest {
  razorpay_order_id: string;
}

interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  email?: string;
  contact?: string;
  notes?: any;
  created_at: number;
}

interface WebhookEvent {
  event: string;
  payload: {
    payment?: {
      entity: RazorpayPayment;
    };
    order?: {
      entity: {
        id: string;
      };
    };
  };
}

/**
 * Verify Razorpay webhook signature using HMAC SHA256
 */
async function verifyWebhookSignature(rawBody: Uint8Array, signature: string, secret: string): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const sigBuffer = await crypto.subtle.sign('HMAC', key, rawBody);
    const computedSignature = Array.from(new Uint8Array(sigBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Constant-time comparison to prevent timing attacks
    return timingSafeEqual(computedSignature, signature);
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Fetch payments for a Razorpay order
 */
async function fetchOrderPayments(orderId: string): Promise<{
  success: boolean;
  payments?: RazorpayPayment[];
  error?: string;
}> {
  try {
    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured');
    }
    
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch(`https://api.razorpay.com/v1/orders/${orderId}/payments`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Razorpay API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Fetched ${data.items?.length || 0} payments for order ${orderId}`);
    
    return { success: true, payments: data.items || [] };
  } catch (error) {
    console.error("Error fetching order payments:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Upsert payment record in database and send confirmation email if captured
 */
async function upsertPaymentRecord(payment: RazorpayPayment, bookingDetails?: any): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Check if payment already exists to determine if email should be sent
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('status')
      .eq('rzp_payment_id', payment.id)
      .maybeSingle();

    const wasAlreadyCaptured = existingPayment?.status === 'captured';
    
    // Never downgrade captured status
    const finalStatus = (existingPayment?.status === 'captured' && payment.status !== 'captured') 
      ? 'captured' 
      : payment.status;
    
    const { error } = await supabase
      .from('payments')
      .upsert({
        rzp_payment_id: payment.id,
        rzp_order_id: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: finalStatus,
        email: payment.email || null,
        notes: payment.notes || {}
      }, {
        onConflict: 'rzp_payment_id'
      });
    
    if (error) {
      // Ignore duplicate key errors as they indicate the payment was already processed
      if (error.code === '23505') {
        console.log(`Payment ${payment.id} already exists, ignoring duplicate`);
        return { success: true };
      }
      throw error;
    }
    
    console.log(`Successfully upserted payment record for ${payment.id} with status ${finalStatus}`);
    
    // Handle consultation record based on payment status
    if (finalStatus === 'captured') {
      // For captured payments, create/update consultation and send email if newly captured
      await upsertConsultationRecord(payment, bookingDetails);
      
      // Send booking confirmation email if payment is newly captured
      if (!wasAlreadyCaptured) {
        await sendBookingConfirmationEmailForPayment(payment.id);
      }
    } else if (finalStatus === 'failed') {
      // For failed payments, update consultation status if it exists and isn't already captured
      await updateConsultationStatusForFailedPayment(payment);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error upserting payment record:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Upsert consultation record for captured payment
 */
async function upsertConsultationRecord(payment: RazorpayPayment, bookingDetails?: any): Promise<void> {
  try {
    // Try to find existing consultation by payment_id or order_id (using existing table columns)
    const { data: existingConsultation } = await supabase
      .from('consultations')
      .select('*')
      .or(`payment_id.eq.${payment.id},order_id.eq.${payment.order_id}`)
      .maybeSingle();

    const consultationData = {
      payment_id: payment.id,  // Map to existing column
      order_id: payment.order_id,  // Map to existing column
      status: 'confirmed',
      payment_status: 'paid',
      client_email: bookingDetails?.email || payment.email || null,
      amount: payment.amount,
      email_sent: false,  // Will be set to true when email is sent
      updated_at: new Date().toISOString()
    };

    if (existingConsultation) {
      // Update existing consultation - only update if not already captured/confirmed
      if (existingConsultation.status !== 'confirmed' || existingConsultation.payment_status !== 'paid') {
        const { error } = await supabase
          .from('consultations')
          .update(consultationData)
          .eq('id', existingConsultation.id);
        
        if (error) {
          console.error(`Failed to update consultation for payment ${payment.id}:`, error);
        } else {
          console.log(`Updated consultation for payment ${payment.id}`);
        }
      } else {
        console.log(`Consultation for payment ${payment.id} already confirmed`);
      }
    } else {
      // Insert new consultation with minimal required fields
      try {
        const { error } = await supabase
          .from('consultations')
          .insert({
            payment_id: payment.id,
            order_id: payment.order_id,
            status: 'confirmed',
            payment_status: 'paid',
            client_email: bookingDetails?.email || payment.email || null,
            amount: payment.amount,
            email_sent: false,
            consultation_type: bookingDetails?.consultation_type || 'General Consultation',
            time_slot: bookingDetails?.time_slot || 'To be scheduled',
            reference_id: `P2H-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error(`Failed to insert consultation for payment ${payment.id}:`, error);
        } else {
          console.log(`Inserted consultation for payment ${payment.id}`);
        }
      } catch (insertError) {
        console.error(`Exception inserting consultation for payment ${payment.id}:`, insertError);
      }
    }
  } catch (error) {
    console.error(`Error upserting consultation for payment ${payment.id}:`, error);
  }
}

/**
 * Update consultation status for failed payment
 */
async function updateConsultationStatusForFailedPayment(payment: RazorpayPayment): Promise<void> {
  try {
    // Find existing consultation by payment_id or order_id
    const { data: existingConsultation } = await supabase
      .from('consultations')
      .select('*')
      .or(`payment_id.eq.${payment.id},order_id.eq.${payment.order_id}`)
      .maybeSingle();

    if (existingConsultation) {
      // Only update to failed if not already confirmed/paid
      if (existingConsultation.status !== 'confirmed' && existingConsultation.payment_status !== 'paid') {
        const { error } = await supabase
          .from('consultations')
          .update({
            status: 'failed',
            payment_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConsultation.id);
        
        if (error) {
          console.error(`Failed to update consultation status for failed payment ${payment.id}:`, error);
        } else {
          console.log(`Updated consultation status to failed for payment ${payment.id}`);
        }
      } else {
        console.log(`Consultation for payment ${payment.id} already confirmed, not updating to failed`);
      }
    } else {
      console.log(`No consultation found for failed payment ${payment.id}`);
    }
  } catch (error) {
    console.error(`Error updating consultation status for failed payment ${payment.id}:`, error);
  }
}

/**
 * Send booking confirmation email for a captured payment
 */
async function sendBookingConfirmationEmailForPayment(paymentId: string): Promise<void> {
  try {
    console.log(`Attempting to send booking confirmation for payment ${paymentId}`);
    
    // Find consultation by payment_id
    const { data: consultation, error: fetchError } = await supabase
      .from('consultations')
      .select('*')
      .eq('payment_id', paymentId)
      .maybeSingle();
    
    if (fetchError) {
      console.error(`Error fetching consultation for payment ${paymentId}:`, fetchError);
      return;
    }
    
    if (!consultation) {
      console.log(`No consultation found for payment ${paymentId}`);
      return;
    }
    
    // Check if email was already sent
    if (consultation.email_sent) {
      console.log(`Email already sent for consultation ${consultation.reference_id}`);
      return;
    }
    
    // Prepare booking confirmation email data
    const emailPayload = {
      type: 'booking-confirmation',
      data: {
        to: consultation.client_email,
        clientName: consultation.client_name || 'Valued Client',
        referenceId: consultation.reference_id,
        serviceType: consultation.consultation_type,
        date: consultation.date ? new Date(consultation.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'To be scheduled',
        time: consultation.time_slot || consultation.timeframe || 'To be confirmed',
        price: consultation.amount ? `₹${consultation.amount}` : 'Confirmed',
        highPriority: true
      }
    };
    
    // Send email using send-email edge function
    const { data, error: emailError } = await supabase.functions.invoke('send-email', {
      body: emailPayload
    });
    
    if (emailError) {
      console.error(`Error sending email for consultation ${consultation.reference_id}:`, emailError);
      return;
    }
    
    // Update consultation to mark email as sent
    const { error: updateError } = await supabase
      .from('consultations')
      .update({ 
        email_sent: true,
        payment_status: 'paid'
      })
      .eq('reference_id', consultation.reference_id);
    
    if (updateError) {
      console.error(`Error updating consultation ${consultation.reference_id}:`, updateError);
    } else {
      console.log(`Successfully sent confirmation email for ${consultation.reference_id}`);
    }
    
  } catch (error) {
    console.error(`Exception sending confirmation email for payment ${paymentId}:`, error);
  }
}

/**
 * Send booking confirmation email for payments by order ID
 */
async function sendBookingConfirmationEmailForOrder(orderId: string): Promise<void> {
  try {
    console.log(`Attempting to send booking confirmation for order ${orderId}`);
    
    // Find consultation by looking for payment_id that matches any payment for this order
    const { data: consultation, error: fetchError } = await supabase
      .from('consultations')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();
    
    if (fetchError) {
      console.error(`Error fetching consultation for order ${orderId}:`, fetchError);
      return;
    }
    
    if (!consultation) {
      console.log(`No consultation found for order ${orderId}`);
      return;
    }
    
    // Check if email was already sent
    if (consultation.email_sent) {
      console.log(`Email already sent for consultation ${consultation.reference_id}`);
      return;
    }
    
    // Prepare booking confirmation email data
    const emailPayload = {
      type: 'booking-confirmation',
      data: {
        to: consultation.client_email,
        clientName: consultation.client_name || 'Valued Client',
        referenceId: consultation.reference_id,
        serviceType: consultation.consultation_type,
        date: consultation.date ? new Date(consultation.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'To be scheduled',
        time: consultation.time_slot || consultation.timeframe || 'To be confirmed',
        price: consultation.amount ? `₹${consultation.amount}` : 'Confirmed',
        highPriority: true
      }
    };
    
    // Send email using send-email edge function
    const { data, error: emailError } = await supabase.functions.invoke('send-email', {
      body: emailPayload
    });
    
    if (emailError) {
      console.error(`Error sending email for consultation ${consultation.reference_id}:`, emailError);
      return;
    }
    
    // Update consultation to mark email as sent
    const { error: updateError } = await supabase
      .from('consultations')
      .update({ 
        email_sent: true,
        payment_status: 'paid'
      })
      .eq('reference_id', consultation.reference_id);
    
    if (updateError) {
      console.error(`Error updating consultation ${consultation.reference_id}:`, updateError);
    } else {
      console.log(`Successfully sent confirmation email for ${consultation.reference_id}`);
    }
    
  } catch (error) {
    console.error(`Exception sending confirmation email for order ${orderId}:`, error);
  }
}
/**
 * Handle webhook events from Razorpay
 */
async function handleWebhookEvent(event: WebhookEvent): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log(`Processing webhook event: ${event.event}`);
    
    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment?.entity;
        if (!payment) {
          console.error('No payment entity found in payment.captured event');
          return { success: false, error: 'Missing payment entity' };
        }
        
        // Ensure status is set to captured
        const capturedPayment = { ...payment, status: 'captured' };
        const result = await upsertPaymentRecord(capturedPayment);
        
        if (result.success) {
          console.log(`Successfully processed payment.captured for ${payment.id}`);
        }
        
        return result;
      }
      
      case 'payment.failed': {
        const payment = event.payload.payment?.entity;
        if (!payment) {
          console.error('No payment entity found in payment.failed event');
          return { success: false, error: 'Missing payment entity' };
        }
        
        // Ensure status is set to failed
        const failedPayment = { ...payment, status: 'failed' };
        const result = await upsertPaymentRecord(failedPayment);
        
        if (result.success) {
          console.log(`Successfully processed payment.failed for ${payment.id}`);
        }
        
        return result;
      }
      
      default:
        console.log(`Ignoring webhook event: ${event.event}`);
        return { success: true };
    }
  } catch (error) {
    console.error(`Error handling webhook event ${event.event}:`, error);
    return { success: false, error: error.message };
  }
}

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Check if this is a webhook request by looking for signature header
  const webhookSignature = req.headers.get('X-Razorpay-Signature');
  
  if (webhookSignature) {
    // Handle as webhook request
    try {
      console.log('Processing Razorpay webhook request');
      
      if (!webhookSecret) {
        console.error('Webhook secret not configured');
        return new Response(JSON.stringify({ 
          received: false, 
          reason: "webhook_secret_not_configured" 
        }), { 
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      
      // Read raw body for signature verification
      const rawBody = new Uint8Array(await req.arrayBuffer());
      
      // Verify webhook signature
      const isValid = await verifyWebhookSignature(rawBody, webhookSignature, webhookSecret);
      
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(JSON.stringify({ 
          received: false, 
          reason: "invalid_signature" 
        }), { 
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      
      console.log('Webhook signature verified successfully');
      
      // Parse the webhook event
      const event = JSON.parse(new TextDecoder().decode(rawBody)) as WebhookEvent;
      
      // Handle the webhook event
      const result = await handleWebhookEvent(event);
      
      if (!result.success) {
        console.error(`Webhook event handling failed: ${result.error}`);
        // Still return 200 to prevent Razorpay retries for processing errors
      }
      
      // Always return 200 for valid webhooks to prevent Razorpay retries
      return new Response(
        JSON.stringify({ received: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
      
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response(JSON.stringify({ 
        received: false, 
        reason: "webhook_processing_error",
        details: error.message 
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  } else if (req.method === "POST") {
    // Handle as client verification request (DEPRECATED - for backward compatibility)
    // Client POST without signature should NOT write to DB
    try {
      console.warn('DEPRECATED: Client verify-payment POST called without signature');
      
      const requestData = await req.json();
      const { razorpay_order_id, booking } = requestData;
      
      if (!razorpay_order_id) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            reason: "missing_order_id" 
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          }
        );
      }
      
      console.log(`Client POST without signature - returning pending_webhook for order: ${razorpay_order_id}`);
      
      // Do NOT write to DB for client requests without signature
      // Direct them to use GET /payment-status instead
      return new Response(
        JSON.stringify({ 
          success: false, 
          reason: "pending_webhook"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
      
    } catch (error) {
      console.error("Error in client POST verification:", error);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          reason: "pending_webhook"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
  } else {
    // Handle non-POST methods (GET, etc.)
    return new Response(
      JSON.stringify({ 
        ok: false, 
        reason: "method_not_allowed" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);
