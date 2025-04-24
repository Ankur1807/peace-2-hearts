
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const { action } = await req.json();
    
    if (action === 'create_order') {
      // Extract params for create order
      const { amount, currency = 'INR', receipt, orderData } = await req.json();
      
      // Get API keys from env
      const key_id = Deno.env.get('RAZORPAY_KEY_ID');
      const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET');
      
      if (!key_id || !key_secret) {
        console.error("Razorpay API keys not configured");
        return new Response(JSON.stringify({
          success: false,
          error: 'Payment gateway not configured'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
      }
      
      // Authentication for Razorpay API
      const auth = btoa(`${key_id}:${key_secret}`);
      
      // Create order on Razorpay
      const orderPayload = {
        amount: amount * 100, // Convert to paise
        currency: currency,
        receipt: receipt,
        notes: orderData?.notes || {}
      };
      
      console.log("Creating Razorpay order:", orderPayload);
      
      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify(orderPayload)
      });
      
      const orderResult = await razorpayResponse.json();
      
      if (!razorpayResponse.ok) {
        console.error("Razorpay API error:", orderResult);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to create order',
          details: orderResult
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: razorpayResponse.status
        });
      }
      
      return new Response(JSON.stringify({
        success: true,
        order_id: orderResult.id,
        details: {
          id: orderResult.id,
          amount: orderResult.amount / 100, // Convert back to rupees
          currency: orderResult.currency,
          key_id: key_id
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } 
    else if (action === 'verify_payment') {
      // Extract params for verify payment
      const { paymentId, orderData } = await req.json();
      
      // Get API keys from env
      const key_id = Deno.env.get('RAZORPAY_KEY_ID');
      const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET');
      
      if (!key_id || !key_secret) {
        console.error("Razorpay API keys not configured");
        return new Response(JSON.stringify({
          success: false,
          verified: false,
          error: 'Payment gateway not configured'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
      }
      
      // Authentication for Razorpay API
      const auth = btoa(`${key_id}:${key_secret}`);
      
      // Fetch payment details from Razorpay to confirm it's valid
      const paymentUrl = `https://api.razorpay.com/v1/payments/${paymentId}`;
      const paymentResponse = await fetch(paymentUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      
      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        console.error("Failed to verify payment with Razorpay:", errorData);
        return new Response(JSON.stringify({
          success: false,
          verified: false,
          error: 'Payment verification failed'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
      
      const paymentData = await paymentResponse.json();
      
      // Check if payment is captured or authorized
      const paymentStatus = paymentData.status;
      const isPaymentSuccessful = ['captured', 'authorized'].includes(paymentStatus);
      
      if (!isPaymentSuccessful) {
        console.error("Payment is not successful according to Razorpay. Status:", paymentStatus);
        return new Response(JSON.stringify({
          success: false,
          verified: false,
          error: `Payment not successful. Status: ${paymentStatus}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
      
      return new Response(JSON.stringify({
        success: true,
        verified: true,
        message: 'Payment verified successfully',
        payment: paymentData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    // Handle unknown action
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
