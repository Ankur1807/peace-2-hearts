
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
  signature: string,
  bookingDetails: BookingDetails
): Promise<VerificationResult> {
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
      return { 
        success: false, 
        verified: false, 
        error: error.message 
      };
    }
    
    console.log("Verification result:", data);
    
    return {
      success: true,
      verified: data.verified || false,
      details: data
    };
  } catch (err) {
    console.error("Error in verifyPaymentAndCreateBooking:", err);
    return {
      success: false,
      verified: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
}
