
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "@/utils/email/bookingEmails";
import { BookingDetails } from "@/utils/types";
import { determineServiceCategory } from "./serviceUtils";

/**
 * Send confirmation email for a consultation with better error handling and retry mechanism
 */
export async function sendEmailForConsultation(
  bookingDetails: BookingDetails
): Promise<boolean> {
  const MAX_EMAIL_RETRIES = 3;
  let emailRetryCount = 0;
  
  while (emailRetryCount < MAX_EMAIL_RETRIES) {
    try {
      console.log("Attempting to send confirmation email (attempt " + (emailRetryCount + 1) + ")");
      
      // If we have a reference ID but incomplete booking details, fetch the consultation data
      if (bookingDetails.referenceId && (!bookingDetails.email || !bookingDetails.clientName)) {
        const { data } = await supabase
          .from('consultations')
          .select('*')
          .eq('reference_id', bookingDetails.referenceId)
          .single();
          
        if (data) {
          // Create email data from consultation record
          bookingDetails = {
            clientName: data.client_name || bookingDetails.clientName,
            email: data.client_email || bookingDetails.email,
            referenceId: data.reference_id,
            consultationType: data.consultation_type,
            services: data.consultation_type ? data.consultation_type.split(',') : [],
            date: data.date ? new Date(data.date) : undefined,
            timeSlot: data.time_slot,
            timeframe: data.timeframe,
            message: data.message,
            serviceCategory: determineServiceCategory(data.consultation_type),
            highPriority: bookingDetails.highPriority,
            isResend: bookingDetails.isResend,
            isRecovery: bookingDetails.isRecovery
          };
        }
      }
      
      // Validate critical fields before sending
      if (!bookingDetails.email) {
        console.error("Cannot send email: missing email address");
        return false;
      }
      
      if (!bookingDetails.referenceId) {
        console.error("Cannot send email: missing reference ID");
        return false;
      }
      
      console.log(`Sending email to ${bookingDetails.email} for reference ${bookingDetails.referenceId}`);
      
      // Add high-priority flag for emails
      const emailResult = await sendBookingConfirmationEmail({
        ...bookingDetails,
        highPriority: true
      });
      
      if (emailResult && bookingDetails.referenceId) {
        // Update the consultation record to mark email as sent
        try {
          await supabase
            .from('consultations')
            .update({ 
              email_sent: true,
              status: 'confirmed' 
            })
            .eq('reference_id', bookingDetails.referenceId);
            
          console.log(`Consultation ${bookingDetails.referenceId} marked as email_sent=true`);
        } catch (updateError) {
          console.error("Error updating email_sent status:", updateError);
          // Not failing the overall operation if just the status update fails
        }
      }
      
      console.log("Email sending result:", emailResult);
      return !!emailResult;
    } catch (error) {
      console.error(`Email sending attempt ${emailRetryCount + 1} failed:`, error);
      emailRetryCount++;
      
      if (emailRetryCount < MAX_EMAIL_RETRIES) {
        const backoffDelay = emailRetryCount * 2000; // Exponential backoff
        console.log(`Retrying email in ${backoffDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      } else {
        console.error("All email sending attempts failed, adding to recovery queue");
        
        // Store the booking details for recovery
        try {
          if (bookingDetails.referenceId) {
            await supabase
              .from('consultations')
              .update({ 
                status: 'payment_received_needs_email'
              })
              .eq('reference_id', bookingDetails.referenceId);
          }
        } catch (e) {
          console.error("Error updating consultation for recovery:", e);
        }
        
        return false;
      }
    }
  }
  
  return false;
}

/**
 * Function to manually trigger resending of confirmation email 
 */
export async function resendConfirmationEmail(referenceId: string): Promise<boolean> {
  try {
    console.log(`Attempting to resend confirmation email for ${referenceId}`);
    
    // Fetch the consultation data
    const { data: consultation } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (!consultation) {
      console.error("Could not find consultation with reference ID:", referenceId);
      return false;
    }
    
    // Create booking details for the email
    const bookingDetails: BookingDetails = {
      clientName: consultation.client_name,
      email: consultation.client_email,
      referenceId: consultation.reference_id,
      consultationType: consultation.consultation_type,
      services: consultation.consultation_type ? consultation.consultation_type.split(',') : [],
      date: consultation.date ? new Date(consultation.date) : undefined,
      timeSlot: consultation.time_slot,
      timeframe: consultation.timeframe,
      message: consultation.message,
      serviceCategory: determineServiceCategory(consultation.consultation_type),
      highPriority: true,
      isResend: true
    };
    
    // Send the email
    return sendEmailForConsultation(bookingDetails);
  } catch (error) {
    console.error("Error resending confirmation email:", error);
    return false;
  }
}

// Expose the email resend function globally for debugging and manual recovery
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.resendConfirmationEmail = resendConfirmationEmail;
}
