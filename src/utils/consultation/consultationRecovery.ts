
import { supabase } from '@/integrations/supabase/client';
import { BookingDetails } from '@/utils/types';
import { determineServiceCategory } from '@/utils/payment/services/serviceUtils';

/**
 * Check if a payment record exists for a reference ID
 */
export async function checkPaymentRecord(referenceId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('status')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("Error checking consultation status:", error);
      return false;
    }
    
    return data?.status === 'paid';
  } catch (error) {
    console.error("Exception checking consultation status:", error);
    return false;
  }
}

/**
 * Create booking details from consultation data
 */
export function createBookingDetailsFromConsultation(consultationData: any): BookingDetails {
  return {
    clientName: consultationData.client_name,
    email: consultationData.client_email,
    referenceId: consultationData.reference_id,
    consultationType: consultationData.consultation_type,
    services: consultationData.consultation_type.split(','),
    date: consultationData.date,
    timeSlot: consultationData.time_slot,
    timeframe: consultationData.timeframe,
    message: consultationData.message,
    phone: consultationData.client_phone,
    serviceCategory: determineServiceCategory(consultationData.consultation_type)
  };
}

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
      console.error("Error fetching consultation data:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception fetching consultation data:", error);
    return null;
  }
}

/**
 * Create a consultation from booking details
 */
export async function createConsultationFromBookingDetails(bookingDetails: BookingDetails): Promise<boolean> {
  try {
    console.log("Creating consultation from booking details:", bookingDetails);
    
    const consultationData = {
      reference_id: bookingDetails.referenceId,
      client_name: bookingDetails.clientName,
      client_email: bookingDetails.email,
      client_phone: bookingDetails.phone || null,
      consultation_type: bookingDetails.consultationType,
      date: bookingDetails.date || null,
      time_slot: bookingDetails.timeSlot || null,
      timeframe: bookingDetails.timeframe || null,
      message: bookingDetails.message || null,
      status: 'scheduled' // Default to scheduled, will be updated to paid later
    };
    
    const { error } = await supabase
      .from('consultations')
      .insert(consultationData);
    
    if (error) {
      console.error("Error creating consultation:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception creating consultation:", error);
    return false;
  }
}
