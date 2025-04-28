
/**
 * Service for handling payment records in the database
 */
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "@/utils/emailService";
import { BookingDetails } from "@/utils/types";
import { createConsultationFromBookingDetails } from "@/utils/consultation/consultationRecovery";

/**
 * Save payment record to database with retry mechanism and transaction support
 */
export const savePaymentRecord = async (params: {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
  status?: string;
  bookingDetails?: BookingDetails;
}): Promise<boolean> => {
  const MAX_RETRIES = 3;
  let retryCount = 0;
  
  while (retryCount < MAX_RETRIES) {
    try {
      const { paymentId, orderId, amount, referenceId, status = 'completed', bookingDetails } = params;
      
      console.log(`Saving payment record (attempt ${retryCount + 1}):`, { 
        paymentId, 
        orderId, 
        amount, 
        referenceId,
        status,
        hasBookingDetails: !!bookingDetails
      });
      
      // Store payment details in session storage as a backup
      storePaymentDetailsInSession(referenceId, paymentId, orderId, amount, bookingDetails);

      // First, find the consultation by reference ID
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
          console.log("Successfully created consultation from booking details:", createdConsultation);
          
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
      
      if (consultationError) {
        console.error(`Attempt ${retryCount + 1}: Error finding consultation:`, consultationError);
        console.log(`Detailed error response:`, JSON.stringify(consultationError));
        
        // Log the specific consultation we're trying to find
        console.log(`Searching for consultation with reference ID: "${referenceId}"`);
        
        // If the consultation is not found, check if there are any consultations in the database
        const { data: allConsultations, error: checkError } = await supabase
          .from('consultations')
          .select('id, reference_id, client_name')
          .limit(5);
          
        if (!checkError && allConsultations) {
          console.log(`Recent consultations in database:`, allConsultations);
        }
        
        // Try with a more permissive query using substring match
        const { data: similarConsultations } = await supabase
          .from('consultations')
          .select('id, reference_id')
          .ilike('reference_id', `%${referenceId.substring(4, 10)}%`)
          .limit(5);
          
        if (similarConsultations && similarConsultations.length > 0) {
          console.log("Found similar consultations:", similarConsultations);
        }
        
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying in 1 second... (${retryCount}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        // If we made it here, we need to create a recovery record
        const recovery = await createRecoveryConsultation(referenceId, paymentId, amount, bookingDetails);
        if (recovery) {
          return true; // Recovery record created successfully
        }
        return false;
      }

      const consultationId = consultationData.id;
      console.log(`Found consultation ID ${consultationId} for payment record with reference ID: ${referenceId}`);

      // Check if payment record already exists for this consultation
      const { data: existingPayment, error: checkPaymentError } = await supabase
        .from('payments')
        .select('id, transaction_id')
        .eq('consultation_id', consultationId)
        .eq('transaction_id', paymentId)
        .maybeSingle();
        
      if (checkPaymentError) {
        console.error('Error checking existing payment:', checkPaymentError);
      }
      
      if (existingPayment) {
        console.log(`Payment record already exists for this consultation and transaction: ${existingPayment.id}`);
        
        // Update consultation status if needed
        await updateConsultationStatus(consultationId, status);
        
        // Send confirmation email - even if payment record exists, make sure email is sent
        await sendEmailForConsultation(consultationData, bookingDetails);
        
        return true;
      }

      // Save the payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({
          consultation_id: consultationId,
          amount: amount,
          transaction_id: paymentId,
          order_id: orderId,
          payment_status: status,
          payment_method: 'razorpay',
        })
        .select();
      
      if (paymentError) {
        console.error(`Attempt ${retryCount + 1}: Error saving payment record:`, paymentError);
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying in 1 second... (${retryCount}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return false;
      }

      console.log("Payment record inserted successfully:", paymentData);

      // Update consultation status to paid
      const updated = await updateConsultationStatus(consultationId, status);
      if (!updated) {
        console.warn("Payment record saved but consultation status update failed");
      }

      // Send confirmation email after successful payment record creation
      await sendEmailForConsultation(consultationData, bookingDetails);
      
      // Clear the backup from session storage on successful save
      clearPaymentDetailsFromSession(referenceId);
      
      return true;
    } catch (err) {
      console.error(`Attempt ${retryCount + 1}: Exception saving payment record:`, err);
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying in 1 second... (${retryCount}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      return false;
    }
  }
  
  return false;
};

/**
 * Store payment details in sessionStorage as a backup
 */
export const storePaymentDetailsInSession = (
  referenceId: string,
  paymentId: string,
  orderId: string,
  amount: number,
  bookingDetails?: any
) => {
  try {
    // Store payment IDs for recovery purposes
    sessionStorage.setItem(`payment_id_${referenceId}`, paymentId);
    sessionStorage.setItem(`order_id_${referenceId}`, orderId);
    sessionStorage.setItem(`amount_${referenceId}`, amount.toString());
    
    // Store booking details if available
    if (bookingDetails) {
      sessionStorage.setItem(
        `booking_details_${referenceId}`, 
        JSON.stringify(bookingDetails)
      );
    }
    
    // Store timestamp for cleanup purposes
    sessionStorage.setItem(
      `payment_timestamp_${referenceId}`, 
      new Date().toISOString()
    );
    
    console.log("Payment details stored in session storage for reference ID:", referenceId);
  } catch (error) {
    console.error("Error storing payment details in session:", error);
  }
};

/**
 * Retrieve payment details from sessionStorage
 */
export const getPaymentDetailsFromSession = (referenceId: string) => {
  try {
    const paymentId = sessionStorage.getItem(`payment_id_${referenceId}`);
    const orderId = sessionStorage.getItem(`order_id_${referenceId}`);
    const amountStr = sessionStorage.getItem(`amount_${referenceId}`);
    const bookingDetailsStr = sessionStorage.getItem(`booking_details_${referenceId}`);
    
    const amount = amountStr ? parseFloat(amountStr) : 0;
    const bookingDetails = bookingDetailsStr ? JSON.parse(bookingDetailsStr) : null;
    
    return {
      paymentId,
      orderId,
      amount,
      bookingDetails
    };
  } catch (error) {
    console.error("Error retrieving payment details from session:", error);
    return { paymentId: null, orderId: null, amount: 0, bookingDetails: null };
  }
};

/**
 * Clear payment details from sessionStorage after successful processing
 */
export const clearPaymentDetailsFromSession = (referenceId: string) => {
  try {
    sessionStorage.removeItem(`payment_id_${referenceId}`);
    sessionStorage.removeItem(`order_id_${referenceId}`);
    sessionStorage.removeItem(`amount_${referenceId}`);
    sessionStorage.removeItem(`booking_details_${referenceId}`);
    sessionStorage.removeItem(`payment_timestamp_${referenceId}`);
    
    console.log("Payment details cleared from session storage for reference ID:", referenceId);
  } catch (error) {
    console.error("Error clearing payment details from session:", error);
  }
};

/**
 * Create a recovery consultation for orphaned payments
 */
export const createRecoveryConsultation = async (
  referenceId: string, 
  paymentId: string, 
  amount: number,
  bookingDetails?: any
): Promise<boolean> => {
  try {
    console.log("Attempting to create a recovery consultation record");
    
    const clientName = bookingDetails?.clientName || 'Payment Received - Recovery Needed';
    const clientEmail = bookingDetails?.email || null;
    const consultationType = bookingDetails?.consultationType || 'recovery_needed';
    let message = `Payment received but consultation details missing. Payment ID: ${paymentId}, Amount: ${amount}`;
    
    if (bookingDetails) {
      message += `. Additional details: ${JSON.stringify(bookingDetails)}`;
    }
    
    const { data: recoveryData, error: recoveryError } = await supabase
      .from('consultations')
      .insert({
        reference_id: referenceId,
        status: 'payment_received_needs_details',
        consultation_type: consultationType,
        time_slot: bookingDetails?.timeSlot || 'recovery_needed',
        timeframe: bookingDetails?.timeframe || null,
        client_name: clientName,
        client_email: clientEmail,
        message: message
      })
      .select();
      
    if (recoveryError) {
      console.error("Failed to create recovery consultation:", recoveryError);
      return false;
    } else if (recoveryData) {
      console.log("Created recovery consultation:", recoveryData);
      
      // Use this newly created consultation for the payment record
      const recoveryConsultationId = recoveryData[0]?.id;
      if (recoveryConsultationId) {
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .insert({
            consultation_id: recoveryConsultationId,
            amount: amount,
            transaction_id: paymentId,
            order_id: '',
            payment_status: 'completed',
            payment_method: 'razorpay',
          })
          .select();
          
        if (paymentError) {
          console.error("Failed to save payment for recovery consultation:", paymentError);
          return false;
        } else {
          console.log("Created payment record for recovery consultation:", paymentData);
          return true;
        }
      }
    }
    
    return false;
  } catch (recoveryException) {
    console.error("Exception in recovery process:", recoveryException);
    return false;
  }
};

/**
 * Helper function to send confirmation email for a consultation
 */
const sendEmailForConsultation = async (
  consultationData: any,
  bookingDetails?: any
): Promise<boolean> => {
  try {
    const email = bookingDetails?.email || consultationData.client_email;
    
    if (!email) {
      console.error("Cannot send confirmation email - missing email address");
      return false;
    }

    console.log(`Attempting to send confirmation email for consultation: ${consultationData.reference_id}`);
    
    // Use booking details if available, otherwise format from consultation data
    const emailBookingDetails = bookingDetails || {
      clientName: consultationData.client_name || '',
      email: consultationData.client_email || '',
      referenceId: consultationData.reference_id || '',
      consultationType: consultationData.consultation_type || '',
      services: [consultationData.consultation_type || ''],
      date: consultationData.date ? new Date(consultationData.date) : undefined,
      timeSlot: consultationData.time_slot || undefined,
      timeframe: consultationData.timeframe || undefined,
      message: consultationData.message || '',
      serviceCategory: determineServiceCategory(consultationData.consultation_type)
    };
    
    console.log("Sending booking confirmation email with details:", emailBookingDetails);
    
    const result = await sendBookingConfirmationEmail(emailBookingDetails);
    
    console.log("Email sending result:", result);
    return result;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
};

/**
 * Helper function to determine service category from consultation type
 */
const determineServiceCategory = (consultationType: string): string => {
  if (!consultationType) return '';
  
  if (consultationType.includes('holistic') || 
      consultationType.includes('divorce-prevention') || 
      consultationType.includes('pre-marriage-clarity')) {
    return 'holistic';
  }
  
  if (consultationType.includes('legal') || 
      consultationType.includes('divorce') || 
      consultationType.includes('custody')) {
    return 'legal';
  }
  
  if (consultationType.includes('psychological') || 
      consultationType.includes('therapy') || 
      consultationType.includes('counseling')) {
    return 'psychological';
  }
  
  if (consultationType.includes('test')) {
    return 'test';
  }
  
  return '';
};

/**
 * Helper function to update consultation status
 */
const updateConsultationStatus = async (consultationId: string, status: string): Promise<boolean> => {
  try {
    console.log(`Updating consultation ${consultationId} status to: ${status}`);
    
    const { error } = await supabase
      .from('consultations')
      .update({ status: status === 'completed' ? 'paid' : status })
      .eq('id', consultationId);
    
    if (error) {
      console.error('Error updating consultation status:', error);
      return false;
    }
    
    console.log(`Consultation ${consultationId} status updated to: ${status}`);
    return true;
  } catch (err) {
    console.error('Exception updating consultation status:', err);
    return false;
  }
};
