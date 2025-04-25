
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleContactEmail, handleBookingEmail } from "./handlers.ts";
import type { ContactEmailRequest, BookingEmailRequest } from "./templates.ts";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received email request");
    
    // Parse the request body
    const requestText = await req.text();
    console.log("Request text:", requestText);
    
    // Parse JSON
    const requestData = JSON.parse(requestText);
    const { type, ...data } = requestData;
    
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
      JSON.stringify({ error: error.message, stack: error.stack }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Serve the handler function
serve(handler);
