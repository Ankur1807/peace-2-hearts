
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails, PaymentRecord, SavePaymentRecordParams } from "@/utils/types";
import { createConsultationFromBookingDetails } from "@/utils/consultation/consultationRecovery";
import { sendEmailForConsultation } from "./emailNotificationService";
import { storePaymentDetailsInSession, clearPaymentDetailsFromSession } from "./paymentStorageService";
import { updateConsultationStatus } from "./serviceUtils";

/**
 * Save payment record to database with retry mechanism and transaction support
 */
export const savePaymentRecord = async (params: SavePaymentRecordParams): Promise<boolean> => {
  const MAX_RETRIES = 3;
  let retryCount = 0;
  let emailSent = false;
  
  while (retryCount < MAX_RETRIES) {
    try {
      const { paymentId, orderId, amount, referenceId, status = 'completed', bookingDetails } = params;
      
      console.log(`Saving payment record (attempt ${retryCount + 1}):`, { 
        paymentId, orderId, amount, referenceId, status, hasBookingDetails: !!bookingDetails 
      });
      
      // Store payment details in session storage as a backup
      storePaymentDetailsInSession(referenceId, paymentId, orderId, amount, bookingDetails);

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
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return false;
      }

      const consultationId = consultationData.id;
      console.log(`Found consultation ID ${consultationId} for payment record with reference ID: ${referenceId}`);

      // Check if payment record already exists
      const { data: existingPayment, error: checkPaymentError } = await supabase
        .from('payments')
        .select('id, transaction_id, email_sent')
        .eq('consultation_id', consultationId)
        .eq('transaction_id', paymentId)
        .maybeSingle();
        
      if (existingPayment) {
        console.log(`Payment record already exists: ${existingPayment.id}`);
        
        await updateConsultationStatus(consultationId, status);
        
        if (!existingPayment.email_sent) {
          emailSent = await sendEmailForConsultation(consultationData, bookingDetails);
          
          if (emailSent) {
            await supabase
              .from('payments')
              .update({ email_sent: true })
              .eq('id', existingPayment.id);
          }
        } else {
          emailSent = true;
        }
        
        return true;
      }

      // Save new payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({
          consultation_id: consultationId,
          amount: amount,
          transaction_id: paymentId,
          order_id: orderId,
          payment_status: status,
          payment_method: 'razorpay',
          email_sent: false
        })
        .select<'payments', PaymentRecord>();
      
      if (paymentError) {
        console.error(`Attempt ${retryCount + 1}: Error saving payment record:`, paymentError);
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return false;
      }

      console.log("Payment record inserted successfully:", paymentData);

      // Update consultation status and send confirmation email
      await updateConsultationStatus(consultationId, status);
      emailSent = await sendEmailForConsultation(consultationData, bookingDetails);
      
      if (emailSent && paymentData && paymentData.length > 0) {
        await supabase
          .from('payments')
          .update({ email_sent: true })
          .eq('id', paymentData[0].id);
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
    } 
    
    if (recoveryData) {
      console.log("Created recovery consultation:", recoveryData);
      
      const recoveryConsultationId = recoveryData[0]?.id;
      if (recoveryConsultationId) {
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            consultation_id: recoveryConsultationId,
            amount: amount,
            transaction_id: paymentId,
            order_id: '',
            payment_status: 'completed',
            payment_method: 'razorpay',
          });
          
        if (paymentError) {
          console.error("Failed to save payment for recovery consultation:", paymentError);
          return false;
        }
        
        console.log("Created payment record for recovery consultation");
        return true;
      }
    }
    
    return false;
  } catch (recoveryException) {
    console.error("Exception in recovery process:", recoveryException);
    return false;
  }
};
