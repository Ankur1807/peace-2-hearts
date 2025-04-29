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
    
    console.log(`Creating consultation record with reference ID: ${referenceId}`);
    
    // Check if a record already exists with this reference ID
    const { data: existingConsultation, error: checkError } = await supabase
      .from('consultations')
      .select('id')
      .eq('reference_id', referenceId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking for existing consultation:", checkError);
      return { success: false, error: checkError.message };
    }
    
    if (existingConsultation) {
      console.log(`Consultation with reference ID ${referenceId} already exists, updating status`);
      
      // Update existing record
      const { data: updatedData, error: updateError } = await supabase
        .from('consultations')
        .update({
          payment_id: paymentId,
          order_id: orderId,
          amount: amount,
          payment_status: paymentStatus,
          status: bookingStatus,
          updated_at: new Date().toISOString()
        })
        .eq('reference_id', referenceId)
        .select('id')
        .single();
      
      if (updateError) {
        console.error("Error updating consultation:", updateError);
        return { success: false, error: updateError.message };
      }
      
      return { success: true, consultationId: updatedData.id };
    } else {
      // Create new consultation record
      const effectiveServiceCategory = serviceCategory || determineServiceCategory(services[0] || consultationType);
      
      console.log("Creating new consultation with data:", { 
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
        source: source // Add source field
      };

      try {
        const { data: insertData, error: insertError } = await supabase
          .from('consultations')
          .insert(consultationData)
          .select('id')
          .single();
        
        if (insertError) {
          console.error("Error creating consultation record:", insertError);
          return { success: false, error: insertError.message };
        }
        
        return { success: true, consultationId: insertData.id };
      } catch (e) {
        console.error("Exception during insert operation:", e);
        return { success: false, error: e.message };
      }
    }
  } catch (error) {
    console.error("Error in createConsultationRecord:", error);
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
    console.log(`Sending confirmation email for booking ${bookingDetails.referenceId}`);
    
    // Add additional error handling for email sending
    try {
      const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'booking-confirmation',
          to: bookingDetails.email,
          bcc: "admin@peace2hearts.com", // Add admin email as BCC
          clientName: bookingDetails.clientName,
          referenceId: bookingDetails.referenceId,
          serviceType: bookingDetails.consultationType || bookingDetails.services.join(', '),
          date: bookingDetails.date || 'To be scheduled',
          time: bookingDetails.timeSlot || bookingDetails.timeframe || '',
          price: bookingDetails.amount ? `₹${bookingDetails.amount}` : 'To be confirmed',
          highPriority: true
        }
      });
      
      if (emailError) {
        console.error("Error sending confirmation email:", emailError);
        return { success: false, error: emailError.message };
      }
      
      console.log("Email sent successfully:", emailResponse);
    } catch (emailErr) {
      // Don't fail the entire process if email sending fails
      console.error("Exception in email sending:", emailErr);
      return { success: false, error: emailErr.message };
    }
    
    // Update the consultation record to mark email as sent - don't fail if this doesn't work
    try {
      const { error: updateError } = await supabase
        .from('consultations')
        .update({ email_sent: true })
        .eq('reference_id', bookingDetails.referenceId);
      
      if (updateError) {
        console.error("Error updating email_sent status:", updateError);
      }
    } catch (updateErr) {
      console.error("Exception updating email_sent status:", updateErr);
    }
    
    // Return success even if there were errors updating the database
    return { success: true };
  } catch (error) {
    console.error("Exception in sendConfirmationEmail:", error);
    return { success: false, error: error.message };
  }
}

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  console.log("Verify payment function called");
  
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
      console.error("Error parsing request body:", parseError);
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
      console.error("Missing required parameters:", { 
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
    
    console.log(`Processing payment verification for: ${paymentId}, reference: ${bookingDetails.referenceId}`);
    
    // Step 1: Verify payment with Razorpay
    const paymentVerification = await verifyPaymentWithRazorpay(paymentId);
    
    if (!paymentVerification.verified) {
      console.log(`Payment verification failed for ${paymentId}`);
      
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
    console.log(`Payment verified successfully for ${paymentId}`);
    const paymentDetails = paymentVerification.details;
    
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
      return new Response(
        JSON.stringify({ 
          success: false, 
          verified: true,
          error: "Failed to create consultation record",
          details: consultationResult.error
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    
    // Step 3: Send confirmation email (only for successful payments)
    const emailResult = await sendConfirmationEmail(bookingDetails);
    
    // Return success response even if email fails (we'll have recovery mechanisms)
    return new Response(
      JSON.stringify({ 
        success: true, 
        verified: true,
        consultationId: consultationResult.consultationId,
        emailSent: emailResult.success,
        emailError: emailResult.error
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error) {
    console.error("Error in verify-payment function:", error);
    
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

console.log("Verify payment handler initialized");
serve(handler);
