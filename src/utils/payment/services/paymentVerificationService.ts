
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";
import { fetchBookingDetailsByReference } from "@/utils/email/bookingEmailService";

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
    
    // Call the verify-payment edge function which handles all database operations
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
    
    // Store transaction reference in session for user recovery
    storePaymentDetailsInSession({
      paymentId,
      orderId,
      amount: bookingDetails?.amount || 0,
      referenceId
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error in verifyRazorpayPayment:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Store payment details in session storage for recovery
 */
function storePaymentDetailsInSession(details: {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
}): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      // Save the main payment reference
      window.sessionStorage.setItem('lastPaymentReferenceId', details.referenceId);
      
      // Save full payment details
      const paymentKey = `payment_${details.referenceId}`;
      window.sessionStorage.setItem(paymentKey, JSON.stringify({
        referenceId: details.referenceId,
        paymentId: details.paymentId,
        orderId: details.orderId,
        amount: details.amount,
        timestamp: new Date().toISOString()
      }));
      
      console.log(`Payment details stored in session for ${details.referenceId}`);
    }
  } catch (error) {
    console.error('Error storing payment details in session:', error);
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
    
    // Send the email via edge function
    console.log(`Found consultation, sending recovery email for: ${referenceId}`);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'booking-confirmation',
        clientName: bookingDetails.clientName,
        email: bookingDetails.email,
        referenceId: bookingDetails.referenceId,
        consultationType: bookingDetails.consultationType,
        services: bookingDetails.services,
        date: bookingDetails.date instanceof Date ? bookingDetails.date.toISOString() : bookingDetails.date,
        timeSlot: bookingDetails.timeSlot,
        timeframe: bookingDetails.timeframe,
        serviceCategory: bookingDetails.serviceCategory,
        highPriority: true,
        isRecovery: true
      }
    });
    
    if (error) {
      console.error(`Error sending recovery email for ${referenceId}:`, error);
      return false;
    }
    
    console.log(`Recovery email sent successfully for ${referenceId}:`, data);
    return true;
    
  } catch (error) {
    console.error(`Error recovering email for reference ID ${referenceId}:`, error);
    return false;
  }
}
