
import { supabase } from '@/integrations/supabase/client';
import { BookingDetails } from '@/utils/types';
import { sendBookingConfirmationEmail } from '@/utils/email';

/**
 * Send email for a consultation booking
 */
export async function sendEmailForConsultation(bookingDetails: BookingDetails): Promise<boolean> {
  try {
    console.log(`Sending email for booking ${bookingDetails.referenceId}`);
    
    // Call the booking confirmation email function
    const emailSent = await sendBookingConfirmationEmail(bookingDetails);
    
    if (emailSent) {
      // Update the consultation record to mark email as sent
      const { error } = await supabase
        .from('consultations')
        .update({ email_sent: true })
        .eq('reference_id', bookingDetails.referenceId);
      
      if (error) {
        console.error(`Error updating email_sent status for ${bookingDetails.referenceId}:`, error);
      }
      
      return true;
    } else {
      console.error(`Failed to send email for ${bookingDetails.referenceId}`);
      return false;
    }
  } catch (error) {
    console.error(`Exception sending email for ${bookingDetails.referenceId}:`, error);
    return false;
  }
}

/**
 * Resend confirmation email for a consultation
 */
export async function resendConsultationEmail(referenceId: string): Promise<boolean> {
  try {
    console.log(`Resending email for booking ${referenceId}`);
    
    // Fetch the consultation record
    const { data: consultation, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error || !consultation) {
      console.error(`Error fetching consultation for ${referenceId}:`, error);
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
      highPriority: true
    };
    
    // Send the email
    return await sendEmailForConsultation(bookingDetails);
  } catch (error) {
    console.error(`Exception resending email for ${referenceId}:`, error);
    return false;
  }
}
