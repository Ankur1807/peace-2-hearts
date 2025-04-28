import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleContactEmail, handleBookingEmail } from "./handlers.ts";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Track concurrent executions for debugging
let concurrentExecutions = 0;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Increment concurrent executions counter
  concurrentExecutions++;
  console.log(`[${new Date().toISOString()}] Starting execution #${concurrentExecutions}`);
  
  let requestText = "";
  try {
    console.log(`[${new Date().toISOString()}] Email request received`);
    
    // Parse the request body with improved error handling
    try {
      requestText = await req.text();
      console.log(`Request payload size: ${requestText.length} bytes`);
      
      if (requestText.length > 100) {
        // Log partial content to avoid huge logs
        console.log(`Request text (truncated): ${requestText.substring(0, 100)}...`);
      } else {
        console.log(`Request text: ${requestText}`);
      }
    } catch (textError) {
      console.error(`Error reading request body: ${textError}`);
      return new Response(
        JSON.stringify({ 
          error: "Could not read request body",
          details: textError.message
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    let requestData;
    try {
      // Parse JSON
      requestData = JSON.parse(requestText);
    } catch (parseError) {
      console.error(`Error parsing JSON: ${parseError.message}`);
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON in request body",
          raw: requestText.substring(0, 100)
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { type, ...data } = requestData;
    
    if (!type) {
      console.error("Missing 'type' field in request");
      return new Response(
        JSON.stringify({ 
          error: "Missing 'type' field in request",
          receivedFields: Object.keys(requestData)
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    console.log(`Processing ${type} email request for ${data.email || 'unknown recipient'}`);
    
    // Add timeout to avoid function execution timeouts
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Email operation timed out after 25 seconds")), 25000)
    );
    
    // Process based on email type with timeout protection
    let emailResponse;
    try {
      const emailPromise = (async () => {
        switch (type) {
          case "contact":
            return await handleContactEmail(data);
          
          case "booking-confirmation":
            console.log(`Processing booking confirmation for ref: ${data.referenceId}`);
            return await handleBookingEmail(data);
          
          default:
            throw new Error(`Unsupported email type: ${type}`);
        }
      })();
      
      emailResponse = await Promise.race([emailPromise, timeoutPromise]);
    } catch (emailError) {
      console.error(`Email processing error: ${emailError.message}`);
      throw emailError;
    }

    console.log(`Email sent successfully for ${data.email}. Reference: ${data.referenceId || 'N/A'}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        ...emailResponse,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    // Detailed error logging
    console.error(`Error in send-email function: ${error.message}`);
    console.error(`Stack trace: ${error.stack || 'No stack trace available'}`);
    
    const errorResponse = {
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    // Add more debug information if available
    if (error.response) {
      console.error("Response error details:", error.response);
      errorResponse["responseDetails"] = error.response;
    }
    
    if (requestText) {
      // Include partial request data for debugging (limited to avoid huge logs)
      try {
        const truncatedData = JSON.parse(requestText);
        // Remove sensitive fields but keep structure for debugging
        if (truncatedData.email) truncatedData.email = `${truncatedData.email.substring(0, 3)}...`;
        if (truncatedData.clientName) truncatedData.clientName = `${truncatedData.clientName.substring(0, 3)}...`;
        errorResponse["truncatedRequest"] = truncatedData;
      } catch (e) {
        errorResponse["truncatedRequest"] = requestText.substring(0, 100);
      }
    }
    
    return new Response(
      JSON.stringify(errorResponse),
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

// Register background process monitoring
if (typeof EdgeRuntime !== 'undefined') {
  addEventListener('beforeunload', (ev) => {
    console.log(`Function shutdown with ${concurrentExecutions} pending executions. Reason: ${ev.detail?.reason}`);
  });
}

// Serve the handler function
serve(handler);
