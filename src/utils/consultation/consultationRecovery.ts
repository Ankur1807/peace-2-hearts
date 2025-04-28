
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";

/**
 * Fetch consultation data by reference ID
 */
export const fetchConsultationData = async (referenceId: string) => {
  try {
    console.log("Fetching consultation data for reference ID:", referenceId);
    
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("reference_id", referenceId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching consultation:", error);
      return null;
    }
    
    if (!data) {
      console.log("No consultation found for reference ID:", referenceId);
      return null;
    }
    
    console.log("Consultation data retrieved:", data);
    return data;
  } catch (error) {
    console.error("Exception in fetchConsultationData:", error);
    return null;
  }
};

/**
 * Convert consultation data to booking details format
 */
export const createBookingDetailsFromConsultation = (consultation: any): BookingDetails | null => {
  try {
    if (!consultation) return null;
    
    console.log("Creating booking details from consultation:", consultation);
    
    // Determine service category from consultation type
    let serviceCategory = 'legal';
    if (consultation.consultation_type.includes('psychological')) {
      serviceCategory = 'psychological';
    } else if (consultation.consultation_type.includes('holistic') || 
               consultation.timeframe) {
      serviceCategory = 'holistic';
    }
    
    // Parse services from consultation type
    let services = [consultation.consultation_type];
    if (consultation.consultation_type.includes(',')) {
      services = consultation.consultation_type.split(',').map((s: string) => s.trim());
    }
    
    const bookingDetails: BookingDetails = {
      clientName: consultation.client_name || '',
      email: consultation.client_email || '',
      referenceId: consultation.reference_id || '',
      consultationType: consultation.consultation_type || '',
      services: services,
      date: consultation.date ? new Date(consultation.date) : undefined,
      timeSlot: consultation.time_slot || undefined,
      timeframe: consultation.timeframe || undefined,
      message: consultation.message || '',
      serviceCategory: serviceCategory,
      amount: 0 // Will be filled by payment data later
    };
    
    console.log("Created booking details:", bookingDetails);
    return bookingDetails;
  } catch (error) {
    console.error("Error creating booking details from consultation:", error);
    return null;
  }
};

/**
 * Check if a payment record exists for a reference ID
 */
export const checkPaymentRecord = async (referenceId: string): Promise<boolean> => {
  try {
    // First get consultation ID from reference
    const { data: consultation, error: consultationError } = await supabase
      .from("consultations")
      .select("id")
      .eq("reference_id", referenceId)
      .maybeSingle();
    
    if (consultationError || !consultation) {
      console.error("Error or no consultation found:", consultationError);
      return false;
    }
    
    // Check for payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id, payment_status")
      .eq("consultation_id", consultation.id)
      .maybeSingle();
    
    if (paymentError) {
      console.error("Error checking payment record:", paymentError);
      return false;
    }
    
    return payment !== null && payment.payment_status === 'completed';
  } catch (error) {
    console.error("Exception in checkPaymentRecord:", error);
    return false;
  }
};

/**
 * Create a recovery consultation record for orphaned payments
 */
export const createRecoveryConsultation = async (
  referenceId: string, 
  paymentId: string, 
  amount: number
): Promise<string | null> => {
  try {
    console.log("Creating recovery consultation for orphaned payment:", {
      referenceId,
      paymentId,
      amount
    });
    
    const { data, error } = await supabase
      .from("consultations")
      .insert({
        reference_id: referenceId,
        status: 'payment_received_needs_details',
        consultation_type: 'recovery_needed',
        time_slot: 'recovery_needed',
        client_name: 'Payment Received - Recovery Needed',
        client_email: 'recovery@peace2hearts.com',
        message: `Payment received but consultation details missing. Payment ID: ${paymentId}, Amount: ${amount}`
      })
      .select();
      
    if (error) {
      console.error("Failed to create recovery consultation:", error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.error("No data returned after creating recovery consultation");
      return null;
    }
    
    console.log("Created recovery consultation:", data[0]);
    return data[0].id;
  } catch (error) {
    console.error("Exception in createRecoveryConsultation:", error);
    return null;
  }
};
