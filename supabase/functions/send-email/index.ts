
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend@1.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Resend with API key
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const resend = new Resend(resendApiKey);

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
    const body = await req.json();
    
    // Extract type and data, accounting for potential nested structure
    let type, data;
    
    if (body.type) {
      // Direct structure
      type = body.type;
      data = body; // Use the body itself as data
      console.log("[SEND-EMAIL] Function called with direct payload structure, type:", type);
    } else if (body.data && body.data.type) {
      // Nested structure (backwards compatibility)
      type = body.data.type;
      data = body.data;
      console.log("[SEND-EMAIL] Function called with nested payload structure, type:", type);
    } else {
      // Cannot determine type
      console.error("[SEND-EMAIL] Missing type in payload:", JSON.stringify(body));
      throw new Error('Missing required parameter: type');
    }
    
    console.log("[SEND-EMAIL] Function called with type:", type, "and data:", JSON.stringify(data));
    
    if (!type) {
      throw new Error('Missing required parameter: type');
    }
    
    let emailResult;
    
    // Handle different email types
    switch (type) {
      case 'booking-confirmation':
        // Validate required fields with more robust error handling
        if (!data.to && !data.email) {
          console.error('Missing recipient email address:', data);
          throw new Error('Missing recipient email address');
        }
        
        if (!data.clientName) {
          console.error('Missing client name for booking confirmation:', data);
          throw new Error('Missing client name for booking confirmation');
        }
        
        if (!data.referenceId) {
          console.error('Missing reference ID for booking confirmation:', data);
          throw new Error('Missing reference ID for booking confirmation');
        }
        
        // Get the email recipient from the correct field
        const recipient = data.to || data.email;
        if (!recipient) {
          throw new Error('Missing recipient email address');
        }
        
        // Generate email content
        const htmlContent = generateBookingConfirmationHTML(data);
        const subject = data.isResend 
          ? `Important: Your Peace2Hearts Consultation Booking #${data.referenceId}`
          : `Confirmation: Your Peace2Hearts Consultation Booking #${data.referenceId}`;
        
        // Log the BCC address if provided
        if (data.bcc) {
          console.log("[SEND-EMAIL] Admin BCC included:", data.bcc);
        } else {
          console.warn("[SEND-EMAIL] No BCC email address provided");
        }
        
        console.log(`[SEND-EMAIL] Sending booking confirmation email to ${recipient}, BCC: ${data.bcc || 'none'}`);
        
        // Send email using Resend with BCC support
        try {
          const emailOptions = {
            from: 'Peace2Hearts <booking@peace2hearts.com>',
            to: [recipient],
            subject: subject,
            html: htmlContent
          };
          
          // Add BCC if provided
          if (data.bcc) {
            console.log(`[SEND-EMAIL] Adding BCC: ${data.bcc}`);
            emailOptions.bcc = [data.bcc];
          }
          
          emailResult = await resend.emails.send(emailOptions);
          console.log('[SEND-EMAIL] Booking email sent successfully:', emailResult);
        } catch (emailErr) {
          console.error('[SEND-EMAIL] Error sending booking confirmation email:', emailErr);
          throw emailErr;
        }
        break;
      
      case 'contact':
      case 'contact-form':
        // Validate required fields for contact form
        if (!data.email || !data.name) {
          throw new Error('Missing required fields for contact form email');
        }

        // Send email to the person who submitted the form
        const userEmailResult = await resend.emails.send({
          from: 'Peace2Hearts <contact@peace2hearts.com>',
          to: [data.email],
          subject: data.isResend ? 'Re: Your Message to Peace2Hearts' : 'Thank you for contacting Peace2Hearts',
          html: generateContactUserEmail(data)
        });
        
        // Send notification to admin
        const adminEmailResult = await resend.emails.send({
          from: 'Peace2Hearts <notifications@peace2hearts.com>',
          to: ['contact@peace2hearts.com'],
          subject: `New Contact Form: ${data.subject || 'General Inquiry'}`,
          html: generateContactAdminEmail(data)
        });
        
        emailResult = {
          user: userEmailResult,
          admin: adminEmailResult
        };
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

// Generate HTML for booking confirmation email
function generateBookingConfirmationHTML(data) {
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

// Generate HTML for contact form user confirmation email
function generateContactUserEmail(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #3399cc;">Thank You for Contacting Peace2Hearts</h2>
      <p>Dear ${data.name},</p>
      <p>We have received your message regarding "${data.subject || 'your inquiry'}" and will get back to you as soon as possible.</p>
      <p>Here's a copy of your message:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p style="margin: 0;">${data.message}</p>
      </div>
      <p>If you have any additional questions or information to share, please don't hesitate to reply to this email.</p>
      <p>Warm regards,<br>The Peace2Hearts Team</p>
    </div>
  `;
}

// Generate HTML for contact form admin notification
function generateContactAdminEmail(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #3399cc;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      <p><strong>Subject:</strong> ${data.subject || 'General Inquiry'}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p style="margin: 0;">${data.message}</p>
      </div>
      <p>${data.isResend ? '<strong>Note:</strong> This is a resent notification.' : ''}</p>
    </div>
  `;
}
