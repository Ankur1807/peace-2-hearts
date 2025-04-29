
import { supabase } from '@/integrations/supabase/client';
import { BookingDetails } from '@/utils/types';

interface VerificationResult {
  success: boolean;
  verified: boolean;
  error?: string;
  details?: any;
}

/**
 * Verify payment and create booking in one call
 */
export async function verifyPaymentAndCreateBooking(
  paymentId: string, 
  orderId: string,
  signature: string | undefined,
  bookingDetails: BookingDetails
): Promise<VerificationResult> {
  try {
    console.log(`Verifying payment and creating booking for ${paymentId}`);
    
    // Safety check for missing data - still try to proceed
    if (!signature) {
      console.warn("Missing signature in verification call, attempting to proceed anyway");
    }
    
    // Add specific validation for critical fields
    if (!paymentId) {
      console.error("Payment ID is missing");
      return { 
        success: false, 
        verified: false, 
        error: "Payment ID is missing" 
      };
    }
    
    if (!bookingDetails.referenceId) {
      console.error("Reference ID is missing");
      return { 
        success: false, 
        verified: false, 
        error: "Reference ID is missing" 
      };
    }
    
    // Call our verify-payment edge function
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: {
          paymentId,
          orderId,
          signature,
          bookingDetails: {
            clientName: bookingDetails.clientName,
            email: bookingDetails.email,
            phone: bookingDetails.phone,
            referenceId: bookingDetails.referenceId,
            consultationType: bookingDetails.consultationType,
            services: bookingDetails.services || [bookingDetails.consultationType],
            date: bookingDetails.date instanceof Date ? bookingDetails.date.toISOString() : bookingDetails.date,
            timeSlot: bookingDetails.timeSlot,
            timeframe: bookingDetails.timeframe,
            serviceCategory: bookingDetails.serviceCategory,
            message: bookingDetails.message,
            amount: bookingDetails.amount
          }
        }
      });
      
      if (error) {
        console.error("Error verifying payment with edge function:", error);
        
        // Store payment details in database even if verification fails
        // This ensures we don't lose payment information
        try {
          await storeEmergencyPaymentRecord(paymentId, orderId, bookingDetails);
        } catch (emergencyError) {
          console.error("Failed to store emergency payment record:", emergencyError);
        }
        
        return { 
          success: false, 
          verified: false, 
          error: error.message || "Payment verification failed" 
        };
      }
      
      console.log("Verification result:", data);
      
      // If email failed but payment verified, still return success
      if (data.verified && !data.emailSent) {
        console.warn("Payment verified but email sending failed");
        return {
          success: true,
          verified: true,
          details: {
            ...data,
            emailWarning: true
          }
        };
      }
      
      return {
        success: true,
        verified: data.verified || false,
        details: data
      };
    } catch (invokeError) {
      console.error("Error invoking verify-payment function:", invokeError);
      
      // Store payment details in database even if verification fails
      try {
        await storeEmergencyPaymentRecord(paymentId, orderId, bookingDetails);
      } catch (emergencyError) {
        console.error("Failed to store emergency payment record:", emergencyError);
      }
      
      return { 
        success: false, 
        verified: false, 
        error: invokeError instanceof Error ? invokeError.message : String(invokeError) 
      };
    }
  } catch (err) {
    console.error("Error in verifyPaymentAndCreateBooking:", err);
    return {
      success: false,
      verified: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

/**
 * Emergency fallback to store payment details in case verification fails
 * @deprecated Use edge function createConsultationRecord as the primary insert point
 */
async function storeEmergencyPaymentRecord(
  paymentId: string,
  orderId: string,
  bookingDetails: BookingDetails
): Promise<void> {
  try {
    console.log("Storing emergency payment record for", paymentId);
    
    const { error } = await supabase.from('consultations').insert({
      client_name: bookingDetails.clientName || "Emergency Recovery",
      client_email: bookingDetails.email || "recovery-needed@payment.error",
      reference_id: bookingDetails.referenceId || `emergency-${Date.now()}`,
      payment_id: paymentId,
      order_id: orderId,
      amount: bookingDetails.amount || 0,
      payment_status: "needs_verification",
      status: "payment_needs_verification",
      consultation_type: bookingDetails.consultationType || "emergency-recovery",
      time_slot: bookingDetails.timeSlot || "to_be_confirmed",
      message: `Emergency payment record created due to verification failure. Payment ID: ${paymentId}`,
      source: "fallback" // Mark the source as fallback
    });
    
    if (error) {
      console.error("Failed to store emergency payment record:", error);
    } else {
      console.log("Successfully stored emergency payment record");
    }
  } catch (e) {
    console.error("Exception in storeEmergencyPaymentRecord:", e);
  }
}
