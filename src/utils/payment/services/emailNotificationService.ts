
import { supabase } from '@/integrations/supabase/client';
import { BookingDetails } from '@/utils/types';
import { sendBookingConfirmationEmail } from '@/utils/email';

/**
 * Send email for a consultation booking
 * Now includes admin@peace2hearts.com as BCC recipient
 */
export async function sendEmailForConsultation(bookingDetails: BookingDetails): Promise<boolean> {
  try {
    console.log(`[EMAIL] Sending email for booking ${bookingDetails.referenceId}`);
    
    // Always add admin email as a BCC recipient
    const adminEmail = "admin@peace2hearts.com";
    const bookingDetailsWithAdmin = {
      ...bookingDetails,
      bcc: adminEmail // Add BCC field for admin notification
    };
    
    console.log(`[EMAIL] Adding admin BCC: ${adminEmail}`);
    
    // Call the booking confirmation email function with admin BCC
    const emailSent = await sendBookingConfirmationEmail(bookingDetailsWithAdmin);
    
    if (emailSent) {
      // Update the consultation record to mark email as sent
      console.log(`[EMAIL] Email sent successfully, updating email_sent flag to true`);
      const { error } = await supabase
        .from('consultations')
        .update({ email_sent: true })
        .eq('reference_id', bookingDetails.referenceId);
      
      if (error) {
        console.error(`[EMAIL] Error updating email_sent status for ${bookingDetails.referenceId}:`, error);
      } else {
        console.log(`[EMAIL] Updated email_sent status to true for ${bookingDetails.referenceId}`);
      }
      
      return true;
    } else {
      console.error(`[EMAIL] Failed to send email for ${bookingDetails.referenceId}`);
      return false;
    }
  } catch (error) {
    console.error(`[EMAIL] Exception sending email for ${bookingDetails.referenceId}:`, error);
    return false;
  }
}

/**
 * Resend confirmation email for a consultation
 * Now includes admin@peace2hearts.com as BCC recipient
 */
export async function resendConsultationEmail(referenceId: string): Promise<boolean> {
  try {
    console.log(`[EMAIL] Resending email for booking ${referenceId}`);
    
    // Fetch the consultation record
    const { data: consultation, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error || !consultation) {
      console.error(`[EMAIL] Error fetching consultation for ${referenceId}:`, error);
      return false;
    }
    
    // Convert to booking details
    const bookingDetails: BookingDetails = {
      clientName: consultation.client_name || '',
      email: consultation.client_email || '',
      referenceId: consultation.reference_id || '',
      consultationType: consultation.consultation_type || '',
      date: consultation.date ? new Date(consultation.date) : undefined,
      timeSlot: consultation.time_slot || '',
      timeframe: consultation.timeframe || '',
      message: consultation.message || '',
      amount: consultation.amount || 0,
      services: consultation.consultation_type ? [consultation.consultation_type] : [],
      isResend: true,
      phone: consultation.client_phone || '',
      highPriority: true,
      bcc: "admin@peace2hearts.com" // Always include admin email as BCC
    };
    
    console.log(`[EMAIL] Resending with admin BCC to: admin@peace2hearts.com`);
    
    // Send the email
    return await sendEmailForConsultation(bookingDetails);
  } catch (error) {
    console.error(`[EMAIL] Exception resending email for ${referenceId}:`, error);
    return false;
  }
}
