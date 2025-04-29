
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";
import { sendBookingConfirmationEmail } from "@/utils/email/bookingEmails";

/**
 * Sends an email notification for a consultation booking
 */
export async function sendEmailForConsultation(bookingDetails: BookingDetails): Promise<boolean> {
  try {
    console.log(`Sending email notification for consultation ${bookingDetails.referenceId}`);
    
    // Check for required fields
    if (!bookingDetails.referenceId || !bookingDetails.email) {
      console.error("Missing required fields for email notification:", { 
        hasReferenceId: !!bookingDetails.referenceId,
        hasEmail: !!bookingDetails.email
      });
      return false;
    }

    // Send the email using our email service
    const emailSent = await sendBookingConfirmationEmail(bookingDetails);
    
    // If email was sent successfully, update the consultation record
    if (emailSent) {
      console.log(`Email sent successfully for ${bookingDetails.referenceId}`);
      
      try {
        const { error } = await supabase
          .from('consultations')
          .update({ email_sent: true })
          .eq('reference_id', bookingDetails.referenceId);
        
        if (error) {
          console.error("Error updating consultation email_sent status:", error);
        }
      } catch (updateError) {
        console.error("Exception updating consultation email_sent status:", updateError);
      }
      
      return true;
    } else {
      console.error(`Failed to send email for ${bookingDetails.referenceId}`);
      return false;
    }
  } catch (error) {
    console.error("Error sending email notification:", error);
    return false;
  }
}

/**
 * Resends a consultation confirmation email
 */
export async function resendConsultationEmail(referenceId: string): Promise<boolean> {
  try {
    console.log(`Attempting to resend email for consultation ${referenceId}`);
    
    // Fetch the consultation details
    const { data: consultation, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error || !consultation) {
      console.error("Error fetching consultation for email resend:", error);
      return false;
    }
    
    // Create booking details from the consultation
    const bookingDetails: BookingDetails = {
      referenceId: consultation.reference_id,
      clientName: consultation.client_name,
      email: consultation.client_email,
      consultationType: consultation.consultation_type,
      services: consultation.consultation_type ? consultation.consultation_type.split(',') : [],
      date: consultation.date ? new Date(consultation.date) : undefined,
      timeSlot: consultation.time_slot,
      timeframe: consultation.timeframe,
      message: consultation.message,
      amount: consultation.amount,
      isResend: true // Flag to indicate this is a resend
    };
    
    // Send the email
    return await sendEmailForConsultation(bookingDetails);
  } catch (error) {
    console.error("Error in resendConsultationEmail:", error);
    return false;
  }
}

/**
 * Check if an email has been sent for a consultation
 */
export async function checkEmailSentStatus(referenceId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('email_sent')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("Error checking email sent status:", error);
      return false;
    }
    
    return data?.email_sent || false;
  } catch (error) {
    console.error("Error in checkEmailSentStatus:", error);
    return false;
  }
}
