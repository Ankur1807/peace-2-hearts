
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
  serviceCategory?: string;
  amount?: number;
}

// Create a modified interface that explicitly allows for the date to be a string when sending via API
interface SerializedBookingDetails extends Omit<BookingDetails, 'date'> {
  date?: string;
  formattedDate?: string;
}

export async function sendContactEmail(formData: ContactFormData): Promise<boolean> {
  try {
    const { name, email, phone, subject, message, isResend } = formData;
    
    console.log('Sending contact email with data:', {
      name, 
      email, 
      subject, 
      messageLength: message?.length || 0
    });
    
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
    console.log('Started sending booking confirmation email with data:', JSON.stringify(bookingDetails, null, 2));
    
    // Create a serialized version without date first
    const serializedBookingDetails: SerializedBookingDetails = { 
      ...bookingDetails,
      date: undefined // Remove date property initially to avoid type conflicts
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
      
      console.log('Date conversion details:', {
        iso: serializedBookingDetails.date,
        formatted: serializedBookingDetails.formattedDate,
        originalDate: bookingDetails.date.toString()
      });
    } else if (bookingDetails.date) {
      console.warn('Date is not a Date object:', bookingDetails.date);
      serializedBookingDetails.date = String(bookingDetails.date);
    }
    
    console.log('Sending booking confirmation with serialized data:', JSON.stringify(serializedBookingDetails, null, 2));
    
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
