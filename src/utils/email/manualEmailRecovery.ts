
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmationEmail } from "./bookingEmails";
import { fetchConsultationData, createBookingDetailsFromConsultation } from "@/utils/consultation/consultationRecovery";

/**
 * Manually trigger email recovery for a specific reference ID
 * This function can be called from the browser console
 */
export async function recoverEmailByReferenceId(referenceId: string): Promise<boolean> {
  try {
    console.log(`Attempting to recover email for reference ID: ${referenceId}`);
    
    // First, fetch the consultation data
    const consultationData = await fetchConsultationData(referenceId);
    
    if (!consultationData) {
      console.error(`No consultation found with reference ID: ${referenceId}`);
      return false;
    }
    
    // Create booking details from consultation
    const bookingDetails = createBookingDetailsFromConsultation(consultationData);
    
    if (!bookingDetails) {
      console.error(`Could not create booking details from consultation data`);
      return false;
    }
    
    // Try to send the email with high priority
    const emailResult = await sendBookingConfirmationEmail({
      ...bookingDetails,
      isRecovery: true,
      highPriority: true
    });
    
    if (emailResult) {
      console.log(`Successfully sent recovery email for reference ID: ${referenceId}`);
      
      // Check if there's a payment record to update
      const { data: payments } = await supabase
        .from('payments')
        .select('id')
        .eq('consultation_id', consultationData.id);
      
      if (payments && payments.length > 0) {
        // Update payment record to mark email as sent
        await supabase
          .from('payments')
          .update({ email_sent: true, recovery_timestamp: new Date().toISOString() })
          .eq('id', payments[0].id);
      }
      
      return true;
    } else {
      console.error(`Failed to send recovery email for reference ID: ${referenceId}`);
      return false;
    }
  } catch (error) {
    console.error(`Error in manual email recovery:`, error);
    return false;
  }
}

// Add this function to window so it can be called from the console
if (typeof window !== 'undefined') {
  // @ts-ignore - Window extension
  window.recoverEmailByReferenceId = recoverEmailByReferenceId;
}
