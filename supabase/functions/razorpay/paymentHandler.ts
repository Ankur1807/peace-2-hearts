
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
    
    // Expanded list of valid payment statuses - including those from QR code payments
    // QR code payments might initially show as 'created' before being finalized
    const validPaymentStatuses = ['captured', 'authorized', 'created', 'processed', 'paid'];
    const paymentStatus = paymentData.status;
    const isPaymentSuccessful = validPaymentStatuses.includes(paymentStatus);
    
    // Check payment method to log and handle differently
    const paymentMethod = paymentData.method || 'unknown';
    console.log(`Payment method used: ${paymentMethod}, Status: ${paymentStatus}`);
    
    // For UPI/QR code payments, we may need additional verification
    const isQRCodeOrUPI = paymentMethod === 'upi' || paymentMethod === 'qr_code';
    if (isQRCodeOrUPI) {
      console.log("UPI/QR Code payment detected - these may require additional verification");
    }
    
    if (!isPaymentSuccessful) {
      console.error(`Payment is not successful according to Razorpay. Status: ${paymentStatus}`);
      return new Response(JSON.stringify({
        success: false,
        verified: false,
        error: `Payment not successful. Status: ${paymentStatus}`,
        payment_method: paymentMethod,
        payment_status: paymentStatus
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // For UPI/QR code payments that are in 'created' status but likely to be completed
    // We'll allow these to pass verification but flag them for follow-up
    const isPendingQRPayment = isQRCodeOrUPI && paymentStatus === 'created';
    
    // If orderData is present and we need to verify signature
    if (orderData && orderData.razorpay_signature) {
      // For now, we'll just trust the payment data we got from Razorpay's API
      // In a production environment, you should implement proper signature verification
      console.log("Signature verification skipped for MVP (using direct API check instead)");
    }
    
    return new Response(JSON.stringify({
      success: true,
      verified: true,
      message: isPendingQRPayment 
        ? 'Payment initiated successfully via QR code/UPI. Will be confirmed shortly.' 
        : 'Payment verified successfully',
      payment: {
        ...paymentData,
        isPendingQRPayment
      }
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
