/**
 * Email Service for Booking and Payments
 * 
 * This module handles all email notifications related to bookings and payments
 * with proper error handling and retry mechanisms.
 */
import { supabase } from '@/integrations/supabase/client';
import { BookingDetails } from '@/utils/types';
import { determineServiceCategory } from '@/utils/payment/services/serviceUtils';

/**
 * Formats a date for email display
 */
function formatDate(date: Date | string | undefined): string {
  if (!date) return 'To be scheduled';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'To be scheduled';
  }
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(bookingDetails: BookingDetails): Promise<boolean> {
  try {
    console.log(`Sending booking confirmation email for ${bookingDetails.referenceId}`);
    
    // Validate required fields
    if (!bookingDetails.email || !bookingDetails.referenceId) {
      console.error('Missing required fields for booking confirmation email:', {
        hasEmail: !!bookingDetails.email,
        hasReferenceId: !!bookingDetails.referenceId
      });
      return false;
    }
    
    // Format the date if present
    const formattedDate = bookingDetails.date ? formatDate(bookingDetails.date) : undefined;
    
    // Determine service category from consultation type if not provided
    const serviceCategory = bookingDetails.serviceCategory || 
      determineServiceCategory(bookingDetails.consultationType);
    
    // Prepare email payload
    const emailPayload = {
      type: 'booking-confirmation',
      clientName: bookingDetails.clientName,
      email: bookingDetails.email,
      referenceId: bookingDetails.referenceId,
      consultationType: bookingDetails.consultationType,
      services: bookingDetails.services || [bookingDetails.consultationType],
      date: bookingDetails.date ? (bookingDetails.date instanceof Date ? 
        bookingDetails.date.toISOString() : bookingDetails.date) : undefined,
      formattedDate: formattedDate,
      timeSlot: bookingDetails.timeSlot,
      timeframe: bookingDetails.timeframe,
      message: bookingDetails.message,
      serviceCategory: serviceCategory,
      amount: bookingDetails.amount,
      highPriority: bookingDetails.highPriority || false,
      isResend: bookingDetails.isResend || false,
      isRecovery: bookingDetails.isRecovery || false
    };
    
    // Send the email using edge function
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailPayload
    });
    
    if (error) {
      console.error('Error sending booking confirmation email:', error);
      await recordFailedEmail(bookingDetails.referenceId, 'booking-confirmation', error.message);
      return false;
    }
    
    // Update consultation record to mark email as sent
    if (bookingDetails.referenceId) {
      await updateEmailSentStatus(bookingDetails.referenceId);
    }
    
    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Exception sending booking confirmation email:', error);
    if (bookingDetails.referenceId) {
      await recordFailedEmail(bookingDetails.referenceId, 'booking-confirmation', 
        error instanceof Error ? error.message : 'Unknown error');
    }
    return false;
  }
}

/**
 * Resend booking confirmation email with high priority
 */
export async function resendBookingConfirmationEmail(bookingDetails: BookingDetails): Promise<boolean> {
  return sendBookingConfirmationEmail({
    ...bookingDetails,
    highPriority: true,
    isResend: true
  });
}

/**
 * Update consultation record to mark email as sent
 */
async function updateEmailSentStatus(referenceId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('consultations')
      .update({ 
        email_sent: true,
        status: 'confirmed' 
      })
      .eq('reference_id', referenceId);
      
    if (error) {
      console.error('Error updating email_sent status:', error);
    } else {
      console.log(`Successfully marked consultation ${referenceId} as email_sent=true`);
    }
  } catch (error) {
    console.error('Exception updating email_sent status:', error);
  }
}

/**
 * Record failed email attempt
 */
async function recordFailedEmail(
  referenceId: string, 
  emailType: string, 
  errorMessage: string
): Promise<void> {
  try {
    await supabase
      .from('consultations')
      .update({ 
        status: 'payment_received_needs_email',
        email_error: errorMessage
      })
      .eq('reference_id', referenceId);
      
    console.log(`Marked consultation ${referenceId} for email recovery due to error: ${errorMessage}`);
  } catch (error) {
    console.error('Error updating consultation for recovery:', error);
  }
}

/**
 * Fetch booking details from reference ID
 */
export async function fetchBookingDetailsByReference(referenceId: string): Promise<BookingDetails | null> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching consultation by reference ID:', error);
      return null;
    }
    
    // Use type assertion to access service_category
    const consultationData = data as any;
    
    // Determine service category from consultation type if not provided
    const serviceCategory = consultationData.service_category || 
      determineServiceCategory(data.consultation_type || '');
    
    // Create booking details object
    return {
      clientName: data.client_name || '',
      email: data.client_email || '',
      referenceId: data.reference_id || '',
      consultationType: data.consultation_type || '',
      services: data.consultation_type ? [data.consultation_type] : [],
      date: data.date ? new Date(data.date) : undefined,
      timeSlot: data.time_slot || '',
      timeframe: data.timeframe || '',
      message: data.message || '',
      serviceCategory: serviceCategory,
      amount: data.amount,
      phone: data.client_phone || ''
    };
  } catch (error) {
    console.error('Exception fetching booking details:', error);
    return null;
  }
}

/**
 * Retry sending failed emails
 */
export async function retryFailedEmails(): Promise<number> {
  try {
    // Find consultations that need email resend
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('status', 'payment_received_needs_email')
      .eq('email_sent', false)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error || !data || data.length === 0) {
      return 0;
    }
    
    console.log(`Found ${data.length} consultations needing email recovery`);
    let successCount = 0;
    
    // Process each consultation
    for (const consultation of data) {
      // Use type assertion to access service_category
      const consultationData = consultation as any;
      
      // Determine service category from consultation type if not provided
      const serviceCategory = consultationData.service_category || 
        determineServiceCategory(consultation.consultation_type || '');
      
      const bookingDetails: BookingDetails = {
        clientName: consultation.client_name || '',
        email: consultation.client_email || '',
        referenceId: consultation.reference_id || '',
        consultationType: consultation.consultation_type || '',
        services: consultation.consultation_type ? [consultation.consultation_type] : [],
        date: consultation.date ? new Date(consultation.date) : undefined,
        timeSlot: consultation.time_slot || '',
        timeframe: consultation.timeframe || '',
        message: consultation.message || '',
        serviceCategory: serviceCategory,
        amount: consultation.amount,
        highPriority: true,
        isRecovery: true
      };
      
      // Try to send email
      const success = await sendBookingConfirmationEmail(bookingDetails);
      if (success) {
        successCount++;
      }
    }
    
    return successCount;
  } catch (error) {
    console.error('Error in email recovery process:', error);
    return 0;
  }
}
