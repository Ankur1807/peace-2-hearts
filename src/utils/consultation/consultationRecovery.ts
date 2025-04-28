
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";

export const fetchConsultationData = async (referenceId: string): Promise<any> => {
  if (!referenceId) return null;
  
  console.log("Attempting to fetch consultation data for reference ID:", referenceId);
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*, payments(*)')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("Error fetching consultation data:", error);
      
      const { data: similarData, error: searchError } = await supabase
        .from('consultations')
        .select('reference_id, client_name, status')
        .ilike('reference_id', `%${referenceId.slice(-6)}%`)
        .limit(5);
        
      if (!searchError && similarData && similarData.length > 0) {
        console.log("Found similar reference IDs:", similarData);
      }
      
      return null;
    }
    
    console.log("Successfully retrieved consultation data:", data);
    return data;
  } catch (error) {
    console.error("Exception fetching consultation data:", error);
    return null;
  }
};

export const createBookingDetailsFromConsultation = (consultation: any): BookingDetails | null => {
  if (!consultation) return null;
  
  try {
    let bookingDate: Date | undefined = undefined;
    if (consultation.date) {
      try {
        bookingDate = new Date(consultation.date);
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    }
    
    let amount = 0;
    if (consultation.payments && consultation.payments.length > 0) {
      amount = consultation.payments[0].amount;
    }
    
    const services = consultation.consultation_type ? 
      [consultation.consultation_type] : [];
    
    return {
      clientName: consultation.client_name || '',
      email: consultation.client_email || '',
      referenceId: consultation.reference_id || '',
      consultationType: consultation.consultation_type || '',
      services: services,
      date: bookingDate,
      timeSlot: consultation.time_slot || undefined,
      timeframe: consultation.timeframe || undefined,
      message: consultation.message || '',
      amount: amount,
      serviceCategory: getServiceCategoryFromConsultationType(consultation.consultation_type)
    };
  } catch (error) {
    console.error("Error creating booking details from consultation:", error);
    return null;
  }
};

const getServiceCategoryFromConsultationType = (type: string): string => {
  if (!type) return '';
  
  if (type.includes('holistic') || 
      type.includes('divorce-prevention') || 
      type.includes('pre-marriage-clarity')) {
    return 'holistic';
  }
  
  if (type.includes('legal') || 
      type.includes('divorce') || 
      type.includes('custody')) {
    return 'legal';
  }
  
  if (type.includes('psychological') || 
      type.includes('therapy') || 
      type.includes('counseling')) {
    return 'psychological';
  }
  
  return '';
};
