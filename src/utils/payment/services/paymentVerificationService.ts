
/**
 * Service for verifying Razorpay payments
 */
import { supabase } from "@/integrations/supabase/client";
import { VerifyPaymentParams } from "../razorpayTypes";
import { savePaymentRecord } from "../razorpayService";
import { BookingDetails } from "@/utils/types";

/**
 * Verify Razorpay payment with signature
 */
export const verifyRazorpayPayment = async (params: VerifyPaymentParams): Promise<boolean> => {
  try {
    const { paymentId, orderId, signature } = params;
    
    console.log("Verifying Razorpay payment:", { paymentId, orderId, signature: signature ? "provided" : "missing" });
    
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: {
        action: 'verify_payment',
        paymentId,
        orderData: {
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
        }
      }
    });
    
    if (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
    
    console.log("Payment verification response from Razorpay:", data);
    
    return data?.success === true && data?.verified === true;
  } catch (err) {
    console.error('Exception verifying payment:', err);
    return false;
  }
};

/**
 * Direct verification with Razorpay API - useful for QR/UPI payments
 * that may not come back through the normal callback flow
 * 
 * This can also be used to check a payment status by ID after the fact
 */
export const verifyAndSyncPayment = async (paymentId: string, bookingDetails?: BookingDetails): Promise<boolean> => {
  try {
    if (!paymentId) {
      console.error("Missing payment ID for verification");
      return false;
    }
    
    console.log("Direct verification of payment with Razorpay API:", paymentId);
    
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: {
        action: 'verify_payment',
        paymentId,
        checkOnly: true,
        includeDetails: true
      }
    });
    
    if (error) {
      console.error('Error in direct payment verification:', error);
      return false;
    }
    
    console.log("Direct verification result:", data);
    
    // If verification succeeded and we have payment and booking details, save the record
    if (data?.success && data?.verified && data?.payment && bookingDetails?.referenceId) {
      console.log("Payment verified, saving payment record with details from API");
      
      // Calculate amount in rupees from paise
      const amountInRupees = data.payment.amount ? data.payment.amount / 100 : 0;
      
      // Save payment details in database
      await savePaymentRecord({
        paymentId: data.payment.id,
        orderId: data.payment.order_id || '',
        amount: amountInRupees,
        referenceId: bookingDetails.referenceId,
        status: 'completed',
        bookingDetails
      });
    }
    
    // Handle different payment methods and statuses
    if (data?.payment?.method === 'upi' || data?.payment?.method === 'qr_code') {
      console.log(`Payment was made via ${data.payment.method} - may need special handling`);
      
      // For UPI/QR payments, we consider 'created' or 'authorized' as valid states
      if (data.payment?.status === 'created' || data.payment?.status === 'authorized') {
        console.log("QR/UPI payment in valid initial state");
        return true;
      }
    }
    
    return data?.success === true && data?.verified === true;
  } catch (err) {
    console.error('Exception in verifyAndSyncPayment:', err);
    return false;
  }
};

/**
 * Verify payment and ensure payment details are recorded
 */
export const verifyAndRecordPayment = async (
  paymentId: string,
  orderId: string | null,
  amount: number,
  referenceId: string,
  bookingDetails?: BookingDetails
): Promise<boolean> => {
  try {
    console.log(`Verifying payment and ensuring details are recorded: ${paymentId} for reference ${referenceId}`);
    
    // First check if this payment has already been verified
    const { data: existingPayment } = await supabase
      .from('consultations')
      .select('payment_status, payment_id')
      .eq('reference_id', referenceId)
      .eq('payment_id', paymentId)
      .eq('payment_status', 'completed')
      .single();
      
    if (existingPayment) {
      console.log("Payment already verified and recorded");
      return true;
    }
    
    // Verify the payment with Razorpay
    let isVerified = false;
    
    if (orderId) {
      // Try standard verification first if we have order ID
      isVerified = await verifyRazorpayPayment({
        paymentId,
        orderId,
        signature: undefined
      });
    }
    
    // If standard verification fails, try direct API verification
    if (!isVerified) {
      isVerified = await verifyAndSyncPayment(paymentId, bookingDetails);
    }
    
    // If verification was successful, ensure payment details are recorded
    if (isVerified && bookingDetails) {
      console.log("Payment verified, saving record");
      
      await savePaymentRecord({
        paymentId,
        orderId: orderId || '',
        amount,
        referenceId,
        status: 'completed',
        bookingDetails
      });
      
      return true;
    }
    
    return isVerified;
  } catch (error) {
    console.error("Error verifying and recording payment:", error);
    return false;
  }
};
