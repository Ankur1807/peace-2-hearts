
import { supabase } from '@/integrations/supabase/client';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isResend?: boolean;
}

interface BookingDetails {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType: string;
  services: string[];
  date?: Date;
  timeSlot?: string;
  timeframe?: string;
  message?: string;
  isResend?: boolean;
  packageName?: string;
}

// Create a modified interface that allows for the date to be a string when sending via API
interface SerializedBookingDetails extends Omit<BookingDetails, 'date'> {
  date?: string;
}

export async function sendContactEmail(formData: ContactFormData): Promise<boolean> {
  try {
    const { name, email, phone, subject, message, isResend } = formData;
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'contact',
        name,
        email,
        phone,
        subject,
        message,
        isResend: isResend || false
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

export async function sendBookingConfirmationEmail(bookingDetails: BookingDetails): Promise<boolean> {
  try {
    // Create a serialized version of booking details for API transmission
    // We need to make a shallow copy WITHOUT the date property first
    const { date, ...restDetails } = bookingDetails;
    
    // Then create our serialized object with the correct date type
    const serializedBookingDetails: SerializedBookingDetails = {
      ...restDetails
    };
    
    // Convert Date object to ISO string for proper transmission
    if (date instanceof Date) {
      serializedBookingDetails.date = date.toISOString();
    }
    
    console.log('Sending booking confirmation with date:', serializedBookingDetails.date);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'booking-confirmation',
        ...serializedBookingDetails,
        isResend: bookingDetails.isResend || false
      }
    });
    
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
