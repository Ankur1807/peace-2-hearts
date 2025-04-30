import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders, determineServiceCategory, handleFetchResponse } from "./utils.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || '';
const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';

// Create Supabase client with service role for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface VerifyPaymentRequest {
  paymentId: string;
  orderId: string;
  signature?: string;
  bookingDetails: {
    clientName: string;
    email: string;
    phone?: string;
    referenceId: string;
    consultationType: string;
    services: string[];
    date?: string;
    timeSlot?: string;
    timeframe?: string;
    serviceCategory: string;
    message?: string;
    amount?: number;
  };
}

interface RazorpayPaymentDetail {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  // Add other fields as needed
}

/**
 * Verify payment with Razorpay API
 */
async function verifyPaymentWithRazorpay(paymentId: string): Promise<{
  verified: boolean;
  details?: RazorpayPaymentDetail;
  error?: string;
}> {
  try {
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("Razorpay credentials not configured");
      return { verified: false, error: "Payment gateway credentials not configured" };
    }

    console.log(`Verifying payment with Razorpay API: ${paymentId}`);
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    try {
      const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Use the helper function to handle the response
      const paymentDetails = await handleFetchResponse(response, "Razorpay payment verification");
      console.log("Payment details from Razorpay:", paymentDetails);
      
      // Consider payment verified if status is authorized or captured
      const validStatuses = ['authorized', 'captured'];
      const verified = validStatuses.includes(paymentDetails.status);
      
      return { verified, details: paymentDetails };
    } catch (fetchError) {
      console.error("Error fetching from Razorpay API:", fetchError);
      return { verified: false, error: fetchError.message };
    }
  } catch (error) {
    console.error("Exception in verifyPaymentWithRazorpay:", error);
    return { verified: false, error: error.message };
  }
}

/**
 * Create consultation record in database
 */
