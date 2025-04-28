
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
