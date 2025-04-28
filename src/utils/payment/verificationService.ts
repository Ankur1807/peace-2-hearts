import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";
import { determineServiceCategory } from "@/utils/payment/services/serviceUtils";

/**
 * Verify a payment with the server and handle the booking creation
 */
export const verifyPaymentAndCreateBooking = async (
  paymentId: string, 
  orderId: string, 
  signature: string | undefined,
  bookingDetails: BookingDetails
): Promise<{
  success: boolean;
  verified: boolean;
  emailSent: boolean;
  consultationId?: string;
  error?: string;
}> => {
  try {
    console.log(`Verifying payment and creating booking for ${paymentId}`);
    
    // Call our verify-payment edge function
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
          services: bookingDetails.services || [],
          date: bookingDetails.date ? bookingDetails.date.toISOString() : undefined,
          timeSlot: bookingDetails.timeSlot,
          timeframe: bookingDetails.timeframe,
          serviceCategory: bookingDetails.serviceCategory || determineServiceCategory(bookingDetails.consultationType),
          message: bookingDetails.message
        }
      }
    });
    
    if (error) {
      console.error("Error calling verify-payment function:", error);
      return { 
        success: false, 
        verified: false, 
        emailSent: false,
        error: error.message
      };
    }
    
    console.log("Verification response:", data);
    
    return { 
      success: data.success,
      verified: data.verified,
      emailSent: data.emailSent || false,
      consultationId: data.consultationId,
      error: data.error
    };
  } catch (err) {
    console.error("Exception in verifyPaymentAndCreateBooking:", err);
    return { 
      success: false, 
      verified: false,
      emailSent: false,
      error: err.message || "An unexpected error occurred"
    };
  }
};

/**
 * Check payment status for a payment ID
 * This is useful for verifying payments that didn't complete the full flow
 */
export const checkPaymentStatus = async (
  paymentId: string,
  bookingDetails?: Partial<BookingDetails>
): Promise<{
  success: boolean;
  verified: boolean;
  error?: string;
}> => {
  try {
    // If we have booking details, use the full verification flow
    if (bookingDetails && bookingDetails.referenceId) {
      return await verifyPaymentAndCreateBooking(paymentId, '', undefined, bookingDetails as BookingDetails);
    }
    
    // Otherwise just check the payment status
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: {
        paymentId,
        checkOnly: true
      }
    });
    
    if (error) {
      return { success: false, verified: false, error: error.message };
    }
    
    return { 
      success: data.success, 
      verified: data.verified || false,
      error: data.error
    };
  } catch (err) {
    return { 
      success: false, 
      verified: false,
      error: err.message
    };
  }
};
