
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleCors } from "./utils.ts";
import { handleCreateOrder } from "./orderHandler.ts";
import { handleVerifyPayment } from "./paymentHandler.ts";
import { parseRequestData, getRazorpayKeys } from "./utils.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // Parse request data safely
    const { data, error } = await parseRequestData(req);
    
    if (error || !data) {
      console.error("Error parsing request data:", error);
      return new Response(JSON.stringify({
        success: false,
        error: error || 'Invalid request data'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Get API keys
    const { key_id, key_secret } = getRazorpayKeys();
    
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
    
    const { action } = data;
    
    if (action === 'create_order') {
      // Extract params for create order
      const { amount, currency = 'INR', receipt, orderData } = data;
      return await handleCreateOrder(amount, currency, receipt, orderData?.notes, auth, key_id);
    } 
    else if (action === 'verify_payment') {
      // Extract params for verify payment
      const { paymentId, orderData, checkOnly } = data;
      return await handleVerifyPayment(paymentId, orderData, auth);
    } 
    else {
      // Handle unknown action
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid action'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal Server Error',
      details: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
