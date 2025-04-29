
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";
import { determineServiceCategory } from "./serviceUtils";

/**
 * Send confirmation email for a consultation with better error handling and retry mechanism
 */
export async function sendEmailForConsultation(
  bookingDetails: BookingDetails
): Promise<boolean> {
  // Import the email sending functionality from the dedicated email module
  const { sendBookingConfirmationEmail } = await import('@/utils/email/bookingEmails');
  
  try {
    console.log("Sending consultation confirmation email");
    
    // Validate critical fields before sending
    if (!bookingDetails.email) {
      console.error("Cannot send email: missing email address");
      return false;
    }
    
    if (!bookingDetails.referenceId) {
      console.error("Cannot send email: missing reference ID");
      return false;
    }
    
    // If we have a reference ID but incomplete booking details, fetch the consultation data
    if (bookingDetails.referenceId && (!bookingDetails.email || !bookingDetails.clientName)) {
      const { data } = await supabase
        .from('consultations')
        .select('*')
        .eq('reference_id', bookingDetails.referenceId)
        .single();
        
      if (data) {
        // Determine service category or use the existing one
        const serviceCategory = data.service_category || determineServiceCategory(data.consultation_type);
        
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
          serviceCategory: serviceCategory,
          highPriority: bookingDetails.highPriority,
          isResend: bookingDetails.isResend,
          isRecovery: bookingDetails.isRecovery
        };
      }
    }
    
    console.log(`Sending email to ${bookingDetails.email} for reference ${bookingDetails.referenceId}`);
    
    // Add high-priority flag for emails
    const emailResult = await sendBookingConfirmationEmail({
      ...bookingDetails,
      highPriority: true
    });
    
    if (emailResult && bookingDetails.referenceId) {
      // Update the consultation record to mark email as sent
      await updateEmailSentStatus(bookingDetails.referenceId);
    }
    
    console.log("Email sending result:", emailResult);
    return !!emailResult;
  } catch (error) {
    console.error("Error sending consultation email:", error);
    
    // Store the booking details for recovery if needed
    if (bookingDetails.referenceId) {
      await markConsultationForRecovery(bookingDetails.referenceId);
    }
    
    return false;
  }
}

/**
 * Update the consultation record to mark email as sent
 */
async function updateEmailSentStatus(referenceId: string): Promise<void> {
  try {
    await supabase
      .from('consultations')
      .update({ 
        email_sent: true,
        status: 'confirmed' 
      })
      .eq('reference_id', referenceId);
      
    console.log(`Consultation ${referenceId} marked as email_sent=true`);
  } catch (updateError) {
    console.error("Error updating email_sent status:", updateError);
    // Not failing the overall operation if just the status update fails
  }
}

/**
 * Mark a consultation for email recovery
 */
async function markConsultationForRecovery(referenceId: string): Promise<void> {
  try {
    await supabase
      .from('consultations')
      .update({ 
        status: 'payment_received_needs_email'
      })
      .eq('reference_id', referenceId);
      
    console.log(`Consultation ${referenceId} marked for email recovery`);
  } catch (error) {
    console.error("Error updating consultation for recovery:", error);
  }
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
    
    // Determine service category or use the existing one
    const serviceCategory = consultation.service_category || determineServiceCategory(consultation.consultation_type);
    
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
      serviceCategory: serviceCategory,
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
