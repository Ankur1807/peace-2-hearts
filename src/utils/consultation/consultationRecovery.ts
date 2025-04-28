
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";
import { determineServiceCategory } from "@/utils/payment/services/serviceUtils";

/**
 * Fetch consultation data by reference ID
 */
export async function fetchConsultationData(referenceId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("Error fetching consultation:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchConsultationData:", error);
    return null;
  }
}

/**
 * Fetch consultation by reference ID - alias for fetchConsultationData
 * for backward compatibility
 */
export async function fetchConsultationByReferenceId(referenceId: string): Promise<any> {
  return fetchConsultationData(referenceId);
}

/**
 * Check consultation payment status
 */
export async function checkConsultationStatus(referenceId: string): Promise<{
  exists: boolean;
  status?: string;
  paymentStatus?: string;
  emailSent?: boolean;
}> {
  try {
    const consultation = await fetchConsultationData(referenceId);
    
    if (!consultation) {
      return { exists: false };
    }
    
    return {
      exists: true,
      status: consultation.status,
      paymentStatus: consultation.payment_status,
      emailSent: consultation.email_sent
    };
  } catch (error) {
    console.error("Error checking consultation status:", error);
    return { exists: false };
  }
}

/**
 * Create booking details from consultation record
 */
export function createBookingDetailsFromConsultation(consultation: any): BookingDetails | null {
  try {
    if (!consultation) return null;
    
    // Determine service category
    const serviceCategory = determineServiceCategory(consultation.consultation_type);
    
    // Create booking details object
    const bookingDetails: BookingDetails = {
      referenceId: consultation.reference_id,
      clientName: consultation.client_name,
      email: consultation.client_email,
      consultationType: consultation.consultation_type,
      services: consultation.consultation_type ? consultation.consultation_type.split(',') : [],
      date: consultation.date ? new Date(consultation.date) : undefined,
      timeSlot: consultation.time_slot,
      timeframe: consultation.timeframe,
      message: consultation.message,
      serviceCategory: serviceCategory,
      amount: consultation.amount
    };
    
    return bookingDetails;
  } catch (error) {
    console.error("Error creating booking details from consultation:", error);
    return null;
  }
}

/**
 * Create consultation from booking details
 */
export async function createConsultationFromBookingDetails(bookingDetails: BookingDetails): Promise<any> {
  try {
    if (!bookingDetails.referenceId) {
      console.error("Missing reference ID in booking details");
      return null;
    }
    
    // Check if consultation already exists
    const { data: existingConsultation } = await supabase
      .from('consultations')
      .select('id')
      .eq('reference_id', bookingDetails.referenceId)
      .single();
    
    if (existingConsultation) {
      console.log("Consultation already exists for reference ID:", bookingDetails.referenceId);
      return existingConsultation;
    }
    
    // Create new consultation record
    const { data, error } = await supabase
      .from('consultations')
      .insert({
        reference_id: bookingDetails.referenceId,
        client_name: bookingDetails.clientName,
        client_email: bookingDetails.email,
        consultation_type: bookingDetails.consultationType,
        time_slot: bookingDetails.timeSlot,
        timeframe: bookingDetails.timeframe,
        date: bookingDetails.date instanceof Date ? bookingDetails.date.toISOString() : bookingDetails.date,
        message: bookingDetails.message,
        status: 'scheduled'
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating consultation from booking details:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception in createConsultationFromBookingDetails:", error);
    return null;
  }
}

/**
 * Create a recovery consultation for orphaned payments
 */
export async function createRecoveryConsultation(
  referenceId: string, 
  paymentId: string, 
  amount: number,
  orderId?: string
): Promise<boolean> {
  try {
    console.log("Attempting to create a recovery consultation record");
    
    const clientName = 'Payment Received - Recovery Needed';
    const consultationType = 'recovery_needed';
    const message = `Payment received but consultation details missing. Payment ID: ${paymentId}, Amount: ${amount}`;
    
    const { data: recoveryData, error: recoveryError } = await supabase
      .from('consultations')
      .insert({
        reference_id: referenceId,
        status: 'payment_received_needs_details',
        consultation_type: consultationType,
        time_slot: 'recovery_needed',
        client_name: clientName,
        message: message,
        payment_id: paymentId,
        amount: amount
      })
      .select();
      
    if (recoveryError) {
      console.error("Failed to create recovery consultation:", recoveryError);
      return false;
    }
    
    if (recoveryData) {
      console.log("Created recovery consultation:", recoveryData);
      return true;
    }
    
    return false;
  } catch (recoveryException) {
    console.error("Exception in recovery process:", recoveryException);
    return false;
  }
}
