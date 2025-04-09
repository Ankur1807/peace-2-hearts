
import { corsHeaders } from './utils.ts';

export async function handleCreateOrder(
  amount: number, 
  currency: string, 
  receipt: string, 
  notes: Record<string, string> | undefined,
  auth: string,
  key_id: string
): Promise<Response> {
  if (!amount || !currency || !receipt) {
    console.error("Missing required parameters:", { amount, currency, receipt });
    return new Response(JSON.stringify({
      error: 'Missing required parameters'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
  
  console.log("Creating order with params:", { amount, currency, receipt, notes });
  
  // Create order on Razorpay
  const orderPayload = {
    amount: amount * 100, // Convert to paise
    currency: currency,
    receipt: receipt,
    notes: notes || {}
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
        success: false,
        error: 'Failed to create order',
        details: orderResult
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: razorpayResponse.status
      });
    }
    
    // Return the successful order response with key information
    return new Response(JSON.stringify({
      success: true,
      order: orderResult,
      key_id: key_id // Include key_id in response
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
