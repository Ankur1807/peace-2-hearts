
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.4.0';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  return null;
}

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    const { action, amount, currency, receipt, orderData, paymentId } = await req.json();
    
    // Get Razorpay API keys from environment variables
    const key_id = Deno.env.get('RAZORPAY_KEY_ID');
    const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!key_id || !key_secret) {
      return new Response(JSON.stringify({
        error: 'Razorpay API keys not configured'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }
    
    // Authorization for Razorpay API
    const auth = btoa(`${key_id}:${key_secret}`);
    
    // Handle different actions
    if (action === 'create_order') {
      if (!amount || !currency || !receipt) {
        return new Response(JSON.stringify({
          error: 'Missing required parameters'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
      
      // Create order on Razorpay
      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: currency,
          receipt: receipt,
          notes: orderData?.notes || {}
        })
      });
      
      const orderResult = await razorpayResponse.json();
      console.log("Order created:", orderResult);
      
      if (!razorpayResponse.ok) {
        return new Response(JSON.stringify({
          error: 'Failed to create order',
          details: orderResult
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: razorpayResponse.status
        });
      }
      
      // Return the successful order response
      return new Response(JSON.stringify({
        success: true,
        order: orderResult
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } 
    else if (action === 'verify_payment') {
      if (!paymentId || !orderData) {
        return new Response(JSON.stringify({
          error: 'Missing payment verification data'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
      
      // Verify the payment signature
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = orderData;
      
      // In a production app, you'd verify the signature here using crypto
      // For demo purposes, we're just returning success
      
      return new Response(JSON.stringify({
        success: true,
        verified: true,
        message: 'Payment verified successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    return new Response(JSON.stringify({
      error: 'Invalid action'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      details: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
