import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const razorpayKeyId = Deno.env.get('RZP_KEY_ID') || '';
const razorpayKeySecret = Deno.env.get('RZP_KEY_SECRET') || '';
const adminToken = Deno.env.get('ADMIN_RECONCILE_TOKEN') || '';
const appOrigin = Deno.env.get('APP_ORIGIN') || '*';

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": appOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};

// Create Supabase client with service role for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
 * Capture an authorized payment
 */
async function capturePayment(paymentId: string, amount: number, currency: string): Promise<{
  success: boolean;
  payment?: RazorpayPayment;
  error?: string;
}> {
  try {
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, currency })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Capture failed: ${response.status} ${errorText}`);
    }
    
    const payment = await response.json();
    console.log(`Successfully captured payment ${paymentId}`);
    
    return { success: true, payment };
  } catch (error) {
    console.error(`Error capturing payment ${paymentId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Upsert payment and consultation records
 */
async function upsertPaymentAndConsultation(payment: RazorpayPayment, bookingDetails?: any): Promise<{
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
    
    // Upsert payment record
    const { error: paymentError } = await supabase
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
    
    if (paymentError && paymentError.code !== '23505') {
      throw paymentError;
    }
    
    console.log(`Upserted payment record for ${payment.id} with status ${finalStatus}`);
    
    // Upsert consultation if captured
    if (finalStatus === 'captured') {
      try {
        // Try to find existing consultation
        const { data: existingConsultation } = await supabase
          .from('consultations')
          .select('*')
          .or(`rzp_payment_id.eq.${payment.id},rzp_order_id.eq.${payment.order_id}`)
          .maybeSingle();

        const consultationData = {
          rzp_payment_id: payment.id,
          rzp_order_id: payment.order_id,
          status: 'confirmed',
          email: bookingDetails?.email || payment.email || null,
          scheduled_at: bookingDetails?.scheduled_at || bookingDetails?.date || null,
          notes: {
            razorpay_payment: payment,
            booking_details: bookingDetails || {},
            reconciled_at: new Date().toISOString()
          }
        };

        if (existingConsultation) {
          const { error: updateError } = await supabase
            .from('consultations')
            .update(consultationData)
            .eq('id', existingConsultation.id);
          
          if (updateError) {
            console.error(`Failed to update consultation:`, updateError);
          } else {
            console.log(`Updated consultation for payment ${payment.id}`);
          }
        } else {
          // Try full insert first, fallback to minimal if needed
          try {
            const { error: insertError } = await supabase
              .from('consultations')
              .insert(consultationData);
            
            if (insertError) {
              console.warn(`Full consultation insert failed, retrying with minimal fields:`, insertError);
              
              const { error: retryError } = await supabase
                .from('consultations')
                .insert({
                  rzp_payment_id: payment.id,
                  rzp_order_id: payment.order_id,
                  status: 'confirmed',
                  email: bookingDetails?.email || payment.email || null,
                  notes: consultationData.notes
                });
              
              if (retryError) {
                console.error(`Failed to insert minimal consultation:`, retryError);
              } else {
                console.log(`Inserted minimal consultation for payment ${payment.id}`);
              }
            } else {
              console.log(`Inserted consultation for payment ${payment.id}`);
            }
          } catch (insertException) {
            console.error(`Exception inserting consultation:`, insertException);
          }
        }
      } catch (consultationError) {
        console.error(`Error handling consultation for payment ${payment.id}:`, consultationError);
        // Don't fail the whole operation for consultation errors
      }

      // Send booking confirmation email if newly captured
      if (!wasAlreadyCaptured) {
        try {
          await sendBookingConfirmationEmail(payment.id);
        } catch (emailError) {
          console.error(`Failed to send confirmation email for ${payment.id}:`, emailError);
          // Don't fail the operation for email errors
        }
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error upserting payment and consultation:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send booking confirmation email via existing email service
 */
async function sendBookingConfirmationEmail(paymentId: string): Promise<void> {
  try {
    // Find consultation by payment_id
    const { data: consultation, error: fetchError } = await supabase
      .from('consultations')
      .select('*')
      .eq('rzp_payment_id', paymentId)
      .maybeSingle();
    
    if (fetchError || !consultation) {
      console.log(`No consultation found for payment ${paymentId}, skipping email`);
      return;
    }
    
    if (consultation.email_sent) {
      console.log(`Email already sent for consultation ${consultation.reference_id || 'unknown'}`);
      return;
    }
    
    // Send email using send-email edge function
    const emailPayload = {
      type: 'booking-confirmation',
      data: {
        to: consultation.email || consultation.client_email,
        clientName: consultation.client_name || 'Valued Client',
        referenceId: consultation.reference_id || `RZP-${paymentId.slice(-8)}`,
        serviceType: consultation.consultation_type || 'Consultation',
        date: consultation.date ? new Date(consultation.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'To be scheduled',
        time: consultation.time_slot || consultation.timeframe || 'To be confirmed',
        price: consultation.amount ? `₹${consultation.amount}` : 'Confirmed',
        highPriority: true,
        isReconciliation: true
      }
    };
    
    const { error: emailError } = await supabase.functions.invoke('send-email', {
      body: emailPayload
    });
    
    if (emailError) {
      console.error(`Error sending reconciliation email:`, emailError);
      return;
    }
    
    // Mark email as sent
    await supabase
      .from('consultations')
      .update({ email_sent: true })
      .eq('rzp_payment_id', paymentId);
    
    console.log(`Successfully sent reconciliation email for payment ${paymentId}`);
  } catch (error) {
    console.error(`Exception sending confirmation email for payment ${paymentId}:`, error);
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  // Health check endpoint
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ ok: true, service: 'reconcile-payment' }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }

  try {
    // Check admin token
    const adminTokenHeader = req.headers.get('X-Admin-Token');
    
    if (!adminToken || adminTokenHeader !== adminToken) {
      console.warn('Unauthorized reconcile-payment access attempt');
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const { razorpay_order_id, booking } = await req.json();
    
    if (!razorpay_order_id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          reason: "Missing required parameter: razorpay_order_id" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    console.log(`Reconciling payment for order: ${razorpay_order_id}`);

    // Fetch payments from Razorpay
    const orderPayments = await fetchOrderPayments(razorpay_order_id);
    
    if (!orderPayments.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          reason: `Failed to fetch payments: ${orderPayments.error}`
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const payments = orderPayments.payments || [];
    const newestPayment = payments.sort((a, b) => b.created_at - a.created_at)[0];
    
    if (!newestPayment) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          reason: "No payments found for order"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    let finalPayment = newestPayment;

    // If payment is authorized, attempt to capture it
    if (newestPayment.status === 'authorized') {
      console.log(`Attempting to capture authorized payment ${newestPayment.id}`);
      
      const captureResult = await capturePayment(
        newestPayment.id, 
        newestPayment.amount, 
        newestPayment.currency
      );
      
      if (captureResult.success && captureResult.payment) {
        finalPayment = captureResult.payment;
        console.log(`Successfully captured payment ${newestPayment.id}`);
      } else {
        console.error(`Failed to capture payment ${newestPayment.id}: ${captureResult.error}`);
      }
    }

    // Upsert payment and consultation records
    const upsertResult = await upsertPaymentAndConsultation(finalPayment, booking);
    
    if (!upsertResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          reason: `Database error: ${upsertResult.error}`
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const success = finalPayment.status === 'captured';
    const reason = success ? 'captured' : finalPayment.status;

    console.log(`Reconciliation completed for order ${razorpay_order_id}: ${reason}`);

    return new Response(
      JSON.stringify({ 
        success, 
        reason,
        payment_id: finalPayment.id,
        order_id: finalPayment.order_id,
        amount: finalPayment.amount,
        status: finalPayment.status
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );

  } catch (error) {
    console.error("Error in reconcile-payment handler:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        reason: error.message || "Internal server error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);