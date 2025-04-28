
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
            highPriority: bookingDetails.highPriority
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
