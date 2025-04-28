
import { supabase } from '@/integrations/supabase/client';
import { addToEmailQueue } from './emailQueue';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isResend?: boolean;
}

/**
 * Internal function to send contact email
 */
export async function sendContactEmailInternal(formData: ContactFormData & { type: string }): Promise<boolean> {
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
    addToEmailQueue(emailId, { ...formData, type: 'contact' });
  }
  
  return result;
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
