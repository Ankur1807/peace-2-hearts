
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
        
        // Send email using Resend
        emailResult = await resend.emails.send({
          from: 'Peace2Hearts <booking@peace2hearts.com>',
          to: data.to,
          subject: subject,
          html: htmlContent,
          headers: headers
        });
        break;
        
      // Add other email types as needed
      
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
