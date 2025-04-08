
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

// Handle contact form emails
export async function handleContactEmail(data: ContactEmailRequest) {
  const { email, subject, isResend } = data;
  
  // Send email to the user (confirmation)
  const userEmailResponse = await resend.emails.send({
    from: "Peace2Hearts <contact@peace2hearts.com>",
    to: [email],
    subject: isResend ? "Re: We've received your message - Peace2Hearts" : "We've received your message - Peace2Hearts",
    html: getContactUserEmailTemplate(data),
  });
  
  // Send notification to admin
  const adminEmailResponse = await resend.emails.send({
    from: "Peace2Hearts Website <contact@peace2hearts.com>",
    to: ["contact@peace2hearts.com"],
    subject: `${isResend ? "[RESEND] " : ""}New Contact Form Submission: ${subject}`,
    html: getContactAdminEmailTemplate(data),
  });

  return { userEmail: userEmailResponse, adminEmail: adminEmailResponse };
}

// Handle booking confirmation emails
export async function handleBookingEmail(data: BookingEmailRequest) {
  const { email, consultationType, isResend } = data;
  
  // Send confirmation email to client
  const userEmailResponse = await resend.emails.send({
    from: "Peace2Hearts <contact@peace2hearts.com>",
    to: [email],
    subject: isResend ? "Re: Your Consultation Booking Confirmation - Peace2Hearts" : "Your Consultation Booking Confirmation - Peace2Hearts",
    html: getBookingUserEmailTemplate(data),
  });
  
  // Send notification to admin
  const adminEmailResponse = await resend.emails.send({
    from: "Peace2Hearts Booking System <contact@peace2hearts.com>",
    to: ["contact@peace2hearts.com"],
    subject: `${isResend ? "[RESEND] " : ""}New Consultation Booking: ${consultationType}`,
    html: getBookingAdminEmailTemplate(data),
  });

  return { userEmail: userEmailResponse, adminEmail: adminEmailResponse };
}
