import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend@1.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Resend with API key
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const resend = new Resend(resendApiKey);

// Define template details type
interface BookingConfirmationData {
  to: string;
  clientName: string;
  referenceId: string;
  serviceType: string;
  date: string;
  time: string;
  price: string;
  isResend?: boolean;
  highPriority?: boolean;
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isResend?: boolean;
}

// Generate HTML for booking confirmation email
function generateBookingConfirmationHTML(data: BookingConfirmationData): string {
  const { clientName, referenceId, serviceType, date, time, price, isResend } = data;
  
  const subject = isResend 
    ? `Important: Your Peace2Hearts Consultation Booking #${referenceId}`
    : `Confirmation: Your Peace2Hearts Consultation Booking #${referenceId}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background-color: #f8fafc;
    }
    .content {
      padding: 20px 0;
    }
    .booking-details {
      background-color: #f8fafc;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      margin-bottom: 10px;
    }
    .detail-label {
      font-weight: bold;
      width: 140px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666666;
      padding: 20px 0;
      border-top: 1px solid #eeeeee;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100%;
        padding: 10px;
      }
      .detail-row {
        flex-direction: column;
      }
      .detail-label {
        width: 100%;
        margin-bottom: 5px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4f6cf7;">Peace2Hearts</h1>
      <p>Finding Peace, With or Without Love</p>
    </div>
    
    <div class="content">
      <p>Dear ${clientName},</p>
      
      <p>${isResend ? 'This is an important reminder about' : 'Thank you for booking'} your consultation with Peace2Hearts. Your booking has been confirmed.</p>
      
      <div class="booking-details">
        <div class="detail-row">
          <div class="detail-label">Reference ID:</div>
          <div>${referenceId}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Service:</div>
          <div>${serviceType}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Date:</div>
          <div>${date}</div>
        </div>
        ${time ? `
        <div class="detail-row">
          <div class="detail-label">Time:</div>
          <div>${time}</div>
        </div>
        ` : ''}
        <div class="detail-row">
          <div class="detail-label">Price:</div>
          <div>${price}</div>
        </div>
      </div>
      
      <p>Our team will reach out to you shortly to confirm all the details and provide any additional information you might need.</p>
      
      <p>If you have any questions or need to make changes to your booking, please contact us at <a href="mailto:support@peace2hearts.com">support@peace2hearts.com</a> and include your Reference ID.</p>
      
      <p>We look forward to helping you on your journey towards emotional well-being and legal clarity.</p>
      
      <p>Best regards,<br>The Peace2Hearts Team</p>
    </div>
    
    <div class="footer">
      <p>This email was sent to you as part of your booking with Peace2Hearts.</p>
      <p>&copy; 2024 Peace2Hearts. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate HTML for contact form response email
function generateContactEmailHTML(data: ContactEmailData): string {
  const { name, email, subject, message, isResend } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Peace2Hearts</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background-color: #f8fafc;
    }
    .content {
      padding: 20px 0;
    }
    .message-details {
      background-color: #f8fafc;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666666;
      padding: 20px 0;
      border-top: 1px solid #eeeeee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #4f6cf7;">Peace2Hearts</h1>
      <p>Finding Peace, With or Without Love</p>
    </div>
    
    <div class="content">
      <p>Dear ${name},</p>
      
      <p>Thank you for reaching out to Peace2Hearts. We have received your message${isResend ? ' again' : ''}.</p>
      
      <div class="message-details">
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
      </div>
      
      <p>Our team will review your inquiry and get back to you as soon as possible, typically within 24-48 hours.</p>
      
      <p>If you have any urgent matters, please contact us at <a href="tel:+917428564364">+91 7428564364</a>.</p>
      
      <p>Best regards,<br>The Peace2Hearts Team</p>
    </div>
    
    <div class="footer">
      <p>This email was sent in response to your contact request with Peace2Hearts.</p>
      <p>&copy; 2024 Peace2Hearts. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Check if Resend API key is available
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured in environment variables');
    }
    
    // Parse request body
    const { type, data } = await req.json();
    
    if (!type || !data) {
      throw new Error('Missing required parameters: type, data');
    }
    
    let emailResult;
    
    // Handle different email types
    switch (type) {
      case 'booking-confirmation':
        // Validate required fields
        if (!data.to || !data.clientName || !data.referenceId || !data.serviceType) {
          throw new Error('Missing required fields for booking confirmation email');
        }
        
        // Generate email content
        const htmlContent = generateBookingConfirmationHTML(data);
        const subject = data.isResend 
          ? `Important: Your Peace2Hearts Consultation Booking #${data.referenceId}`
          : `Confirmation: Your Peace2Hearts Consultation Booking #${data.referenceId}`;
        
        // Add priority headers if needed
        const headers = data.highPriority ? {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        } : {};
        
        // Set up email options
        const emailOptions = {
          from: 'Peace2Hearts <booking@peace2hearts.com>',
          to: data.to,
          subject: subject,
          html: htmlContent,
          headers: headers
        };
        
        // Add BCC for high priority emails
        if (data.highPriority) {
          emailOptions.bcc = 'support@peace2hearts.com';
        }
        
        // Send email using Resend
        emailResult = await resend.emails.send(emailOptions);
        break;
        
      case 'contact-form':
        // Validate required fields
        if (!data.email || !data.name || !data.subject || !data.message) {
          throw new Error('Missing required fields for contact form email');
        }
        
        // Generate contact email content
        const contactHtml = generateContactEmailHTML(data);
        const contactSubject = `Peace2Hearts: ${data.subject}`;
        
        // Set priority headers if needed
        const contactHeaders = data.highPriority ? {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        } : {};
        
        // Email options
        const contactOptions = {
          from: 'Peace2Hearts <contact@peace2hearts.com>',
          to: data.email,
          subject: contactSubject,
          html: contactHtml,
          headers: contactHeaders
        };
        
        // Add BCC to admin
        contactOptions.bcc = 'admin@peace2hearts.com';
        
        // Send contact email
        emailResult = await resend.emails.send(contactOptions);
        
        // Also send a notification to the admin
        const adminNotification = await resend.emails.send({
          from: 'Peace2Hearts <notifications@peace2hearts.com>',
          to: 'admin@peace2hearts.com',
          subject: `New Contact Form Submission: ${data.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>New Contact Form Submission</h2>
              <p><strong>From:</strong> ${data.name} (${data.email})</p>
              <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
              <p><strong>Subject:</strong> ${data.subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                ${data.message}
              </div>
            </div>
          `
        });
        break;
        
      default:
        throw new Error(`Unsupported email type: ${type}`);
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        result: emailResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    // Log detailed error
    console.error('Error in send-email function:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
