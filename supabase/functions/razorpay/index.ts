
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { 
  corsHeaders, 
  handleCors, 
  parseRequestData, 
  getRazorpayKeys 
} from './utils.ts';
import { handleCreateOrder } from './orderHandler.ts';
import { handleVerifyPayment } from './paymentHandler.ts';

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    // Parse request body
    const { data: requestData, error: parseError } = await parseRequestData(req);
    
    if (parseError) {
      return new Response(JSON.stringify({
        error: parseError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    const { action, amount, currency, receipt, orderData, paymentId } = requestData;
    
    // Get Razorpay API keys
    const { key_id, key_secret } = getRazorpayKeys();
    
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
      return await handleCreateOrder(
        amount, 
        currency, 
        receipt, 
        orderData?.notes,
        auth,
        key_id
      );
    } 
    else if (action === 'verify_payment') {
      return await handleVerifyPayment(
        paymentId,
        orderData,
        auth
      );
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
