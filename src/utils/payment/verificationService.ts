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
          date: bookingDetails.date instanceof Date ? bookingDetails.date.toISOString() : bookingDetails.date,
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

/**
 * Process successful payment and create booking
 */
export async function processSuccessfulPaymentAndCreateBooking(
  paymentId: string,
  bookingDetails: BookingDetails,
  orderId?: string
): Promise<{ success: boolean; referenceId: string | null }> {
  try {
    console.log("Processing successful payment:", { paymentId, bookingDetails });
    
    // Check for existing booking with this reference ID
    if (bookingDetails.referenceId) {
      const { data: existingBooking } = await supabase
        .from('consultations')
        .select('id, reference_id')
        .eq('reference_id', bookingDetails.referenceId)
        .maybeSingle();
      
      if (existingBooking) {
        console.log("Booking exists, updating payment status:", existingBooking);
        const { error: updateError } = await supabase
          .from('consultations')
          .update({
            payment_id: paymentId,
            payment_status: 'completed',
            status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('reference_id', bookingDetails.referenceId);
        
        if (updateError) {
          console.error("Error updating existing booking:", updateError);
          return { success: false, referenceId: bookingDetails.referenceId };
        }
        
        return { success: true, referenceId: bookingDetails.referenceId };
      }
    }
    
    // If no existing booking, create a new one
    const newBookingData = {
      client_name: bookingDetails.clientName,
      client_email: bookingDetails.email,
      client_phone: bookingDetails.phone || '',
      consultation_type: bookingDetails.consultationType,
      date: bookingDetails.date ? new Date(bookingDetails.date).toISOString() : null,
      time_slot: bookingDetails.timeSlot || '',
      timeframe: bookingDetails.timeframe || '',
      message: bookingDetails.message || '',
      payment_id: paymentId,
      payment_status: 'completed',
      status: 'confirmed',
      amount: bookingDetails.amount || 0,
      reference_id: bookingDetails.referenceId || generateReferenceId(),
      order_id: orderId || null,
      service_category: bookingDetails.serviceCategory || null
    };
    
    console.log("Creating new booking with data:", newBookingData);
    
    const { data, error } = await supabase
      .from('consultations')
      .insert(newBookingData)
      .select('reference_id')
      .single();
    
    if (error) {
      console.error("Error creating booking:", error);
      return { success: false, referenceId: null };
    }
    
    console.log("Booking created successfully:", data);
    return { success: true, referenceId: data.reference_id };
  } catch (error) {
    console.error("Exception in processSuccessfulPaymentAndCreateBooking:", error);
    return { success: false, referenceId: null };
  }
}

// Helper function to generate reference ID if not provided
function generateReferenceId(): string {
  const timestamp = new Date().getTime().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `P2H-${timestamp}-${randomStr}`;
}
