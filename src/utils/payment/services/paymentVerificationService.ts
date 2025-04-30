
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";
import { savePaymentRecord } from "./paymentRecordService";
import { fetchBookingDetailsByReference } from "@/utils/email/bookingEmailService";
import { sendEmailForConsultation } from "./emailNotificationService";

/**
 * Verify a Razorpay payment with the server
 */
export async function verifyRazorpayPayment(
  paymentId: string,
  orderId: string,
  signature: string,
  referenceId: string,
  bookingDetails?: BookingDetails
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Verifying payment: ${paymentId} for reference: ${referenceId}`);
    
    // Call the verify-payment edge function
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: {
        paymentId,
        orderId,
        signature,
        bookingDetails: bookingDetails ? {
          clientName: bookingDetails.clientName,
          email: bookingDetails.email,
          phone: bookingDetails.phone,
          referenceId: bookingDetails.referenceId,
          consultationType: bookingDetails.consultationType,
          services: bookingDetails.services || [bookingDetails.consultationType],
          date: bookingDetails.date ? 
            (bookingDetails.date instanceof Date ? 
              bookingDetails.date.toISOString() : bookingDetails.date) : undefined,
          timeSlot: bookingDetails.timeSlot,
          timeframe: bookingDetails.timeframe,
          message: bookingDetails.message,
          serviceCategory: bookingDetails.serviceCategory,
          amount: bookingDetails.amount
        } : undefined
      }
    });
    
    if (error) {
      console.error("Error verifying payment with edge function:", error);
      return { success: false, error: error.message };
    }
    
    if (!data.success || !data.verified) {
      console.error("Payment verification failed:", data);
      return { success: false, error: data.error || "Payment verification failed" };
    }
    
    console.log("Payment verified successfully:", data);
    
    // Save payment record locally
    if (bookingDetails) {
      await savePaymentRecord({
        paymentId,
        orderId,
        amount: bookingDetails.amount || 0,
        referenceId,
        bookingDetails
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in verifyRazorpayPayment:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify and sync a payment with the server
 */
export async function verifyAndSyncPayment(
  paymentId: string
): Promise<boolean> {
  try {
    // Call the Razorpay API via our edge function
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: {
        action: 'verify_payment',
        paymentId,
        checkOnly: true
      }
    });
    
    if (error) {
      console.error("Error verifying payment:", error);
      return false;
    }
    
    if (!data.verified) {
      console.error("Payment verification failed:", data);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in verifyAndSyncPayment:", error);
    return false;
  }
}

/**
 * Verify payment and record in database
 */
export async function verifyAndRecordPayment(
  referenceId: string,
  paymentId: string,
  amount: number
): Promise<boolean> {
  try {
    // First verify the payment is valid
    const isValid = await verifyAndSyncPayment(paymentId);
    
    if (!isValid) {
      console.error(`Payment ${paymentId} is not valid`);
      return false;
    }
    
    // Record the payment in the database
    return await savePaymentRecord({
      paymentId,
      orderId: '',
      amount,
      referenceId
    });
  } catch (error) {
    console.error("Error in verifyAndRecordPayment:", error);
    return false;
  }
}

/**
 * Recover email sending for a payment by reference ID
 */
export async function recoverEmailByReferenceId(referenceId: string): Promise<boolean> {
  try {
    console.log(`Attempting to recover email for payment with reference ID: ${referenceId}`);
    
    // First check if this consultation exists
    const bookingDetails = await fetchBookingDetailsByReference(referenceId);
    
    if (!bookingDetails) {
      console.error(`No consultation found with reference ID: ${referenceId}`);
      return false;
    }
    
    // Send the email
    console.log(`Found consultation, sending recovery email for: ${referenceId}`);
    const emailSent = await sendEmailForConsultation({
      ...bookingDetails,
      isRecovery: true,
      highPriority: true
    });
    
    return emailSent;
  } catch (error) {
    console.error(`Error recovering email for reference ID ${referenceId}:`, error);
    return false;
  }
}
