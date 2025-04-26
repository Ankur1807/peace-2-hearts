
import { corsHeaders } from './utils.ts';

export async function handleCreateOrder(
  amount: number, 
  currency: string, 
  receipt: string,
  notes: any,
  auth: string,
  key_id: string
): Promise<Response> {
  try {
    console.log(`Creating order with: amount=${amount}, currency=${currency}, receipt=${receipt}`);
    
    // Ensure amount is a number and convert to paise (smallest currency unit)
    const amountInPaise = Math.round(Number(amount) * 100);
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      console.error("Invalid amount:", amount);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid amount'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    const orderData = {
      amount: amountInPaise,
      currency,
      receipt,
      notes: notes || {},
      // Add partial payment setting as false
      partial_payment: false
    };
    
    console.log("Sending order creation request to Razorpay:", JSON.stringify(orderData));
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    console.log("Razorpay order response:", JSON.stringify(data));
    
    if (!response.ok) {
      console.error("Razorpay order creation failed:", data);
      return new Response(JSON.stringify({
        success: false,
        error: data.error?.description || 'Failed to create order',
        details: data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status
      });
    }
    
    const orderResponse = {
      success: true,
      order_id: data.id,
      details: {
        id: data.id,
        amount: data.amount / 100, // Convert back from paise to main currency unit
        currency: data.currency,
        key_id // Include the key_id for frontend to use
      }
    };
    
    return new Response(JSON.stringify(orderResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err) {
    console.error("Exception in handleCreateOrder:", err);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error creating order',
      details: err instanceof Error ? err.message : String(err)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
