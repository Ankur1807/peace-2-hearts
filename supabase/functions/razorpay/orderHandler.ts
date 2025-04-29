
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
    
    // Input validation with detailed error messages
    if (amount === undefined || amount === null) {
      console.error("Amount is undefined or null");
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing amount parameter'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    // Convert to number and ensure it's valid
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      console.error("Invalid amount (not a number):", amount);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid amount format'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Ensure amount is positive
    if (numericAmount <= 0) {
      console.error("Invalid amount (zero or negative):", numericAmount);
      return new Response(JSON.stringify({
        success: false,
        error: 'Amount must be greater than zero'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Ensure amount is in paise (smallest currency unit)
    // If amount is too small (like 11), it's likely in rupees and needs conversion
    // If it's already large (like 1100), it might already be in paise
    const amountInPaise = numericAmount < 100 ? Math.round(numericAmount * 100) : Math.round(numericAmount);
    
    console.log(`Converting amount ${numericAmount} to paise: ${amountInPaise}`);
    
    // Build the order data object
    const orderData = {
      amount: amountInPaise,
      currency,
      receipt,
      notes: notes || {},
      // Add partial payment setting as false
      partial_payment: false
    };
    
    console.log("Sending order creation request to Razorpay:", JSON.stringify(orderData));
    
    // Make API call to Razorpay
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    // Parse response from Razorpay
    const data = await response.json();
    console.log("Razorpay API response status:", response.status);
    console.log("Razorpay API response body:", JSON.stringify(data));
    
    // Handle API errors
    if (!response.ok) {
      const errorMsg = data.error?.description || 'Unknown error from payment gateway';
      console.error(`Razorpay API error (${response.status}): ${errorMsg}`);
      
      return new Response(JSON.stringify({
        success: false,
        error: errorMsg,
        status: response.status,
        details: data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status
      });
    }
    
    // Build success response with required fields for frontend compatibility
    const orderResponse = {
      id: data.id,
      success: true,
      order_id: data.id,
      entity: data.entity,
      amount: data.amount / 100, // Convert back from paise to main currency unit
      amount_paid: data.amount_paid / 100,
      amount_due: data.amount_due / 100,
      currency: data.currency,
      receipt: data.receipt,
      status: data.status,
      attempts: data.attempts,
      razorpayKey: key_id, // Include the key_id for frontend to use
      details: {
        id: data.id,
        key_id,
        amount: data.amount / 100,
        currency: data.currency
      },
      order: {
        id: data.id
      }
    };
    
    console.log("Successfully created order:", JSON.stringify(orderResponse));
    
    return new Response(JSON.stringify(orderResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err) {
    // Catch and log any unhandled errors
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Exception in handleCreateOrder:", errorMessage);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Error creating order',
      message: errorMessage,
      details: err instanceof Error ? { name: err.name, message: err.message } : { error: String(err) }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
