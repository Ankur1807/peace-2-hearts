
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
    orderId?: string,
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
        .select('id, reference_id, client_name, client_email, date, time_slot, timeframe, consultation_type, message')
        .eq('reference_id', referenceId)
        .single();
      
      // If consultation not found but we have booking details, create it
      if (consultationError && bookingDetails) {
        console.log("Consultation not found, attempting to create from booking details:", bookingDetails);
        
        const createdConsultation = await createConsultationFromBookingDetails(bookingDetails);
        if (createdConsultation) {
          console.log("Successfully created consultation from booking details");
          
          // Retry fetching the newly created consultation
          const { data: newConsultation, error: newError } = await supabase
            .from('consultations')
            .select('id, reference_id, client_name, client_email, date, time_slot, timeframe, consultation_type, message')
            .eq('reference_id', referenceId)
            .single();
            
          if (!newError && newConsultation) {
            consultationData = newConsultation;
            consultationError = null;
          }
        }
      }
      
      // If consultation still not found, create a minimal placeholder
      if (consultationError) {
        console.log("Creating a minimal placeholder consultation record");
        
        const { data: placeholderData, error: placeholderError } = await supabase
          .from('consultations')
          .insert({
            reference_id: referenceId,
            payment_id: paymentId,
            order_id: orderId,
            amount: amount,
            payment_status: status,
            status: 'payment_received_needs_details',
            consultation_type: 'recovery_needed',
            client_name: 'Payment Received - Recovery Needed',
            message: `Payment received but consultation details missing. Payment ID: ${paymentId}, Amount: ${amount}`,
            time_slot: 'to_be_scheduled' // Adding the required time_slot field
          })
          .select();
          
        if (placeholderError) {
          console.error(`Attempt ${retryCount + 1}: Error creating placeholder consultation:`, placeholderError);
          retryCount++;
          if (retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          return false;
        } else {
          consultationData = placeholderData[0];
          consultationError = null;
        }
      }

      // Update consultation with payment details
      await updateConsultationStatus(
        referenceId, 
        status, 
        paymentId, 
        amount, 
        orderId
      );
      
      console.log("Updated consultation with payment information");

      // Send confirmation email if we have either consultation data or booking details
      if (consultationData || bookingDetails) {
        // Make sure we have a complete booking details object with serviceCategory
        let completeBookingDetails: BookingDetails;
        
        if (bookingDetails) {
          completeBookingDetails = bookingDetails;
        } else {
          // Create booking details from consultation data
          const serviceCategory = consultationData.consultation_type?.toLowerCase().includes('legal') ? 
            'legal' : consultationData.consultation_type?.toLowerCase().includes('holistic') ? 
            'holistic' : 'mental-health';
            
          completeBookingDetails = {
            clientName: consultationData.client_name,
            email: consultationData.client_email,
            referenceId: consultationData.reference_id,
            consultationType: consultationData.consultation_type,
            services: consultationData.consultation_type ? consultationData.consultation_type.split(',') : [],
            date: consultationData.date ? new Date(consultationData.date) : undefined,
            timeSlot: consultationData.time_slot,
            timeframe: consultationData.timeframe,
            message: consultationData.message,
            serviceCategory: serviceCategory
          };
        }
        
        const emailResult = await sendEmailForConsultation(completeBookingDetails);
        console.log("Email sending result:", emailResult);
        
        if (emailResult) {
          // Update the consultation record to mark email as sent
          await supabase
            .from('consultations')
            .update({ email_sent: true })
            .eq('reference_id', referenceId);
          
          console.log("Consultation marked as email_sent");
        }
      }
      
      clearPaymentDetailsFromSession(referenceId);
      return true;
    } catch (err) {
      console.error(`Attempt ${retryCount + 1}: Exception saving payment record:`, err);
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      return false;
    }
  }
  
  return false;
};
