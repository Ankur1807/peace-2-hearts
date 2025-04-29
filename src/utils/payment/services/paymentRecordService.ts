
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";
import { createConsultationFromBookingDetails } from "@/utils/consultation/consultationRecovery";
import { sendEmailForConsultation } from "./emailNotificationService";
import { updateConsultationStatus } from "./serviceUtils";

// Define interface for parameters
export interface SavePaymentRecordParams {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
  status?: string;
  bookingDetails?: BookingDetails;
}

/**
 * Store payment details in session storage as a backup
 */
export function storePaymentDetailsInSession(
  params: {
    referenceId: string,
    paymentId: string,
    orderId?: string | null,
    amount?: number,
    bookingDetails?: BookingDetails
  }
): void {
  try {
    // Store essential payment details
    const { referenceId, paymentId, orderId, amount, bookingDetails } = params;
    
    sessionStorage.setItem(`payment_id_${referenceId}`, paymentId);
    if (orderId) sessionStorage.setItem(`order_id_${referenceId}`, orderId);
    if (amount) sessionStorage.setItem(`amount_${referenceId}`, amount.toString());
    
    // Store booking details if available
    if (bookingDetails) {
      sessionStorage.setItem(`booking_details_${referenceId}`, JSON.stringify({
        ...bookingDetails,
        date: bookingDetails.date ? 
          (bookingDetails.date instanceof Date ? 
            bookingDetails.date.toISOString() : bookingDetails.date) : 
          null
      }));
    }
    
    console.log(`Payment details stored in session for ${referenceId}`);
  } catch (error) {
    console.error('Error storing payment details in session:', error);
  }
}

/**
 * Retrieve payment details from session storage
 */
export function getPaymentDetailsFromSession(referenceId: string): {
  paymentId?: string;
  orderId?: string;
  amount?: number;
  bookingDetails?: BookingDetails;
} {
  try {
    const paymentId = sessionStorage.getItem(`payment_id_${referenceId}`);
    const orderId = sessionStorage.getItem(`order_id_${referenceId}`);
    const amountStr = sessionStorage.getItem(`amount_${referenceId}`);
    const bookingDetailsStr = sessionStorage.getItem(`booking_details_${referenceId}`);
    
    const result: {
      paymentId?: string;
      orderId?: string;
      amount?: number;
      bookingDetails?: BookingDetails;
    } = {};
    
    if (paymentId) result.paymentId = paymentId;
    if (orderId) result.orderId = orderId;
    if (amountStr) result.amount = parseFloat(amountStr);
    
    if (bookingDetailsStr) {
      try {
        const parsedDetails = JSON.parse(bookingDetailsStr);
        // Convert date string back to Date object if it exists
        if (parsedDetails.date) {
          parsedDetails.date = new Date(parsedDetails.date);
        }
        result.bookingDetails = parsedDetails;
      } catch (e) {
        console.error('Error parsing booking details:', e);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error retrieving payment details from session:', error);
    return {};
  }
}

/**
 * Clear payment details from session storage
 */
export function clearPaymentDetailsFromSession(referenceId: string): void {
  try {
    sessionStorage.removeItem(`payment_id_${referenceId}`);
    sessionStorage.removeItem(`order_id_${referenceId}`);
    sessionStorage.removeItem(`amount_${referenceId}`);
    sessionStorage.removeItem(`booking_details_${referenceId}`);
    
    console.log(`Payment details cleared from session for ${referenceId}`);
  } catch (error) {
    console.error('Error clearing payment details from session:', error);
  }
}

/**
 * Save payment record to database
 */
export const savePaymentRecord = async (params: SavePaymentRecordParams): Promise<boolean> => {
  const MAX_RETRIES = 3;
  let retryCount = 0;
  
  while (retryCount < MAX_RETRIES) {
    try {
      const { paymentId, orderId, amount, referenceId, status = 'completed', bookingDetails } = params;
      
      console.log(`Saving payment record (attempt ${retryCount + 1}):`, { 
        paymentId, orderId, amount, referenceId, status, hasBookingDetails: !!bookingDetails 
      });
      
      // Store payment details in session storage as a backup
      storePaymentDetailsInSession({
        referenceId,
        paymentId,
        orderId,
        amount,
        bookingDetails
      });

      // Find the consultation by reference ID
      let { data: consultationData, error: consultationError } = await supabase
        .from('consultations')
        .select('id, reference_id, client_name, client_email, date, time_slot, timeframe, consultation_type, message, payment_id')
        .eq('reference_id', referenceId)
        .single();
      
      // If consultation not found but we have booking details, create it
      if ((!consultationData || consultationError) && bookingDetails) {
        console.log("Consultation not found, attempting to create from booking details:", bookingDetails);
        
        const newConsultation = await createConsultationFromBookingDetails(bookingDetails);
        
        if (newConsultation) {
          console.log("Successfully created consultation from booking details:", newConsultation);
          consultationData = newConsultation;
        } else {
          console.error("Failed to create consultation from booking details");
          retryCount++;
          if (retryCount < MAX_RETRIES) {
            console.log(`Will retry in 1 second... (${retryCount}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          return false;
        }
      } else if (!consultationData && !bookingDetails) {
        console.error("No consultation found and no booking details provided to create one");
        return false;
      }
      
      // Update the consultation with payment information
      if (consultationData && (!consultationData.payment_id || consultationData.payment_id !== paymentId)) {
        console.log("Updating consultation with payment information:", {
          consultationId: consultationData.id,
          paymentId,
          orderId,
          amount
        });
        
        const { error: updateError } = await supabase
          .from('consultations')
          .update({
            payment_id: paymentId,
            order_id: orderId || null,
            amount: amount,
            payment_status: status,
            status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('reference_id', referenceId);
        
        if (updateError) {
          console.error("Error updating consultation with payment info:", updateError);
          retryCount++;
          if (retryCount < MAX_RETRIES) {
            console.log(`Will retry in 1 second... (${retryCount}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          return false;
        }
        
        console.log("Successfully updated consultation with payment info");
      } else {
        console.log("Payment already recorded for this consultation or no consultation found");
      }
      
      // Send confirmation email if booking details are available
      if (bookingDetails) {
        try {
          console.log("Sending email confirmation for booking");
          await sendEmailForConsultation(bookingDetails);
        } catch (emailError) {
          console.error("Error sending email confirmation:", emailError);
          // Don't retry just for email failure
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error in savePaymentRecord (attempt ${retryCount + 1}):`, error);
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        console.log(`Will retry in 1 second... (${retryCount}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      return false;
    }
  }
  
  return false;
};
