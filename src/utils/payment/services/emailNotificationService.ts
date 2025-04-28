
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "@/utils/emailService";
import { BookingDetails } from "@/utils/types";
import { determineServiceCategory } from "./serviceUtils";

/**
 * Send confirmation email for a consultation with better error handling
 */
export async function sendEmailForConsultation(
  consultationData: any,
  bookingDetails?: BookingDetails | null
): Promise<boolean> {
  const MAX_EMAIL_RETRIES = 3;
  let emailRetryCount = 0;
  
  while (emailRetryCount < MAX_EMAIL_RETRIES) {
    try {
      console.log("Attempting to send confirmation email (attempt " + (emailRetryCount + 1) + ")");
      
      // If bookingDetails not provided, try to fetch them from consultation data
      if (!bookingDetails && consultationData?.reference_id) {
        const { data } = await supabase
          .from('consultations')
          .select('*')
          .eq('reference_id', consultationData.reference_id)
          .single();
          
        if (data) {
          consultationData = data;
        }
      }
      
      // Use booking details if available, otherwise create from consultation data
      const emailData = bookingDetails || {
        clientName: consultationData.client_name,
        email: consultationData.client_email,
        referenceId: consultationData.reference_id,
        consultationType: consultationData.consultation_type,
        services: consultationData.consultation_type.split(','),
        date: consultationData.date ? new Date(consultationData.date) : undefined,
        timeSlot: consultationData.time_slot,
        timeframe: consultationData.timeframe,
        message: consultationData.message,
        serviceCategory: determineServiceCategory(consultationData.consultation_type)
      };
      
      // Add high-priority flag for emails
      const emailResult = await sendBookingConfirmationEmail({
        ...emailData,
        highPriority: true
      });
      
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
