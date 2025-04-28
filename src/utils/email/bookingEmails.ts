
import { supabase } from '@/integrations/supabase/client';
import { BookingDetails, SerializedBookingDetails } from '@/utils/types';
import { addToEmailQueue } from './emailQueue';
import { processBookingDate } from './dateUtils';

/**
 * Internal function to send booking confirmation email
 */
export async function sendBookingConfirmationEmailInternal(bookingDetails: SerializedBookingDetails & { type: string }): Promise<boolean> {
  try {
    console.log('Sending booking confirmation email with data:', JSON.stringify({
      referenceId: bookingDetails.referenceId,
      email: bookingDetails.email,
      clientName: bookingDetails.clientName,
      isResend: bookingDetails.isResend,
      isRecovery: bookingDetails.isRecovery,
      date: bookingDetails.date
    }, null, 2));
    
    // Process dates first
    const serializedBookingDetails = processBookingDate(bookingDetails);
    
    // Add priority header if high priority
    const invokeOptions = {
      body: {
        type: 'booking-confirmation',
        ...serializedBookingDetails,
        isResend: bookingDetails.isResend || bookingDetails.isRecovery || false,
        referenceId: bookingDetails.referenceId // Ensure referenceId is always included
      }
    };
    
    // Add timeout for high priority emails
    if (bookingDetails.highPriority) {
      // @ts-ignore - Adding optional property
      invokeOptions.headers = {
        'X-Priority': 'high'
      };
    }
    
    const { data, error } = await supabase.functions.invoke('send-email', invokeOptions);
    
    if (error) {
      console.error('Error sending booking confirmation email:', error);
      return false;
    }
    
    console.log('Email sending response:', data);
    return data?.success === true;
  } catch (error) {
    console.error('Exception sending booking confirmation email:', error);
    return false;
  }
}

/**
 * Convert booking details to serialized format for API transmission
 */
export function serializeBookingDetails(bookingDetails: BookingDetails): SerializedBookingDetails {
  console.log('Serializing booking details:', bookingDetails);
  
  const serialized = {
    ...bookingDetails,
    date: bookingDetails.date ? 
      (typeof bookingDetails.date === 'object' && bookingDetails.date !== null && 
       'toISOString' in bookingDetails.date && typeof bookingDetails.date.toISOString === 'function') ? 
        bookingDetails.date.toISOString() : 
        String(bookingDetails.date) : 
      undefined
  };
  
  console.log('Serialized booking details:', serialized);
  return serialized;
}

/**
 * Public function to send booking confirmation email
 */
export async function sendBookingConfirmationEmail(bookingDetails: BookingDetails): Promise<boolean> {
  // Log the incoming request
  console.log('Sending confirmation email for booking:', {
    referenceId: bookingDetails.referenceId,
    email: bookingDetails.email,
    clientName: bookingDetails.clientName,
    date: bookingDetails.date
  });
  
  // Ensure required fields are present
  if (!bookingDetails.email || !bookingDetails.referenceId) {
    console.error('Missing required fields for booking email:', {
      hasEmail: !!bookingDetails.email,
      hasReferenceId: !!bookingDetails.referenceId
    });
    return false;
  }
  
  // Convert to serialized version
  const serializedBookingDetails = serializeBookingDetails(bookingDetails);
  
  // Attempt to send the email
  const result = await sendBookingConfirmationEmailInternal({
    ...serializedBookingDetails,
    type: 'booking-confirmation'
  });
  
  if (!result) {
    // Add to retry queue if failed
    const emailId = `booking-${bookingDetails.referenceId}-${Date.now()}`;
    console.log(`Adding failed email to retry queue with ID: ${emailId}`);
    
    addToEmailQueue(emailId, { 
      ...serializedBookingDetails, 
      type: 'booking-confirmation',
      failedAt: new Date().toISOString()
    });
  } else {
    console.log('Email sent successfully for reference ID:', bookingDetails.referenceId);
  }
  
  return result;
}

/**
 * Resend a booking confirmation email
 */
export async function resendBookingConfirmationEmail(bookingDetails: BookingDetails): Promise<boolean> {
  console.log('Attempting to resend email for booking:', {
    referenceId: bookingDetails.referenceId,
    email: bookingDetails.email
  });
  
  return sendBookingConfirmationEmail({
    ...bookingDetails,
    isResend: true,
    highPriority: true
  });
}
