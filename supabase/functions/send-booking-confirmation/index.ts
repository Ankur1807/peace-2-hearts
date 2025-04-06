
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const GMAIL_EMAIL = Deno.env.get("GMAIL_EMAIL") || "";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingDetails {
  referenceId: string;
  clientName: string;
  email: string;
  phone?: string;
  consultationType: string;
  services: string[];
  date?: Date;
  timeSlot?: string;
  timeframe?: string;
  message?: string;
}

const getConsultationTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'mental-health-counselling': 'Mental Health Counselling',
    'couples-counselling': 'Couples Counselling', 
    'premarital-counselling': 'Premarital Counselling',
    'general-legal': 'General Legal Consultation',
    'divorce-consultation': 'Divorce Consultation',
    'custody-consultation': 'Custody Consultation',
    'mediation': 'Mediation Services',
    'pre-marriage-legal': 'Pre-Marriage Legal Consultation',
    'sexual-health-counselling': 'Sexual Health Counselling',
    'family-therapy': 'Family Therapy',
    'multiple': 'Multiple Services'
  };
  
  return labels[type] || type;
};

const formatDate = (date?: Date): string => {
  if (!date) return 'To be scheduled';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to send booking confirmation");

    if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD) {
      console.error("Missing Gmail credentials");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error - missing email credentials" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const bookingDetails: BookingDetails = await req.json();
    console.log("Booking details received:", JSON.stringify({
      referenceId: bookingDetails.referenceId,
      clientName: bookingDetails.clientName,
      email: bookingDetails.email,
      services: bookingDetails.services,
      // Don't log sensitive information like phone number or full message
    }));

    const {
      referenceId,
      clientName,
      email,
      phone,
      consultationType,
      services,
      date,
      timeSlot,
      timeframe,
      message
    } = bookingDetails;

    const client = new SmtpClient();

    // Configure connection
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: GMAIL_EMAIL,
      password: GMAIL_APP_PASSWORD,
    });

    // Format services for display
    const servicesList = services.map(service => 
      `<li>${getConsultationTypeLabel(service)}</li>`
    ).join('');

    // Send confirmation email to the client
    console.log(`Attempting to send confirmation email to client: ${email}`);
    await client.send({
      from: `Peace2Hearts <${GMAIL_EMAIL}>`,
      to: [email],
      subject: `Your Peace2Hearts Consultation Booking - Ref# ${referenceId}`,
      content: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #6A5ACD; padding: 20px; text-align: center; color: white; }
              .content { padding: 20px; background-color: #f9f9f9; }
              .booking-details { background-color: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .important { color: #6A5ACD; font-weight: bold; }
              .label { font-weight: bold; min-width: 120px; display: inline-block; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Booking Confirmation</h1>
              </div>
              <div class="content">
                <p>Dear ${clientName},</p>
                <p>Thank you for booking a consultation with Peace2Hearts. Your booking has been confirmed.</p>
                
                <div class="booking-details">
                  <p><span class="label">Reference ID:</span> ${referenceId}</p>
                  <p><span class="label">Services:</span></p>
                  <ul>
                    ${servicesList}
                  </ul>
                  ${date ? `<p><span class="label">Date:</span> ${formatDate(date)}</p>` : ''}
                  ${timeSlot ? `<p><span class="label">Time:</span> ${timeSlot}</p>` : ''}
                  ${timeframe ? `<p><span class="label">Timeframe:</span> ${timeframe.replace(/-/g, ' ')}</p>` : ''}
                </div>
                
                <p>We look forward to supporting you on your journey. Here's what you need to know:</p>
                <ul>
                  <li>Your consultation will be conducted via secure video call.</li>
                  <li>You'll receive connection details via email 24 hours before your appointment.</li>
                  <li>Please join the call 5 minutes before your scheduled time.</li>
                  <li>If you need to reschedule, please give at least 24 hours notice.</li>
                </ul>
                
                <p>If you have any questions before your consultation, please reply to this email or call us.</p>
                <p>Best regards,<br>The Peace2Hearts Team</p>
              </div>
              <div class="footer">
                <p>Reference #: ${referenceId} | Peace2Hearts</p>
                <p>This is an automated message, please do not reply directly to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      html: true,
    });
    console.log(`Confirmation email sent to client: ${email}`);

    // Send notification email to admin
    console.log("Attempting to send notification email to admin");
    await client.send({
      from: `Peace2Hearts Booking System <${GMAIL_EMAIL}>`,
      to: [GMAIL_EMAIL], // Send to self/admin
      subject: `New Booking - Ref# ${referenceId}`,
      content: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #6A5ACD; padding: 20px; text-align: center; color: white; }
              .content { padding: 20px; background-color: #f9f9f9; }
              .booking-details { background-color: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
              .label { font-weight: bold; min-width: 150px; display: inline-block; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Booking Received</h1>
              </div>
              <div class="content">
                <p>A new consultation has been booked:</p>
                
                <div class="booking-details">
                  <p><span class="label">Reference ID:</span> ${referenceId}</p>
                  <p><span class="label">Client:</span> ${clientName}</p>
                  <p><span class="label">Email:</span> ${email}</p>
                  ${phone ? `<p><span class="label">Phone:</span> ${phone}</p>` : ''}
                  <p><span class="label">Services:</span></p>
                  <ul>
                    ${servicesList}
                  </ul>
                  ${date ? `<p><span class="label">Date:</span> ${formatDate(date)}</p>` : ''}
                  ${timeSlot ? `<p><span class="label">Time:</span> ${timeSlot}</p>` : ''}
                  ${timeframe ? `<p><span class="label">Timeframe:</span> ${timeframe.replace(/-/g, ' ')}</p>` : ''}
                  ${message ? `<p><span class="label">Message:</span> ${message}</p>` : ''}
                </div>
                
                <p>Please update the booking details in the system and assign an appropriate consultant.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      html: true,
    });
    console.log("Notification email sent to admin");

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: "Booking confirmation sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending booking confirmation:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
