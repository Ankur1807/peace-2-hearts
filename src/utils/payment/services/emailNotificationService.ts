
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "@/utils/emailService";
import { BookingDetails } from "@/utils/types";
import { determineServiceCategory } from "./serviceUtils";

/**
 * Send confirmation email for a consultation with better error handling
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
            services: data.consultation_type.split(','),
            date: data.date ? new Date(data.date) : undefined,
            timeSlot: data.time_slot,
            timeframe: data.timeframe,
            message: data.message,
            serviceCategory: determineServiceCategory(data.consultation_type),
            highPriority: bookingDetails.highPriority
          };
        }
      }
      
      // Add high-priority flag for emails
      const emailResult = await sendBookingConfirmationEmail(bookingDetails);
      
      if (emailResult && bookingDetails.referenceId) {
        // Update the consultation record to mark email as sent
        await supabase
          .from('consultations')
          .update({ email_sent: true })
          .eq('reference_id', bookingDetails.referenceId);
      }
      
      console.log("Email sending result:", emailResult);
      return !!emailResult;
    } catch (error) {
      console.error(`Email sending attempt ${emailRetryCount + 1} failed:`, error);
      emailRetryCount++;
      
      if (emailRetryCount < MAX_EMAIL_RETRIES) {
        console.log(`Retrying email in ${emailRetryCount * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, emailRetryCount * 2000));
      } else {
        console.error("All email sending attempts failed, will need manual recovery");
        return false;
      }
    }
  }
  
  return false;
}
