
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { determineServiceCategory } from "./utils.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || '';
const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Razorpay API error: ${response.status} ${errorText}`);
    }
    
    const paymentDetails = await response.json();
    console.log("Payment details from Razorpay:", paymentDetails);
    
    // Consider payment verified if status is authorized or captured
    const validStatuses = ['authorized', 'captured'];
    const verified = validStatuses.includes(paymentDetails.status);
    
    return { verified, details: paymentDetails };
  } catch (error) {
    console.error("Error verifying payment with Razorpay:", error);
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
  bookingStatus: string
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
          source: "edge", // Mark source as edge
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
      const { data: newConsultation, error: insertError } = await supabase
        .from('consultations')
        .insert({
          client_name: clientName,
          client_email: email,
          client_phone: phone,
          reference_id: referenceId,
          consultation_type: consultationType || services.join(','),
          service_category: serviceCategory || determineServiceCategory(services[0]),
          date: date ? new Date(date).toISOString() : null,
          time_slot: timeSlot || null,
          timeframe: timeframe || null,
          message: message || null,
          payment_id: paymentId,
          order_id: orderId,
          amount: amount,
          payment_status: paymentStatus,
          status: bookingStatus,
          source: "edge", // Mark source as edge
          email_sent: false // Will be updated after email is sent
        })
        .select('id')
        .single();
      
      if (insertError) {
        console.error("Error creating consultation record:", insertError);
        return { success: false, error: insertError.message };
      }
      
      return { success: true, consultationId: newConsultation.id };
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
  bookingDetails: VerifyPaymentRequest['bookingDetails'],
  referenceId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log(`Sending confirmation email for booking ${referenceId}`);
    
    // Add additional error handling for email sending
    try {
      const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'booking-confirmation',
          clientName: bookingDetails.clientName,
          email: bookingDetails.email,
          referenceId: bookingDetails.referenceId,
          consultationType: bookingDetails.consultationType,
          services: bookingDetails.services,
          date: bookingDetails.date,
          timeSlot: bookingDetails.timeSlot,
          timeframe: bookingDetails.timeframe,
          serviceCategory: bookingDetails.serviceCategory,
          highPriority: true
        }
      });
      
      if (emailError) {
        console.error("Error sending confirmation email:", emailError);
        return { success: false, error: emailError.message };
      }
      
      console.log("Email sent successfully:", emailResponse);
      
      // Update the consultation record to mark email as sent
      try {
        const { error: updateError } = await supabase
          .from('consultations')
          .update({ email_sent: true })
          .eq('reference_id', referenceId);
        
        if (updateError) {
          console.error("Error updating email_sent status:", updateError);
        } else {
          console.log(`Marked email as sent for consultation ${referenceId}`);
        }
      } catch (updateErr) {
        console.error("Exception updating email_sent status:", updateErr);
      }
    } catch (emailErr) {
      // Don't fail the entire process if email sending fails
      console.error("Exception in email sending:", emailErr);
      return { success: false, error: emailErr.message };
    }
    
    // Return success since we've tried to send the email
    return { success: true };
  } catch (error) {
    console.error("Exception in sendConfirmationEmail:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Process background tasks for payment verification
 */
async function processBackgroundTasks(
  bookingDetails: VerifyPaymentRequest['bookingDetails'],
  paymentId: string,
  orderId: string,
  paymentDetails: RazorpayPaymentDetail
) {
  try {
    // Step 1: Create or update consultation record
    const consultationResult = await createConsultationRecord(
      bookingDetails,
      paymentId,
      orderId,
      paymentDetails.amount / 100, // Convert from paise to rupees
      'completed',
      'confirmed'
    );
    
    if (!consultationResult.success) {
      console.error("Failed to create consultation record:", consultationResult.error);
      return;
    }
    
    console.log("Consultation record created successfully");
    
    // Step 2: Send confirmation email
    const emailResult = await sendConfirmationEmail(bookingDetails, bookingDetails.referenceId);
    
    if (!emailResult.success) {
      console.error("Failed to send confirmation email:", emailResult.error);
    }
  } catch (error) {
    console.error("Error in background tasks:", error);
  }
}

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const requestData = await req.json() as VerifyPaymentRequest;
    const { paymentId, orderId, signature, bookingDetails } = requestData;
    
    if (!paymentId || !bookingDetails || !bookingDetails.referenceId) {
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
    
    // Return success response immediately before starting background tasks
    const responseData = { 
      success: true, 
      verified: true,
      consultationId: "pending", // Will be created in background
      redirectUrl: "/thank-you",
      paymentId,
      orderId
    };
    
    // Start background tasks without awaiting
    if (EdgeRuntime && typeof EdgeRuntime.waitUntil === 'function') {
      EdgeRuntime.waitUntil(
        processBackgroundTasks(bookingDetails, paymentId, orderId, paymentDetails!)
      );
    } else {
      // Fallback for environments that don't support waitUntil
      setTimeout(() => {
        processBackgroundTasks(bookingDetails, paymentId, orderId, paymentDetails!);
      }, 0);
    }
    
    // Return success response immediately
    return new Response(
      JSON.stringify(responseData),
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

serve(handler);
