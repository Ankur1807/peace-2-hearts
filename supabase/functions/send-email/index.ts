
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with the API key from environment variables
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define email request types
interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

interface BookingEmailRequest {
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, ...data } = await req.json();
    console.log(`Processing ${type} email request`, data);

    let emailResponse;

    // Handle different email types
    switch (type) {
      case "contact":
        emailResponse = await handleContactEmail(data as ContactEmailRequest);
        break;
      
      case "booking-confirmation":
        emailResponse = await handleBookingEmail(data as BookingEmailRequest);
        break;
      
      default:
        throw new Error(`Unsupported email type: ${type}`);
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Handle contact form emails
async function handleContactEmail(data: ContactEmailRequest) {
  const { name, email, subject, message, phone } = data;
  
  // Send email to the user (confirmation)
  const userEmailResponse = await resend.emails.send({
    from: "Peace2Hearts <contact@peace2hearts.com>",
    to: [email],
    subject: "We've received your message - Peace2Hearts",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0f7ff; padding: 30px; text-align: center;">
          <h1 style="color: #2c5282; margin-bottom: 10px;">Thank You for Contacting Us</h1>
        </div>
        <div style="padding: 30px;">
          <p>Dear ${name},</p>
          <p>We have received your message regarding: <strong>${subject}</strong>.</p>
          <p>Our team will review your inquiry and get back to you as soon as possible.</p>
          <p>For your reference, here's a copy of your message:</p>
          <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #2c5282; margin: 20px 0;">
            <p style="margin: 0;">${message}</p>
          </div>
          <p>Best regards,<br>The Peace2Hearts Team</p>
        </div>
        <div style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px; color: #4a5568;">
          <p>&copy; 2025 Peace2Hearts. All rights reserved.</p>
        </div>
      </div>
    `,
  });
  
  // Send notification to admin
  const adminEmailResponse = await resend.emails.send({
    from: "Peace2Hearts Website <contact@peace2hearts.com>",
    to: ["contact@peace2hearts.com"],
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="padding: 20px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #2c5282; margin: 10px 0;">
            <p style="margin: 0;">${message}</p>
          </div>
        </div>
      </div>
    `,
  });

  return { userEmail: userEmailResponse, adminEmail: adminEmailResponse };
}

// Handle booking confirmation emails
async function handleBookingEmail(data: BookingEmailRequest) {
  const { clientName, email, referenceId, consultationType, services, date, timeSlot, timeframe, message } = data;
  
  // Format consultation details
  const servicesList = services.map(service => {
    return `<li>${formatServiceName(service)}</li>`;
  }).join('');

  const dateTimeInfo = timeframe 
    ? `<p><strong>Preferred Timeframe:</strong> ${formatTimeframe(timeframe)}</p>` 
    : `<p><strong>Appointment Date:</strong> ${formatDate(date)}<br>
       <strong>Time:</strong> ${formatTimeSlot(timeSlot)}</p>`;

  // Send confirmation email to client
  const userEmailResponse = await resend.emails.send({
    from: "Peace2Hearts <contact@peace2hearts.com>",
    to: [email],
    subject: "Your Consultation Booking Confirmation - Peace2Hearts",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0f7ff; padding: 30px; text-align: center;">
          <h1 style="color: #2c5282; margin-bottom: 10px;">Booking Confirmation</h1>
          <p style="font-size: 18px; margin-top: 0;">Reference ID: ${referenceId}</p>
        </div>
        <div style="padding: 30px;">
          <p>Dear ${clientName},</p>
          <p>Thank you for booking a consultation with Peace2Hearts. We have received your request and will contact you shortly to confirm your appointment details.</p>
          
          <h3>Booking Details:</h3>
          <div style="background-color: #f8f8f8; padding: 20px; margin: 20px 0;">
            <p><strong>Services Selected:</strong></p>
            <ul>
              ${servicesList}
            </ul>
            ${dateTimeInfo}
          </div>
          
          <h3>What happens next?</h3>
          <ul>
            <li>Our team will review your booking details</li>
            <li>We'll send connection details for your video consultation 24 hours before your appointment</li>
            <li>Please join 5 minutes before your scheduled time</li>
          </ul>
          
          <p>If you need to reschedule or have any questions, please contact us at <a href="mailto:contact@peace2hearts.com">contact@peace2hearts.com</a> or call us at +91 7428564364.</p>
          
          <p>Best regards,<br>The Peace2Hearts Team</p>
        </div>
        <div style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px; color: #4a5568;">
          <p>&copy; 2025 Peace2Hearts. All rights reserved.</p>
        </div>
      </div>
    `,
  });
  
  // Send notification to admin
  const adminEmailResponse = await resend.emails.send({
    from: "Peace2Hearts Booking System <contact@peace2hearts.com>",
    to: ["contact@peace2hearts.com"],
    subject: `New Consultation Booking: ${referenceId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="padding: 20px;">
          <h2>New Consultation Booking</h2>
          <p><strong>Reference ID:</strong> ${referenceId}</p>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Services Requested:</strong></p>
          <ul>${servicesList}</ul>
          ${dateTimeInfo}
          ${message ? `<p><strong>Client Message:</strong> ${message}</p>` : ''}
        </div>
      </div>
    `,
  });

  return { userEmail: userEmailResponse, adminEmail: adminEmailResponse };
}

// Helper functions for formatting
function formatServiceName(serviceId: string): string {
  // Map service IDs to human-readable names
  const serviceNames: Record<string, string> = {
    'mental-health-counselling': 'Mental Health Counseling',
    'family-therapy': 'Family Therapy',
    'premarital-counselling': 'Premarital Counseling',
    'couples-counselling': 'Couples Counseling',
    'pre-marriage-legal': 'Pre-Marriage Legal Consultation',
    'mediation': 'Mediation Services',
    'divorce': 'Divorce Consultation',
    'custody': 'Child Custody Consultation',
    'general-legal': 'General Legal Consultation'
  };
  
  return serviceNames[serviceId] || serviceId;
}

function formatTimeframe(timeframe: string): string {
  // Map timeframe IDs to human-readable formats
  const timeframes: Record<string, string> = {
    '1-2-weeks': '1-2 weeks',
    '2-4-weeks': '2-4 weeks',
    '4-weeks-plus': '4+ weeks'
  };
  
  return timeframes[timeframe] || timeframe;
}

function formatDate(date?: Date): string {
  if (!date) return 'To be determined';
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function formatTimeSlot(timeSlot?: string): string {
  if (!timeSlot) return 'To be determined';
  
  // Map time slots to human-readable formats
  const timeSlots: Record<string, string> = {
    '7-am': '7:00 AM',
    '8-am': '8:00 AM',
    '9-am': '9:00 AM',
    '10-am': '10:00 AM',
    '11-am': '11:00 AM',
    '12-pm': '12:00 PM',
    '1-pm': '1:00 PM',
    '2-pm': '2:00 PM',
    '3-pm': '3:00 PM',
    '4-pm': '4:00 PM',
    '5-pm': '5:00 PM',
    '6-pm': '6:00 PM',
    '7-pm': '7:00 PM',
    '8-pm': '8:00 PM',
    '9-pm': '9:00 PM'
  };
  
  return timeSlots[timeSlot] || timeSlot;
}

// Serve the handler function
serve(handler);
