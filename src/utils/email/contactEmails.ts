
import { supabase } from '@/integrations/supabase/client';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isResend?: boolean;
}

/**
 * Send contact email
 */
export async function sendContactEmail(formData: ContactFormData): Promise<boolean> {
  try {
    console.log('Sending contact email with data:', {
      name: formData.name, 
      email: formData.email, 
      subject: formData.subject
    });
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'contact-form',
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          isResend: formData.isResend || false,
          highPriority: false
        }
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
 * Resend a contact email
 */
export async function resendContactEmail(formData: ContactFormData): Promise<boolean> {
  return sendContactEmail({
    ...formData,
    isResend: true
  });
}
