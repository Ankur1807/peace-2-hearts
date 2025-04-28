
/**
 * Service for verifying Razorpay payments
 */
import { supabase } from "@/integrations/supabase/client";
import { VerifyPaymentParams } from "../razorpayTypes";

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
export const verifyAndSyncPayment = async (paymentId: string): Promise<boolean> => {
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
