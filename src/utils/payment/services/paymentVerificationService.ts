
/**
 * Service for verifying Razorpay payments
 */
import { supabase } from "@/integrations/supabase/client";
import { VerifyPaymentParams } from "../razorpayTypes";
import { savePaymentRecord } from "./paymentRecordService";
import { sendEmailForConsultation } from "./emailNotificationService";
import { BookingDetails } from "@/utils/types";
import { createBookingDetailsFromConsultation } from "@/utils/consultation/consultationRecovery";

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
      .select('payment_status, payment_id, email_sent, client_email')
      .eq('reference_id', referenceId)
      .eq('payment_id', paymentId)
      .single();
      
    if (existingPayment) {
      console.log("Payment already verified and recorded");
      
      // If payment is recorded but email wasn't sent, try to send it now
      if (existingPayment.payment_status === 'completed' && !existingPayment.email_sent) {
        console.log("Payment recorded but email not sent, attempting to send email now");
        
        // If we don't have booking details but have reference ID, fetch them
        let detailsToUse = bookingDetails;
        if (!detailsToUse || !detailsToUse.email) {
          console.log("Fetching consultation data to create booking details");
          const consultationData = await supabase
            .from('consultations')
            .select('*')
            .eq('reference_id', referenceId)
            .single()
            .then(res => res.data);
            
          if (consultationData) {
            detailsToUse = createBookingDetailsFromConsultation(consultationData);
          }
        }
        
        if (detailsToUse) {
          // Set high priority for recovery emails
          detailsToUse.highPriority = true;
          
          // Try to send the email
          const emailSent = await sendEmailForConsultation(detailsToUse);
          console.log("Email recovery attempt result:", emailSent);
        }
      }
      
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
    if (isVerified) {
      console.log("Payment verified, saving record");
      
      const savedRecord = await savePaymentRecord({
        paymentId,
        orderId: orderId || '',
        amount,
        referenceId,
        status: 'completed',
        bookingDetails
      });
      
      // After saving record, send confirmation email with high priority
      if (savedRecord && bookingDetails) {
        bookingDetails.highPriority = true;
        const emailResult = await sendEmailForConsultation(bookingDetails);
        console.log("Email sending result:", emailResult);
      }
      
      return true;
    }
    
    console.log("Payment verification failed");
    return false;
  } catch (err) {
    console.error('Exception in verifyAndRecordPayment:', err);
    return false;
  }
};

/**
 * Expose a global function to recover emails for specific reference IDs
 * This can be called from the browser console for manual recovery
 */
export const recoverEmailByReferenceId = async (referenceId: string): Promise<boolean> => {
  try {
    console.log(`Manual email recovery attempt for reference ID: ${referenceId}`);
    
    // Fetch consultation data
    const { data: consultation, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
      
    if (error || !consultation) {
      console.error("Could not find consultation with reference ID:", referenceId);
      return false;
    }
    
    // Create booking details from consultation
    const bookingDetails = createBookingDetailsFromConsultation(consultation);
    if (!bookingDetails) {
      console.error("Could not create booking details from consultation data");
      return false;
    }
    
    // Set high priority for manual recovery
    bookingDetails.highPriority = true;
    bookingDetails.isRecovery = true;
    
    // Send the email
    const emailResult = await sendEmailForConsultation(bookingDetails);
    console.log("Email recovery result:", emailResult);
    
    return emailResult;
  } catch (err) {
    console.error('Exception in recoverEmailByReferenceId:', err);
    return false;
  }
};

// Expose the recovery function globally for debugging and manual recovery
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.recoverEmailByReferenceId = recoverEmailByReferenceId;
}
