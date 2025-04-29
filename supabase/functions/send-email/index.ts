
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@1.0.0";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Track concurrent executions for debugging
let concurrentExecutions = 0;

// Define interfaces for email data
interface EmailPayload {
  type: string;
  [key: string]: any;
}

interface BookingEmailData {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType: string;
  services?: string[];
  date?: string;
  formattedDate?: string;
  timeSlot?: string;
  timeframe?: string;
  serviceCategory?: string;
  highPriority?: boolean;
  isResend?: boolean;
  message?: string;
  amount?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Increment concurrent executions counter
  concurrentExecutions++;
  console.log(`[${new Date().toISOString()}] Starting execution #${concurrentExecutions}`);

  try {
    console.log(`[${new Date().toISOString()}] Email request received`);
    
    // Get API key from environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    // Initialize Resend client
    const resend = new Resend(resendApiKey);
    
    // Parse request payload
    const payload = await req.json() as EmailPayload;
    const { type, ...data } = payload;
    
    if (!type) {
      return new Response(
        JSON.stringify({ 
          error: "Missing 'type' field in request",
          receivedFields: Object.keys(payload)
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    console.log(`Processing ${type} email request`);
    
    let emailResponse;
    
    // Process based on email type
    switch (type) {
      case "booking-confirmation":
        emailResponse = await sendBookingConfirmationEmail(resend, data as BookingEmailData);
        break;
        
      default:
        throw new Error(`Unsupported email type: ${type}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, ...emailResponse }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error(`Error in send-email function: ${error.message}`);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } finally {
    // Decrement concurrent executions counter
    concurrentExecutions--;
    console.log(`[${new Date().toISOString()}] Completed execution. Remaining: ${concurrentExecutions}`);
  }
};

// Generate booking confirmation email HTML
function generateBookingEmail(data: BookingEmailData): string {
  const { 
    clientName, 
    referenceId, 
    consultationType,
    services = [], 
    formattedDate, 
    timeSlot, 
    timeframe, 
    serviceCategory,
    message,
    amount
  } = data;
  
  // Service category helps determine what info to show
  const isHolistic = serviceCategory?.toLowerCase() === 'holistic';
  const isLegal = serviceCategory?.toLowerCase() === 'legal';
  const isMentalHealth = serviceCategory?.toLowerCase() === 'mental-health' || !serviceCategory;
  
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
          
          ${amount ? `<p style="margin: 5px 0;"><strong>Amount:</strong> ₹${amount}</p>` : ''}
        </div>
        
        ${message ? `
          <div style="background-color: white; border-left: 4px solid #2c5282; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Your Message:</strong></p>
            <p style="margin: 5px 0;">${message}</p>
          </div>
        ` : ''}
        
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

// Send booking confirmation email
async function sendBookingConfirmationEmail(
  resend: Resend, 
  data: BookingEmailData
): Promise<any> {
  console.log(`Sending booking confirmation to ${data.email} (Reference: ${data.referenceId})`);
  
  // Set email subject based on flags
  let subject = "Your Booking Confirmation - Peace2Hearts";
  if (data.isResend) {
    subject = "Booking Confirmation (Resent) - Peace2Hearts";
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
  
  // Add BCC for high priority emails
  if (data.highPriority) {
    emailOptions.bcc = ["support@peace2hearts.com"];
    emailOptions.tags.push({
      name: "priority",
      value: "high"
    });
  }
  
  try {
    // Send the email with retries
    const maxAttempts = 3;
    let lastError = null;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt + 1}/${maxAttempts} to send email`);
        const response = await resend.emails.send(emailOptions);
        
        console.log(`Email sent successfully on attempt ${attempt + 1}, ID: ${response.id}`);
        return response;
      } catch (err) {
        lastError = err;
        console.error(`Email send attempt ${attempt + 1} failed:`, err);
        
        // Wait before retry (except on last attempt)
        if (attempt < maxAttempts - 1) {
          const waitMs = (attempt + 1) * 1000; // Increasing wait time
          console.log(`Waiting ${waitMs}ms before retry`);
          await new Promise(resolve => setTimeout(resolve, waitMs));
        }
      }
    }
    
    throw new Error(`Failed after ${maxAttempts} attempts: ${lastError?.message || "Unknown error"}`);
  } catch (error) {
    console.error("Error sending booking email:", error);
    throw error;
  }
}

// Register background process monitoring
if (typeof EdgeRuntime !== 'undefined') {
  addEventListener('beforeunload', (ev) => {
    console.log(`Function shutdown with ${concurrentExecutions} pending executions. Reason: ${ev.detail?.reason}`);
  });
}

// Serve the handler function
serve(handler);
