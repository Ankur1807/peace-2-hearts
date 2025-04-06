
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const GMAIL_EMAIL = Deno.env.get("GMAIL_EMAIL") || "";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    const { name, email, phone, subject, message } = formData;

    console.log("Received contact form submission:", { name, email, subject });

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: GMAIL_EMAIL,
          password: GMAIL_APP_PASSWORD,
        },
      },
    });

    // Send confirmation email to the user
    await client.send({
      from: "contact@peace2hearts.com",
      to: email,
      subject: `Thank you for contacting Peace2Hearts - ${subject}`,
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
                <p>Thank you for reaching out to Peace2Hearts. We have received your message regarding "${subject}".</p>
                <p>Our team will review your inquiry and get back to you as soon as possible.</p>
                <p>Here's a copy of your message:</p>
                <blockquote style="border-left: 4px solid #6A5ACD; padding-left: 15px; margin-left: 0;">
                  ${message}
                </blockquote>
                <p>If you have any additional questions or information in the meantime, please reply to this email.</p>
                <p>Best regards,<br>The Peace2Hearts Team</p>
              </div>
              <div class="footer">
                <p>This is an automated message from Peace2Hearts. Please do not reply directly to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      html: true,
    });

    // Send notification email to the admin
    await client.send({
      from: "contact@peace2hearts.com",
      to: "contact@peace2hearts.com",
      subject: `New Contact Form Submission: ${subject}`,
      content: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #6A5ACD; padding: 20px; text-align: center; color: white; }
              .content { padding: 20px; background-color: #f9f9f9; }
              .details { margin: 20px 0; background-color: white; padding: 15px; border-radius: 5px; }
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
                
                <div class="details">
                  <p><span class="label">Name:</span> ${name}</p>
                  <p><span class="label">Email:</span> ${email}</p>
                  ${phone ? `<p><span class="label">Phone:</span> ${phone}</p>` : ''}
                  <p><span class="label">Subject:</span> ${subject}</p>
                  <p><span class="label">Message:</span></p>
                  <p>${message}</p>
                </div>
                
                <p>Please respond to this inquiry at your earliest convenience.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      html: true,
    });

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
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
