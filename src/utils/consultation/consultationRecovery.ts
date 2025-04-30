
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";

// Fetch consultation data from Supabase by reference ID
export const fetchConsultationData = async (referenceId: string): Promise<any | null> => {
  try {
    console.log(`Fetching consultation data for reference ID: ${referenceId}`);
    
    // Query the consultations table for the record with matching reference_id
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("Error fetching consultation data:", error);
      return null;
    }
    
    console.log(`Consultation data found for ${referenceId}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching consultation data for ${referenceId}:`, error);
    return null;
  }
};

// Convert a Supabase consultation record to BookingDetails format
export const createBookingDetailsFromConsultation = (consultation: any): BookingDetails | null => {
  if (!consultation) return null;
  
  try {
    const bookingDetails: BookingDetails = {
      clientName: consultation.client_name || '',
      email: consultation.client_email || '',
      phone: consultation.client_phone || '',
      referenceId: consultation.reference_id || '',
      consultationType: consultation.consultation_type || '',
      services: consultation.consultation_type ? [consultation.consultation_type] : [],
      date: consultation.date ? new Date(consultation.date) : undefined,
      timeSlot: consultation.time_slot || '',
      timeframe: consultation.timeframe || '',
      serviceCategory: consultation.service_category || '',
      message: consultation.message || '',
      amount: consultation.amount ? Number(consultation.amount) : undefined,
      paymentId: consultation.payment_id || undefined
    };
    
    return bookingDetails;
  } catch (error) {
    console.error("Error creating BookingDetails from consultation:", error);
    return null;
  }
};
