
import { supabase } from "@/integrations/supabase/client";

/**
 * Send a contact form email through the Supabase edge function
 */
export async function sendContactEmail(
  name: string,
  email: string,
  subject: string,
  message: string,
  phone?: string
): Promise<boolean> {
  try {
    console.log(`Sending contact form email from ${name} <${email}>`);
    
    // First store the message in the database
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone: phone || null,
        subject,
        message
      });
      
    if (dbError) {
      console.error("Error storing contact message:", dbError);
      // Continue with email sending even if DB storage fails
    }
    
    // Then send the email via edge function
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'contact-form',
        name,
        email,
        subject,
        message,
        phone: phone || null,
        highPriority: false
      }
    });
    
    if (error) {
      console.error("Error sending contact email:", error);
      return false;
    }
    
    console.log("Contact email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Error in sendContactEmail:", error);
    return false;
  }
}

/**
 * Resend a contact form email
 */
export async function resendContactEmail(
  contactId: string
): Promise<boolean> {
  try {
    console.log(`Resending contact email for ID: ${contactId}`);
    
    // Fetch contact details
    const { data: contactData, error: contactError } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', contactId)
      .single();
    
    if (contactError || !contactData) {
      console.error("Error fetching contact details:", contactError);
      return false;
    }
    
    // Resend email
    return await sendContactEmail(
      contactData.name,
      contactData.email,
      contactData.subject,
      contactData.message,
      contactData.phone
    );
  } catch (error) {
    console.error("Error in resendContactEmail:", error);
    return false;
  }
}
