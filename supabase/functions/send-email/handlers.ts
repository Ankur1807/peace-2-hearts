
import { Resend } from "https://esm.sh/resend@1.0.0";

// Define interfaces for email data
interface ContactEmailData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

interface BookingEmailData {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType: string;
  services?: string[];
  date?: string;
  timeSlot?: string;
  timeframe?: string;
  serviceCategory?: string;
  highPriority?: boolean;
  isResend?: boolean;
  isRecovery?: boolean;
  bcc?: string; // Added this field to explicitly define bcc
}

// Set up Resend client
const getResendClient = () => {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }
  
  return new Resend(apiKey);
};

// Handle contact form email
export async function handleContactEmail(data: ContactEmailData) {
  try {
    console.log("Processing contact email for:", data.email);
    const resend = getResendClient();
    
    // Send the email
    const { data: emailData, error } = await resend.emails.send({
      from: "Peace2Hearts <hello@peace2hearts.com>",
      to: [data.email],
      subject: data.subject || "Thank you for contacting Peace2Hearts",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Thank You for Reaching Out, ${data.name}!</h2>
          <p>We've received your message and will get back to you shortly.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
          <p>Best regards,<br>The Peace2Hearts Team</p>
        </div>
      `
    });
    
    if (error) {
      throw new Error(`Failed to send contact email: ${error.message}`);
    }
    
    return { success: true, id: emailData.id };
  } catch (err) {
    console.error("Error in handleContactEmail:", err);
    throw err;
  }
}

// Generate booking confirmation email
function generateBookingEmail(data: BookingEmailData): string {
  const { clientName, referenceId, consultationType, services = [], date, timeSlot, timeframe, serviceCategory } = data;
  
  // Service category helps determine what info to show
  const isHolistic = serviceCategory?.toLowerCase() === 'holistic';
  const isLegal = serviceCategory?.toLowerCase() === 'legal';
  const isMentalHealth = serviceCategory?.toLowerCase() === 'mental-health' || !serviceCategory;
  
  // Format date if available
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  
  // Format service names for display
  const formattedServices = services.map(service => 
    service.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  ).join(', ');
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://mcbdxszoozmlelejvizn.supabase.co/storage/v1/object/public/peace2hearts/logo-dark.png" alt="Peace2Hearts Logo" style="max-width: 200px; height: auto;">
      </div>
      
      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
        <h2 style="color: #2c5282; margin-top: 0;">Booking Confirmation</h2>
        <p>Dear ${clientName},</p>
        <p>Thank you for booking a consultation with Peace2Hearts. Your booking has been confirmed with the following details:</p>
        
        <div style="background-color: white; border-left: 4px solid #2c5282; padding: 15px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Reference ID:</strong> ${referenceId}</p>
          <p style="margin: 5px 0;"><strong>Service Type:</strong> ${formattedServices || consultationType}</p>
          
          ${isHolistic ? `
            <p style="margin: 5px 0;"><strong>Timeframe:</strong> ${timeframe || "To be scheduled"}</p>
          ` : ''}
          
          ${!isHolistic ? `
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate || "To be scheduled"}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${timeSlot || "To be scheduled"}</p>
          ` : ''}
        </div>
        
        <p>Our team will reach out to you shortly to confirm the details and provide next steps.</p>
      </div>
      
      <div style="margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 20px;">
        <p><strong>What to Expect Next:</strong></p>
        <ul style="padding-left: 20px;">
          <li>You'll receive a call or email from our team within 24 hours to confirm your booking.</li>
          <li>Please keep your reference ID handy for all future communications.</li>
          ${isMentalHealth ? `<li>Please prepare any relevant information about your situation that might help our mental health professional assist you better.</li>` : ''}
          ${isLegal ? `<li>Consider gathering any legal documents related to your case for discussion during the consultation.</li>` : ''}
          ${isHolistic ? `<li>Our holistic consultation team will create a personalized plan based on your timeframe and needs.</li>` : ''}
        </ul>
      </div>
      
      <div style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
        <p>If you have any questions, please contact us at <a href="mailto:contact@peace2hearts.com" style="color: #2c5282;">contact@peace2hearts.com</a></p>
        <p>Peace2Hearts - Helping you find peace, with or without love.</p>
        <p><a href="https://peace2hearts.com" style="color: #2c5282;">www.peace2hearts.com</a></p>
      </div>
    </div>
  `;
}

// Handle booking confirmation email
export async function handleBookingEmail(data: BookingEmailData) {
  try {
    console.log(`Processing booking confirmation email for ${data.email} (Reference: ${data.referenceId})`);
    console.log(`Email flags: highPriority=${data.highPriority}, isResend=${data.isResend}, isRecovery=${data.isRecovery}`);
    
    const resend = getResendClient();
    
    // Set email subject based on flags
    let subject = "Your Booking Confirmation - Peace2Hearts";
    if (data.isResend) {
      subject = "Booking Confirmation (Resent) - Peace2Hearts";
    } else if (data.isRecovery) {
      subject = "Booking Confirmation (Recovery) - Peace2Hearts";
    }
    
    // Set email options
    const emailOptions: any = {
      from: "Peace2Hearts <bookings@peace2hearts.com>",
      to: [data.email],
      subject: subject,
      html: generateBookingEmail(data),
      tags: [
        {
          name: "category",
          value: "booking_confirmation"
        },
        {
          name: "reference_id",
          value: data.referenceId
        }
      ]
    };
    
    // Add BCC for high priority emails or if explicitly specified
    if (data.highPriority || data.bcc) {
      // Use explicit BCC if provided, otherwise use support email
      const bccEmail = data.bcc || "support@peace2hearts.com";
      console.log(`Adding BCC to booking email: ${bccEmail}`);
      emailOptions.bcc = [bccEmail];
      emailOptions.tags.push({
        name: "priority",
        value: "high"
      });
    }
    
    // Send the email with retries if needed
    let attempt = 0;
    const maxAttempts = 3;
    let lastError = null;
    
    while (attempt < maxAttempts) {
      try {
        console.log(`Sending email attempt ${attempt + 1}/${maxAttempts}`);
        const { data: emailData, error } = await resend.emails.send(emailOptions);
        
        if (error) {
          throw error;
        }
        
        console.log(`Email sent successfully on attempt ${attempt + 1}, ID: ${emailData.id}`);
        return { success: true, id: emailData.id };
      } catch (err) {
        lastError = err;
        console.error(`Email send attempt ${attempt + 1} failed:`, err);
        attempt++;
        
        // Wait before retry
        if (attempt < maxAttempts) {
          const waitMs = attempt * 1000; // Increase wait time with each retry
          console.log(`Waiting ${waitMs}ms before retry`);
          await new Promise(resolve => setTimeout(resolve, waitMs));
        }
      }
    }
    
    // If we get here, all attempts failed
    throw new Error(`Failed to send email after ${maxAttempts} attempts: ${lastError?.message || "Unknown error"}`);
  } catch (err) {
    console.error("Error in handleBookingEmail:", err);
    throw err;
  }
}
