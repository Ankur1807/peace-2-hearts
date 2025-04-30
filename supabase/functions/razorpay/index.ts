
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
    // Enhanced request parsing with better error handling
    let data;
    let error = null;
    
    try {
      // Check if Content-Type is application/json
      const contentType = req.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid content type. Expected application/json');
      }
      
      // Parse JSON body with better error handling
      const body = await req.json();
      data = body;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to parse request data';
      console.error("Request parsing error:", error);
    }
    
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
    
    // Log the request data for debugging
    console.log("Razorpay function received request:", JSON.stringify(data));
    
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
    
    if (!action) {
      console.error("Missing required 'action' parameter");
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required action parameter'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // FIX: Make action checking case-insensitive and support both formats
    // (create_order and create-order)
    const normalizedAction = action.toLowerCase().replace(/-/g, '_');
    
    if (normalizedAction === 'create_order') {
      // Extract params for create order
      const { amount, currency = 'INR', receipt, notes } = data;
      
      if (amount === undefined || amount === null) {
        console.error("Missing required 'amount' parameter");
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required amount parameter'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
      
      if (!receipt) {
        console.error("Missing required 'receipt' parameter");
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required receipt parameter'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
      
      return await handleCreateOrder(amount, currency, receipt, notes, auth, key_id);
    } 
    else if (normalizedAction === 'verify_payment') {
      // Extract params for verify payment
      const { paymentId, orderData, checkOnly } = data;
      
      if (!paymentId) {
        console.error("Missing paymentId for verify_payment");
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing payment ID'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
      
      return await handleVerifyPayment(paymentId, orderData, auth);
    } 
    else {
      // Handle unknown action
      console.error("Unknown action requested:", action);
      return new Response(JSON.stringify({
        success: false,
        error: `Invalid action: ${action}`,
        supportedActions: ['create_order', 'verify_payment']
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error processing Razorpay request:", errorMessage);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal Server Error',
      message: errorMessage,
      details: error instanceof Error ? { name: error.name, message: error.message } : { error: String(error) }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
