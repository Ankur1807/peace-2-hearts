import { supabase } from '@/integrations/supabase/client';
import { BookingDetails, SerializedBookingDetails } from '@/utils/types';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isResend?: boolean;
}

// Email sending queue to handle retries
const emailQueue: Map<string, {
  attempts: number,
  lastAttempt: number,
  payload: any
}> = new Map();

// Maximum retries for emails
const MAX_RETRY_ATTEMPTS = 5;
// Retry intervals in milliseconds (increasing backoff)
const RETRY_INTERVALS = [1000, 5000, 15000, 30000, 60000];

// Set up email retry timer
setInterval(processEmailQueue, 10000);

/**
 * Process email retry queue
 */
function processEmailQueue() {
  const now = Date.now();
  
  emailQueue.forEach((item, id) => {
    // Skip if not ready for retry yet
    if (now - item.lastAttempt < RETRY_INTERVALS[Math.min(item.attempts - 1, RETRY_INTERVALS.length - 1)]) {
      return;
    }
    
    // Remove from queue if max attempts reached
    if (item.attempts >= MAX_RETRY_ATTEMPTS) {
      console.error(`Email ${id} failed after ${MAX_RETRY_ATTEMPTS} attempts, giving up`);
      emailQueue.delete(id);
      return;
    }
    
    console.log(`Retrying email ${id}, attempt ${item.attempts + 1}`);
    
    // Try sending email again
    if (item.payload.type === 'booking-confirmation') {
      sendBookingConfirmationEmailInternal(item.payload)
        .then(success => {
          if (success) {
            console.log(`Retry successful for email ${id}`);
            emailQueue.delete(id);
          } else {
            item.attempts++;
            item.lastAttempt = now;
          }
        })
        .catch(() => {
          item.attempts++;
          item.lastAttempt = now;
        });
    } else if (item.payload.type === 'contact') {
      sendContactEmailInternal(item.payload)
        .then(success => {
          if (success) {
            emailQueue.delete(id);
          } else {
            item.attempts++;
            item.lastAttempt = now;
          }
        })
        .catch(() => {
          item.attempts++;
          item.lastAttempt = now;
        });
    }
  });
}

/**
 * Internal function to send contact email
 */
async function sendContactEmailInternal(formData: ContactFormData & { type: string }): Promise<boolean> {
  try {
    console.log('Sending contact email with data:', {
      name: formData.name, 
      email: formData.email, 
      subject: formData.subject
    });
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        isResend: formData.isResend || false
      }
    });
    
    if (error) {
      console.error('Error sending contact email:', error);
      return false;
    }
    
    console.log('Contact email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Exception sending contact email:', error);
    return false;
  }
}

/**
 * Public function to send contact email
 */
export async function sendContactEmail(formData: ContactFormData): Promise<boolean> {
  const result = await sendContactEmailInternal({
    ...formData, 
    type: 'contact'
  });
  
  if (!result) {
    // Add to retry queue if failed
    const emailId = `contact-${formData.email}-${Date.now()}`;
    emailQueue.set(emailId, {
      attempts: 1,
      lastAttempt: Date.now(),
      payload: { ...formData, type: 'contact' }
    });
  }
  
  return result;
}

/**
 * Internal function to send booking confirmation email
 */
async function sendBookingConfirmationEmailInternal(bookingDetails: SerializedBookingDetails & { type: string }): Promise<boolean> {
  try {
    console.log('Sending booking confirmation email with data:', JSON.stringify({
      referenceId: bookingDetails.referenceId,
      email: bookingDetails.email,
      clientName: bookingDetails.clientName,
      isResend: bookingDetails.isResend,
      isRecovery: bookingDetails.isRecovery
    }, null, 2));
    
    // Create a serialized version without date first
    const serializedBookingDetails: SerializedBookingDetails = { 
      ...bookingDetails,
      date: typeof bookingDetails.date === 'string' 
        ? bookingDetails.date 
        : bookingDetails.date instanceof Date 
          ? bookingDetails.date.toISOString() 
          : undefined
    };
    
    // Handle date conversion
    if (bookingDetails.date instanceof Date) {
      // Convert Date to ISO string for API transmission
      serializedBookingDetails.date = bookingDetails.date.toISOString();
      
      // Add a formatted date for display
      const formattedDate = bookingDetails.date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      serializedBookingDetails.formattedDate = formattedDate;
    } else if (bookingDetails.date) {
      console.warn('Date is not a Date object:', bookingDetails.date);
      serializedBookingDetails.date = String(bookingDetails.date);
    }
    
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
    
    console.log('Booking confirmation email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Exception sending booking confirmation email:', error);
    return false;
  }
}

/**
 * Public function to send booking confirmation email
 */
export async function sendBookingConfirmationEmail(bookingDetails: BookingDetails): Promise<boolean> {
  // Ensure required fields are present
  if (!bookingDetails.email || !bookingDetails.referenceId) {
    console.error('Missing required fields for booking email:', {
      hasEmail: !!bookingDetails.email,
      hasReferenceId: !!bookingDetails.referenceId
    });
    return false;
  }
  
  // Convert date to string if it's a Date object
  const serializedBookingDetails: SerializedBookingDetails = {
    ...bookingDetails,
    date: bookingDetails.date instanceof Date ? bookingDetails.date.toISOString() : bookingDetails.date
  };
  
  const result = await sendBookingConfirmationEmailInternal({
    ...serializedBookingDetails,
    type: 'booking-confirmation'
  });
  
  if (!result) {
    // Add to retry queue if failed
    const emailId = `booking-${bookingDetails.referenceId}-${Date.now()}`;
    emailQueue.set(emailId, {
      attempts: 1,
      lastAttempt: Date.now(),
      payload: { ...bookingDetails, type: 'booking-confirmation' }
    });
    console.log(`Added booking confirmation email to retry queue with ID ${emailId}`);
  }
  
  return result;
}

export async function resendBookingConfirmationEmail(bookingDetails: BookingDetails): Promise<boolean> {
  return sendBookingConfirmationEmail({
    ...bookingDetails,
    isResend: true
  });
}

export async function resendContactEmail(formData: ContactFormData): Promise<boolean> {
  return sendContactEmail({
    ...formData,
    isResend: true
  });
}
