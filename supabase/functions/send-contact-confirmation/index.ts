
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// Get the credentials from environment variables
const GMAIL_EMAIL = Deno.env.get("GMAIL_EMAIL") || "";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to send contact confirmation");
    console.log("GMAIL_EMAIL available:", !!GMAIL_EMAIL);
    console.log("GMAIL_APP_PASSWORD available:", !!GMAIL_APP_PASSWORD);

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

    const { name, email, subject = "Contact Form Submission", message, phone }: ContactEmailRequest = await req.json();
    console.log("Contact form received:", JSON.stringify({ name, email, subject }));

    const client = new SmtpClient();

    // Configure connection
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: GMAIL_EMAIL,
      password: GMAIL_APP_PASSWORD,
    });

    // Send confirmation email to the user
    console.log(`Sending confirmation email to user: ${email}`);
    await client.send({
      from: `Peace2Hearts <${GMAIL_EMAIL}>`,
      to: [email],
      subject: "We received your message!",
      content: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #6A5ACD; padding: 20px; text-align: center; color: white; }
              .content { padding: 20px; background-color: #f9f9f9; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Contacting Us</h1>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Thank you for reaching out to Peace2Hearts. We have received your message and will get back to you as soon as possible.</p>
                <p>For your records, here's a copy of your message:</p>
                <div style="background-color: #f0f0f0; padding: 15px; border-left: 4px solid #6A5ACD; margin: 20px 0;">
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
                </div>
                <p>If you have any urgent concerns, please feel free to call us.</p>
                <p>Best regards,<br>The Peace2Hearts Team</p>
              </div>
              <div class="footer">
                <p>Peace2Hearts | Finding peace in relationships</p>
                <p>This is an automated message, please do not reply directly to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      html: true,
    });
    console.log("Confirmation email sent to user");

    // Send notification to admin
    console.log("Sending notification email to admin");
    await client.send({
      from: `Contact Form <${GMAIL_EMAIL}>`,
      to: [GMAIL_EMAIL], // Send to self/admin
      subject: `New Contact Form: ${subject}`,
      content: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #6A5ACD; padding: 20px; text-align: center; color: white; }
              .content { padding: 20px; background-color: #f9f9f9; }
              .contact-details { background-color: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
              .label { font-weight: bold; min-width: 100px; display: inline-block; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Contact Form Submission</h1>
              </div>
              <div class="content">
                <p>A new message has been submitted through the contact form:</p>
                
                <div class="contact-details">
                  <p><span class="label">Name:</span> ${name}</p>
                  <p><span class="label">Email:</span> ${email}</p>
                  ${phone ? `<p><span class="label">Phone:</span> ${phone}</p>` : ''}
                  <p><span class="label">Subject:</span> ${subject}</p>
                  <p><span class="label">Message:</span></p>
                  <div style="background-color: #f9f9f9; padding: 10px; margin-top: 5px;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                
                <p>Please respond to this inquiry at your earliest convenience.</p>
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
      JSON.stringify({ success: true, message: "Confirmation email sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
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
