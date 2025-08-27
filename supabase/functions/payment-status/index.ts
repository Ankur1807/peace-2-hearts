import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const appOrigin = Deno.env.get('APP_ORIGIN') || '*';

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": appOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
};

// Create Supabase client with service role for read access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  if (req.method !== "GET") {
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

  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get('order_id');
    const paymentId = url.searchParams.get('payment_id');

    if (!orderId && !paymentId) {
      return new Response(
        JSON.stringify({ 
          success: false,
          status: "error",
          reason: "missing_parameters" 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    console.log(`Fetching payment status for order: ${orderId}, payment: ${paymentId}`);

    let query = supabase
      .from('payments')
      .select('rzp_payment_id, rzp_order_id, amount, currency, status, email, created_at, updated_at');

    if (paymentId) {
      query = query.eq('rzp_payment_id', paymentId);
    } else if (orderId) {
      query = query.eq('rzp_order_id', orderId);
    }

    const { data: payments, error } = await query;

    if (error) {
      console.error("Error fetching payment status:", error);
      return new Response(
        JSON.stringify({ 
          success: false,
          status: "error",
          reason: "database_error"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    if (!payments || payments.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false,
          status: "not_found"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Return the most recent payment if multiple exist
    const payment = payments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    const response = {
      success: payment.status === 'captured',
      status: payment.status === 'captured' ? 'captured' : (payment.status === 'failed' ? 'failed' : 'pending_webhook'),
      amount: payment.amount,
      currency: payment.currency,
      rzp_order_id: payment.rzp_order_id,
      rzp_payment_id: payment.rzp_payment_id,
      email: payment.email,
      updated_at: payment.updated_at
    };

    console.log(`Payment status retrieved for ${payment.rzp_payment_id}: ${payment.status}`);

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );

  } catch (error) {
    console.error("Error in payment-status handler:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        status: "error",
        reason: "internal_error"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);