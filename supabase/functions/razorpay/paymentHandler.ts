
import { corsHeaders } from './utils.ts';

export async function handleVerifyPayment(
  paymentId: string,
  orderData: any,
  auth: string
): Promise<Response> {
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
  
  // Verify signature using crypto
  try {
    // Fetch payment details from Razorpay to confirm it's valid
    const paymentUrl = `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`;
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
    console.log("Payment data retrieved:", JSON.stringify(paymentData));
    
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
  } catch (err) {
    console.error("Error verifying payment:", err);
    return new Response(JSON.stringify({
      success: false,
      verified: false,
      error: 'Error verifying payment',
      details: err.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
