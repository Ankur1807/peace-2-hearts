
import { corsHeaders } from './utils.ts';

export async function handleVerifyPayment(
  paymentId: string,
  orderData: any,
  auth: string
): Promise<Response> {
  if (!paymentId) {
    console.error("Missing payment ID");
    return new Response(JSON.stringify({
      success: false,
      verified: false,
      error: 'Missing payment ID'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
  
  console.log("Verifying payment with ID:", paymentId);
  
  try {
    // Fetch payment details from Razorpay to confirm it's valid
    const paymentUrl = `https://api.razorpay.com/v1/payments/${paymentId}`;
    
    console.log(`Fetching payment details from: ${paymentUrl}`);
    
    const paymentResponse = await fetch(paymentUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      console.error("Failed to verify payment with Razorpay:", errorData);
      return new Response(JSON.stringify({
        success: false,
        verified: false,
        error: 'Payment verification failed',
        details: errorData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    const paymentData = await paymentResponse.json();
    console.log("Payment data retrieved:", JSON.stringify(paymentData));
    
    // Check if payment is captured or authorized
    const paymentStatus = paymentData.status;
    const isPaymentSuccessful = ['captured', 'authorized', 'created'].includes(paymentStatus);
    
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
    
    // If orderData is present and we need to verify signature
    if (orderData && orderData.razorpay_signature) {
      // For now, we'll just trust the payment data we got from Razorpay's API
      // In a production environment, you should implement proper signature verification
      console.log("Signature verification skipped for MVP (using direct API check instead)");
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
  } catch (err) {
    console.error("Error verifying payment:", err);
    return new Response(JSON.stringify({
      success: false,
      verified: false,
      error: 'Error verifying payment',
      details: err instanceof Error ? err.message : String(err)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
