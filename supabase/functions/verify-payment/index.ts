
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const razorpayKeyId = Deno.env.get('RZP_KEY_ID') || '';
const razorpayKeySecret = Deno.env.get('RZP_KEY_SECRET') || '';
const webhookSecret = Deno.env.get('RZP_WEBHOOK_SECRET') || '';

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
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
 * Upsert payment record in database
 */
async function upsertPaymentRecord(payment: RazorpayPayment): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('payments')
      .upsert({
        rzp_payment_id: payment.id,
        rzp_order_id: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
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
    
    console.log(`Successfully upserted payment record for ${payment.id}`);
    return { success: true };
  } catch (error) {
    console.error("Error upserting payment record:", error);
    return { success: false, error: error.message };
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
        return new Response('Webhook secret not configured', { 
          status: 500,
          headers: corsHeaders 
        });
      }
      
      // Read raw body for signature verification
      const rawBody = new Uint8Array(await req.arrayBuffer());
      
      // Verify webhook signature
      const isValid = await verifyWebhookSignature(rawBody, webhookSignature, webhookSecret);
      
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response('Invalid signature', { 
          status: 400,
          headers: corsHeaders 
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
      return new Response('Webhook processing error', { 
        status: 400,
        headers: corsHeaders 
      });
    }
  } else {
    // Handle as client verification request
    try {
      const requestData = await req.json() as VerifyPaymentRequest;
      const { razorpay_order_id } = requestData;
      
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
      
      console.log(`Processing manual payment verification for order: ${razorpay_order_id}`);
      
      // Step 1: Fetch payments from Razorpay
      const orderPayments = await fetchOrderPayments(razorpay_order_id);
      
      if (!orderPayments.success) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            reason: `Failed to fetch payments: ${orderPayments.error}`
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          }
        );
      }
      
      // Step 2: Check for captured payments
      const capturedPayments = orderPayments.payments?.filter(p => p.status === 'captured') || [];
      
      if (capturedPayments.length === 0) {
        console.log(`No captured payments found for order ${razorpay_order_id}`);
        return new Response(
          JSON.stringify({ 
            success: false, 
            reason: "Payment not found or failed"
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          }
        );
      }
      
      // Step 3: Upsert captured payments to database
      for (const payment of capturedPayments) {
        const upsertResult = await upsertPaymentRecord(payment);
        if (!upsertResult.success) {
          console.error(`Failed to upsert payment ${payment.id}:`, upsertResult.error);
          // Continue processing other payments even if one fails
        }
      }
      
      console.log(`Successfully verified ${capturedPayments.length} captured payment(s) for order ${razorpay_order_id}`);
      
      // Return success response
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
      
    } catch (error) {
      console.error("Error in manual payment verification:", error);
      
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
  }
};

serve(handler);