async function createConsultationRecord(
  bookingDetails: VerifyPaymentRequest['bookingDetails'],
  paymentId: string,
  orderId: string,
  amount: number,
  paymentStatus: string,
  bookingStatus: string,
  source: string = 'edge' // Default source is 'edge' since this is our primary insert point
): Promise<{
  success: boolean;
  consultationId?: string;
  error?: string;
}> {
  try {
    // Extract data from booking details
    const {
      clientName,
      email,
      phone,
      referenceId,
      consultationType,
      services,
      date,
      timeSlot,
      timeframe,
      serviceCategory,
      message
    } = bookingDetails;
    
    console.log(`[EDGE FUNCTION] Creating consultation record with reference ID: ${referenceId}`);
    
    // Check if a record already exists with this reference ID
    const { data: existingConsultation, error: checkError } = await supabase
      .from('consultations')
      .select('id, payment_id')
      .eq('reference_id', referenceId)
      .maybeSingle();
    
    if (checkError) {
      console.error("[EDGE FUNCTION] Error checking for existing consultation:", checkError);
      return { success: false, error: checkError.message };
    }
    
    if (existingConsultation) {
      console.log(`[EDGE FUNCTION] Consultation with reference ID ${referenceId} already exists, checking if it needs updating`);
      
      // Only update if payment_id is missing or different
      if (!existingConsultation.payment_id || existingConsultation.payment_id !== paymentId) {
        console.log(`[EDGE FUNCTION] Updating existing consultation record with payment info: ${paymentId}`);
        
        // Update existing record
        const { data: updatedData, error: updateError } = await supabase
          .from('consultations')
          .update({
            payment_id: paymentId,
            order_id: orderId,
            amount: amount,
            payment_status: paymentStatus,
            status: bookingStatus,
            source: 'edge', // Ensure source is set to 'edge'
            updated_at: new Date().toISOString()
          })
          .eq('reference_id', referenceId)
          .select('id')
          .single();
        
        if (updateError) {
          console.error("[EDGE FUNCTION] Error updating consultation:", updateError);
          return { success: false, error: updateError.message };
        }
        
        console.log(`[EDGE FUNCTION] Successfully updated consultation record: ${updatedData?.id}`);
        return { success: true, consultationId: updatedData.id };
      } else {
        console.log(`[EDGE FUNCTION] Consultation already has payment info, skipping update: ${existingConsultation.id}`);
        return { success: true, consultationId: existingConsultation.id };
      }
    } else {
      // Create new consultation record - this should be the primary path now
      const effectiveServiceCategory = serviceCategory || determineServiceCategory(services[0] || consultationType);
      
      console.log("[EDGE FUNCTION] Creating new consultation with data:", { 
        clientName, 
        email, 
        serviceType: consultationType || services.join(','), 
        serviceCategory: effectiveServiceCategory,
        referenceId,
        amount,
        source // Include source field
      });
      
      // Prepare the consultation data
      const consultationData = {
        client_name: clientName,
        client_email: email,
        client_phone: phone,
        reference_id: referenceId,
        consultation_type: consultationType || services.join(','),
        date: date ? new Date(date).toISOString() : null,
        time_slot: timeSlot || null,
        timeframe: timeframe || null,
        message: message || null,
        payment_id: paymentId,
        order_id: orderId,
        amount: amount,
        payment_status: paymentStatus,
        status: bookingStatus,
        email_sent: false, // Will be updated after email is sent
        source: source, // Add source field
        service_category: effectiveServiceCategory // Make sure service_category is included
      };

      try {
        const { data: insertData, error: insertError } = await supabase
          .from('consultations')
          .insert(consultationData)
          .select('id')
          .single();
        
        if (insertError) {
          console.error("[EDGE FUNCTION] Error creating consultation record:", insertError);
          return { success: false, error: insertError.message };
        }
        
        console.log(`[EDGE FUNCTION] Successfully created new consultation record: ${insertData?.id}`);
        return { success: true, consultationId: insertData.id };
      } catch (e) {
        console.error("[EDGE FUNCTION] Exception during insert operation:", e);
        return { success: false, error: e.message };
      }
    }
  } catch (error) {
    console.error("[EDGE FUNCTION] Error in createConsultationRecord:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send confirmation email
 */
async function sendConfirmationEmail(
  bookingDetails: VerifyPaymentRequest['bookingDetails']
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log(`[EDGE] Sending confirmation email for booking ${bookingDetails.referenceId}`);
    
    // Add additional error handling for email sending
    try {
      // Make sure we always include admin as BCC - Fixed admin email address
      const adminEmail = "admin@peace2hearts.com";
      
      // Process date for email - log the raw and formatted values for debugging
      const rawDate = bookingDetails.date;
      let formattedDate = bookingDetails.date || 'To be scheduled';
      
      if (rawDate) {
        try {
          // Parse the date without any timezone assumptions
          const dateObj = new Date(rawDate);
          
          if (!isNaN(dateObj.getTime())) {
            // Format the date in a human-readable format (in user's local timezone)
            formattedDate = dateObj.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            // Log for debugging
            console.log("[EDGE] Raw date:", rawDate);
            console.log("[EDGE] Formatted date for email:", formattedDate);
          }
        } catch (dateError) {
          console.error("[EDGE] Error formatting date:", dateError, "Original date:", rawDate);
        }
      }
      
      // Log payload to help with debugging
      const emailPayload = {
        type: 'booking-confirmation',
        to: bookingDetails.email,
        bcc: adminEmail, // Ensure admin email is included as BCC
        clientName: bookingDetails.clientName,
        referenceId: bookingDetails.referenceId,
        serviceType: bookingDetails.consultationType || bookingDetails.services.join(', '),
        date: formattedDate,
        time: bookingDetails.timeSlot || bookingDetails.timeframe || '',
        price: bookingDetails.amount ? `₹${bookingDetails.amount}` : 'To be confirmed',
        highPriority: true
      };
      
      console.log(`[EDGE] Calling send-email function with payload:`, JSON.stringify(emailPayload));
      
      const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-email', {
        body: emailPayload // IMPORTANT: Direct payload, not nested under 'data'
      });
      
      if (emailError) {
        console.error("[EDGE] Error sending confirmation email:", emailError);
        return { success: false, error: emailError.message };
      }
      
      console.log("[EDGE] Email sent successfully:", emailResponse);
      
      // Update the consultation record to mark email as sent ONLY if email was actually sent
      try {
        const { error: updateError } = await supabase
          .from('consultations')
          .update({ email_sent: true })
          .eq('reference_id', bookingDetails.referenceId);
        
        if (updateError) {
          console.error("[EDGE] Error updating email_sent status:", updateError);
        } else {
          console.log("[EDGE] Updated email_sent status to true");
        }
      } catch (updateErr) {
        console.error("[EDGE] Exception updating email_sent status:", updateErr);
      }
      
      return { success: true };
    } catch (emailErr) {
      // Don't fail the entire process if email sending fails
      console.error("[EDGE] Exception in email sending:", emailErr);
      return { success: false, error: emailErr.message };
    }
  } catch (error) {
    console.error("[EDGE] Exception in sendConfirmationEmail:", error);
    return { success: false, error: error.message };
  }
}

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  console.log("[EDGE] Verify payment function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    let requestData: VerifyPaymentRequest;
    try {
      requestData = await req.json() as VerifyPaymentRequest;
    } catch (parseError) {
      console.error("[EDGE] Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid JSON in request body" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    
    const { paymentId, orderId, signature, bookingDetails } = requestData;
    
    if (!paymentId || !bookingDetails || !bookingDetails.referenceId) {
      console.error("[EDGE] Missing required parameters:", { 
        paymentId: !!paymentId,
        bookingDetails: !!bookingDetails,
        referenceId: bookingDetails?.referenceId 
      });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required parameters: paymentId or bookingDetails" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    
    console.log(`[EDGE] Processing payment verification for: ${paymentId}, reference: ${bookingDetails.referenceId}`);
    
    // Step 1: Verify payment with Razorpay
    const paymentVerification = await verifyPaymentWithRazorpay(paymentId);
    
    if (!paymentVerification.verified) {
      console.log(`[EDGE] Payment verification failed for ${paymentId}`);
      
      // Create consultation record with failed status
      await createConsultationRecord(
        bookingDetails,
        paymentId,
        orderId,
        paymentVerification.details?.amount || 0,
        'failed',
        'payment_failed',
        'edge' // Add source as edge
      );
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          verified: false,
          error: "Payment verification failed",
          details: paymentVerification.error || "Unknown error"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    
    // Payment successfully verified
    console.log(`[EDGE] Payment verified successfully for ${paymentId}`);
    const paymentDetails = paymentVerification.details;
    
    // Since payment is verified, immediately return a success response
    // This allows the frontend to redirect the user to the thank you page
    // without waiting for the consultation record creation or email sending
    const response = new Response(
      JSON.stringify({ 
        success: true, 
        verified: true,
        paymentId,
        orderId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
    
    // Use waitUntil for background tasks that don't need to block the response
    // This allows us to continue with consultation record creation and email sending
    // without delaying the response to the frontend
    try {
      // Step 2: Create or update consultation record
      const consultationResult = await createConsultationRecord(
        bookingDetails,
        paymentId,
        orderId,
        paymentDetails!.amount / 100, // Convert from paise to rupees
        'completed',
        'confirmed',
        'edge' // Add source as edge
      );
      
      if (!consultationResult.success) {
        console.error("[EDGE] Failed to create consultation record:", consultationResult.error);
      } else {
        // Step 3: Send confirmation email (only for successful payments)
        console.log("[EDGE] Sending confirmation email with admin BCC");
        const emailResult = await sendConfirmationEmail(bookingDetails);
        console.log("[EDGE] Email sending result:", emailResult);
      }
    } catch (backgroundError) {
      console.error("[EDGE] Error in background tasks:", backgroundError);
    }
    
    return response;
  } catch (error) {
    console.error("[EDGE] Error in verify-payment function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Internal server error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

console.log("[EDGE] Verify payment handler initialized");
serve(handler);
