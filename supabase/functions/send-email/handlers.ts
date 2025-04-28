
import { Resend } from "npm:resend@2.0.0";
import { 
  ContactEmailRequest, 
  BookingEmailRequest, 
  getContactUserEmailTemplate,
  getContactAdminEmailTemplate,
  getBookingUserEmailTemplate,
  getBookingAdminEmailTemplate
} from "./templates.ts";

// Initialize Resend with the API key
const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  console.error("CRITICAL: RESEND_API_KEY environment variable is not set!");
}

const resend = new Resend(resendApiKey);

// Format date function (client-side can be different from Deno formatting)
function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  
  console.log(`Formatting date: ${dateStr}`);
  
  try {
    // Parse the ISO date string
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date received: ${dateStr}`);
      return dateStr;
    }
    
    // Format the date as DD/MM/YYYY
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error(`Error formatting date: ${error}`);
    return dateStr; // Return original string if parsing fails
  }
}

// Handle contact form emails
export async function handleContactEmail(data: ContactEmailRequest) {
  const { email, subject, isResend } = data;
  
  console.log(`Handling contact email request for: ${email}`);
  
  if (!email) {
    throw new Error("Email address is required");
  }
  
  try {
    // Send email to the user (confirmation)
    const userEmailResponse = await resend.emails.send({
      from: "Peace2Hearts <contact@peace2hearts.com>",
      to: [email],
      subject: isResend ? "Re: We've received your message - Peace2Hearts" : "We've received your message - Peace2Hearts",
      html: getContactUserEmailTemplate(data),
    });
    
    console.log(`User contact email sent to ${email}: ${JSON.stringify(userEmailResponse)}`);
    
    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Peace2Hearts Website <contact@peace2hearts.com>",
      to: ["contact@peace2hearts.com"],
      subject: `${isResend ? "[RESEND] " : ""}New Contact Form Submission: ${subject}`,
      html: getContactAdminEmailTemplate(data),
    });
    
    console.log(`Admin contact email sent: ${JSON.stringify(adminEmailResponse)}`);

    return { 
      userEmail: userEmailResponse, 
      adminEmail: adminEmailResponse,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error sending contact email: ${error}`);
    throw error;
  }
}

// Handle booking confirmation emails
export async function handleBookingEmail(data: BookingEmailRequest) {
  const { email, consultationType, isResend, referenceId } = data;
  
  console.log(`Handling booking email request for reference ID: ${referenceId}`);
  console.log(`Email recipient: ${email}`);
  
  if (!email) {
    throw new Error("Email address is required for booking confirmation");
  }
  
  if (!referenceId) {
    throw new Error("Reference ID is required for booking confirmation");
  }
  
  // Use provided formatted date or format the date if exists
  if (data.date && !data.formattedDate) {
    const formattedDate = formatDate(data.date);
    console.log(`Formatting date from ${data.date} to ${formattedDate}`);
    data.formattedDate = formattedDate;
  }
  
  // Implement exponential backoff for retries
  let attempt = 1;
  const MAX_RETRIES = 3;
  const INITIAL_DELAY = 500; // 500ms
  
  while (attempt <= MAX_RETRIES) {
    try {
      // Send confirmation email to client
      console.log(`Attempt ${attempt}: Sending confirmation email to client: ${email}`);
      
      // Add explicit email headers for important emails
      const emailOptions = {
        from: "Peace2Hearts <contact@peace2hearts.com>",
        to: [email],
        subject: isResend ? "Re: Your Consultation Booking Confirmation - Peace2Hearts" : "Your Consultation Booking Confirmation - Peace2Hearts",
        html: getBookingUserEmailTemplate(data),
        headers: {}
      };
      
      // Mark important emails with high priority
      if (isResend || data.isRecovery) {
        // @ts-ignore - Headers type is not properly defined
        emailOptions.headers = {
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
          "Importance": "high"
        };
      }
      
      const userEmailResponse = await resend.emails.send(emailOptions);
      
      console.log(`User booking email sent successfully to ${email}: ${JSON.stringify(userEmailResponse)}`);
      
      // Send notification to admin
      console.log("Sending notification email to admin");
      const adminEmailResponse = await resend.emails.send({
        from: "Peace2Hearts Booking System <contact@peace2hearts.com>",
        to: ["contact@peace2hearts.com"],
        subject: `${isResend ? "[RESEND] " : ""}New Consultation Booking: ${consultationType} (Ref: ${referenceId})`,
        html: getBookingAdminEmailTemplate(data),
      });
      
      console.log(`Admin booking email sent successfully: ${JSON.stringify(adminEmailResponse)}`);

      return { 
        userEmail: userEmailResponse, 
        adminEmail: adminEmailResponse,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Attempt ${attempt}: Error sending booking email: ${error.message}`);
      
      if (attempt < MAX_RETRIES) {
        // Exponential backoff
        const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
      } else {
        console.error(`Failed to send email after ${MAX_RETRIES} attempts`);
        throw error;
      }
    }
  }
  
  throw new Error(`Failed to send email after ${MAX_RETRIES} attempts`);
}
