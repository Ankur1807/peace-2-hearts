
import { supabase } from '@/integrations/supabase/client';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
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
}

export async function sendContactEmail(formData: ContactFormData): Promise<boolean> {
  try {
    const { name, email, phone, subject, message } = formData;
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'contact',
        name,
        email,
        phone,
        subject,
        message
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
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'booking-confirmation',
        ...bookingDetails
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

// New function to handle resend triggers for both types of emails
export async function resendEmail(emailType: 'contact' | 'booking-confirmation', emailData: ContactFormData | BookingDetails): Promise<boolean> {
  try {
    console.log(`Attempting to resend ${emailType} email:`, emailData);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: emailType,
        ...emailData,
        isResend: true // Flag to indicate this is a resend attempt
      }
    });
    
    if (error) {
      console.error(`Error resending ${emailType} email:`, error);
      return false;
    }
    
    console.log(`${emailType} email resent successfully:`, data);
    return true;
  } catch (error) {
    console.error(`Exception resending ${emailType} email:`, error);
    return false;
  }
}
