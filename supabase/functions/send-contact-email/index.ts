
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createTransport } from "npm:nodemailer@6.9.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Contact form submission received");
    
    // Get the contact form data from the request
    const formData: ContactFormData = await req.json();
    const { name, email, phone, subject, message } = formData;
    
    console.log(`Form data: ${JSON.stringify({ name, email, subject })}`);

    // Get email credentials from environment variables
    const contactEmail = Deno.env.get("contact@peace2hearts.com");
    const contactEmailPassword = Deno.env.get("P2H");
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@peace2hearts.com";
    
    console.log(`Using email: ${contactEmail}`);

    if (!contactEmail || !contactEmailPassword) {
      console.error("Missing email credentials");
      throw new Error("Email credentials are not configured properly");
    }

    // Set up nodemailer with Google Workspace credentials
    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: contactEmail,
        pass: contactEmailPassword,
      },
    });

    // Create notification email to admin
    const adminEmailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

    // Create confirmation email to sender
    const userEmailContent = `
      <h2>Thank you for contacting Peace2Hearts</h2>
      <p>Dear ${name},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>Here's a copy of your message:</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>
      <p>Best regards,<br>The Peace2Hearts Team</p>
    `;

    // Send email to admin
    console.log("Sending email to admin");
    await transporter.sendMail({
      from: `"Peace2Hearts Contact" <${contactEmail}>`,
      to: adminEmail,
      subject: `New Contact Form: ${subject}`,
      html: adminEmailContent,
      replyTo: email,
    });

    // Send confirmation email to user
    console.log("Sending confirmation email to user");
    await transporter.sendMail({
      from: `"Peace2Hearts" <${contactEmail}>`,
      to: email,
      subject: "We've received your message - Peace2Hearts",
      html: userEmailContent,
    });

    console.log("Emails sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
