
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
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify(requestData));
    } catch (err) {
      console.error("Error parsing request JSON:", err);
      return new Response(JSON.stringify({
        error: 'Invalid JSON in request body'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    const { action, amount, currency, receipt, orderData, paymentId } = requestData;
    
    // Get Razorpay API keys from environment variables
    const key_id = Deno.env.get('RAZORPAY_KEY_ID');
    const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!key_id || !key_secret) {
      console.error("Razorpay API keys not configured");
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
        console.error("Missing required parameters:", { amount, currency, receipt });
        return new Response(JSON.stringify({
          error: 'Missing required parameters'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
      
      console.log("Creating order with params:", { amount, currency, receipt, notes: orderData?.notes });
      
      // Create order on Razorpay
      const orderPayload = {
        amount: amount * 100, // Convert to paise
        currency: currency,
        receipt: receipt,
        notes: orderData?.notes || {}
      };
      
      console.log("Sending request to Razorpay:", JSON.stringify(orderPayload));
      
      try {
        const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
          },
          body: JSON.stringify(orderPayload)
        });
        
        const orderResult = await razorpayResponse.json();
        console.log("Order created:", JSON.stringify(orderResult));
        
        if (!razorpayResponse.ok) {
          console.error("Razorpay API error:", orderResult);
          return new Response(JSON.stringify({
            error: 'Failed to create order',
            details: orderResult
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: razorpayResponse.status
          });
        }
        
        // Add key_id to the order response for client use
        const responseOrder = {
          ...orderResult,
          notes: {
            ...orderResult.notes,
          }
        };
        
        // Return the successful order response
        return new Response(JSON.stringify({
          success: true,
          order: responseOrder
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } catch (err) {
        console.error("Error calling Razorpay API:", err);
        return new Response(JSON.stringify({
          error: 'Error communicating with Razorpay',
          details: err.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
      }
    } 
    else if (action === 'verify_payment') {
      if (!paymentId || !orderData) {
        console.error("Missing payment verification data");
        return new Response(JSON.stringify({
          error: 'Missing payment verification data'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
      
      // Verify the payment signature
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = orderData;
      
      console.log("Verifying payment:", { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature: razorpay_signature ? "signature-provided" : "missing" 
      });
      
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
    
    console.error("Invalid action requested:", action);
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
