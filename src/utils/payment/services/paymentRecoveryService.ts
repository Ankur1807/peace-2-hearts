
/**
 * Service for recovering payments and sending confirmation emails
 */
import { supabase } from "@/integrations/supabase/client";
import { savePaymentRecord } from "./paymentRecordService";
import { verifyAndSyncPayment } from "./paymentVerificationService";

/**
 * Attempt to recover payment records for consultations that have no payment record
 */
export const recoverPaymentRecord = async (referenceId: string, paymentId: string, amount: number, orderId?: string): Promise<boolean> => {
  try {
    console.log(`Attempting to recover payment record for consultation ${referenceId} with payment ${paymentId}`);
    
    // Step 1: Verify the payment exists and is valid with Razorpay
    const paymentVerified = await verifyAndSyncPayment(paymentId);
    
    if (!paymentVerified) {
      console.error(`Payment ${paymentId} couldn't be verified with Razorpay`);
      
      // Special handling for QR code payments which may be in a different state
      const { data, error } = await supabase.functions.invoke('razorpay', {
        body: {
          action: 'verify_payment',
          paymentId,
          checkOnly: true,
          includeDetails: true
        }
      });
      
      if (error) {
        console.error("Error checking payment status:", error);
      } else if (data?.payment?.method === 'upi' || data?.payment?.method === 'qr_code') {
        console.log("QR/UPI payment detected - may need manual verification");
        
        // Continue with recovery despite failed verification for QR/UPI payments
        if (data?.payment?.status === 'created' || data?.payment?.status === 'authorized') {
          console.log("Proceeding with recovery for QR/UPI payment in 'created' state");
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    
    console.log(`Payment ${paymentId} verified with Razorpay or is a QR/UPI payment in progress`);
    
    // Step 2: Create payment record and update consultation status
    const paymentSaved = await savePaymentRecord({
      paymentId,
      orderId: orderId || '',
      amount,
      referenceId,
      status: 'completed'
    });
    
    return paymentSaved;
  } catch (error) {
    console.error(`Error recovering payment record for ${referenceId}:`, error);
    return false;
  }
};

/**
 * Complete the booking after payment
 */
export const completeBookingAfterPayment = async (
  referenceId: string, 
  bookingDetails: any, // Using any as BookingDetails would require an import
  paymentId: string,
  amount: number
): Promise<boolean> => {
  try {
    console.log("Completing booking after payment:", { referenceId, paymentId, amount });
    
    // Save the payment record
    await savePaymentRecord({
      paymentId,
      orderId: '', // We might not have this at this point
      amount,
      referenceId,
    });
    
    return true;
  } catch (err) {
    console.error('Exception completing booking after payment:', err);
    return false;
  }
};
