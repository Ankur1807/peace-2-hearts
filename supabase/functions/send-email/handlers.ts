
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
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Format date function (client-side can be different from Deno formatting)
function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  
  console.log("Formatting date:", dateStr);
  
  try {
    // Parse the ISO date string
    const date = new Date(dateStr);
    // Format the date as DD/MM/YYYY
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateStr; // Return original string if parsing fails
  }
}

// Handle contact form emails
export async function handleContactEmail(data: ContactEmailRequest) {
  const { email, subject, isResend } = data;
  
  console.log("Handling contact email request:", JSON.stringify(data, null, 2));
  
  try {
    // Send email to the user (confirmation)
    const userEmailResponse = await resend.emails.send({
      from: "Peace2Hearts <contact@peace2hearts.com>",
      to: [email],
      subject: isResend ? "Re: We've received your message - Peace2Hearts" : "We've received your message - Peace2Hearts",
      html: getContactUserEmailTemplate(data),
    });
    
    console.log("User contact email sent:", userEmailResponse);
    
    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Peace2Hearts Website <contact@peace2hearts.com>",
      to: ["contact@peace2hearts.com"],
      subject: `${isResend ? "[RESEND] " : ""}New Contact Form Submission: ${subject}`,
      html: getContactAdminEmailTemplate(data),
    });
    
    console.log("Admin contact email sent:", adminEmailResponse);

    return { userEmail: userEmailResponse, adminEmail: adminEmailResponse };
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw error;
  }
}

// Handle booking confirmation emails
export async function handleBookingEmail(data: BookingEmailRequest) {
  const { email, consultationType, isResend, referenceId } = data;
  
  console.log("Handling booking email request for reference ID:", referenceId);
  console.log("Email recipient:", email);
  console.log("Booking data:", JSON.stringify(data, null, 2));
  
  // Use provided formatted date or format the date if exists
  if (data.date && !data.formattedDate) {
    const formattedDate = formatDate(data.date);
    console.log(`Formatting date from ${data.date} to ${formattedDate}`);
    data.formattedDate = formattedDate;
  }
  
  try {
    // Send confirmation email to client
    console.log("Sending confirmation email to client:", email);
    const userEmailResponse = await resend.emails.send({
      from: "Peace2Hearts <contact@peace2hearts.com>",
      to: [email],
      subject: isResend ? "Re: Your Consultation Booking Confirmation - Peace2Hearts" : "Your Consultation Booking Confirmation - Peace2Hearts",
      html: getBookingUserEmailTemplate(data),
    });
    
    console.log("User booking email sent successfully:", userEmailResponse);
    
    // Send notification to admin
    console.log("Sending notification email to admin");
    const adminEmailResponse = await resend.emails.send({
      from: "Peace2Hearts Booking System <contact@peace2hearts.com>",
      to: ["contact@peace2hearts.com"],
      subject: `${isResend ? "[RESEND] " : ""}New Consultation Booking: ${consultationType} (Ref: ${referenceId})`,
      html: getBookingAdminEmailTemplate(data),
    });
    
    console.log("Admin booking email sent successfully:", adminEmailResponse);

    return { 
      userEmail: userEmailResponse, 
      adminEmail: adminEmailResponse,
      success: true
    };
  } catch (error) {
    console.error("Error sending booking email:", error);
    console.error("Error details:", error.message);
    
    // Try to provide more details about the error
    if (error.response) {
      console.error("Response error:", error.response);
    }
    
    throw error;
  }
}
