import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";

/**
 * Create a consultation record from booking details
 */
export const createConsultationFromBookingDetails = async (bookingDetails: BookingDetails): Promise<boolean> => {
  try {
    const { 
      clientName, 
      email, 
      referenceId,
      consultationType,
      date,
      timeSlot,
      timeframe,
      message,
      services
    } = bookingDetails;

    if (!referenceId) {
      console.error("Cannot create consultation without reference ID");
      return false;
    }

    console.log("Creating consultation from booking details:", bookingDetails);

    // Check if the consultation already exists
    const { data: existingConsultation } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .maybeSingle();

    if (existingConsultation) {
      console.log("Consultation already exists for reference ID:", referenceId);
      return true;
    }

    const consultationData = {
      reference_id: referenceId,
      client_name: clientName || "Unknown Client",
      client_email: email,
      consultation_type: consultationType || services?.join(',') || "Unknown",
      date: date ? new Date(date).toISOString() : null,
      time_slot: timeSlot || null,
      timeframe: timeframe || null,
      status: 'paid', // Since we're creating this after payment
      message: message || "Created from payment recovery"
    };

    console.log("Inserting new consultation with data:", consultationData);

    const { data, error } = await supabase
      .from('consultations')
      .insert(consultationData)
      .select();

    if (error) {
      console.error("Error creating consultation from booking details:", error);
      return false;
    }

    console.log("Successfully created consultation:", data);
    return true;
  } catch (error) {
    console.error("Exception creating consultation from booking details:", error);
    return false;
  }
};

/**
 * Create a recovery consultation with minimal information
 */
export const createRecoveryConsultation = async (
  referenceId: string, 
  paymentId: string, 
  amount: number,
  additionalData: any = null
): Promise<string | null> => {
  try {
    // Check if the consultation already exists
    const { data: existingConsultation } = await supabase
      .from('consultations')
      .select('id')
      .eq('reference_id', referenceId)
      .maybeSingle();

    if (existingConsultation) {
      console.log("Consultation already exists for reference ID:", referenceId);
      return existingConsultation.id;
    }

    let clientName = 'Payment Received - Recovery Needed';
    let consultationType = 'recovery_needed';
    let clientEmail = null;
    let message = `Payment received but consultation details missing. Payment ID: ${paymentId}, Amount: ${amount}`;
    
    // If we have additional data, use it
    if (additionalData) {
      if (additionalData.clientName) clientName = additionalData.clientName;
      if (additionalData.email) clientEmail = additionalData.email;
      if (additionalData.consultationType) consultationType = additionalData.consultationType;
      if (additionalData.message) message += `. Client message: ${additionalData.message}`;
    }

    const consultationData = {
      reference_id: referenceId,
      status: 'payment_received_needs_details',
      consultation_type: consultationType,
      time_slot: 'recovery_needed',
      client_name: clientName,
      client_email: clientEmail,
      message: message
    };
    
    console.log("Creating recovery consultation:", consultationData);

    const { data, error } = await supabase
      .from('consultations')
      .insert(consultationData)
      .select();

    if (error) {
      console.error("Error creating recovery consultation:", error);
      return null;
    }

    console.log("Successfully created recovery consultation:", data);
    return data[0]?.id || null;
  } catch (error) {
    console.error("Exception in createRecoveryConsultation:", error);
    return null;
  }
};

/**
 * Fetch consultation data by reference ID
 */
export const fetchConsultationData = async (referenceId: string) => {
  try {
    console.log("Fetching consultation with reference ID:", referenceId);
    
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("Error fetching consultation by reference ID:", error);
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
 * Check if a payment record exists for a reference ID
 */
export const checkPaymentRecord = async (referenceId: string): Promise<boolean> => {
  try {
    console.log("Checking if payment record exists for reference ID:", referenceId);
    
    // First get the consultation ID from the reference ID
    const { data: consultationData, error: consultationError } = await supabase
      .from('consultations')
      .select('id')
      .eq('reference_id', referenceId)
      .maybeSingle();
    
    if (consultationError || !consultationData) {
      console.log("No consultation found for reference ID:", referenceId);
      return false;
    }
    
    // Check if there's a payment record for this consultation
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .select('id')
      .eq('consultation_id', consultationData.id)
      .maybeSingle();
    
    if (paymentError) {
      console.error("Error checking payment record:", paymentError);
      return false;
    }
    
    return !!paymentData;
  } catch (error) {
    console.error("Exception checking payment record:", error);
    return false;
  }
};

/**
 * Create booking details object from consultation data
 */
export const createBookingDetailsFromConsultation = (consultationData: any): BookingDetails | null => {
  if (!consultationData) return null;
  
  try {
    const services = consultationData.consultation_type?.includes(',') 
      ? consultationData.consultation_type.split(',') 
      : [consultationData.consultation_type];
    
    // Determine service category based on consultation type
    let serviceCategory = 'psychological';
    if (consultationData.consultation_type?.includes('legal') || consultationData.consultation_type?.includes('divorce')) {
      serviceCategory = 'legal';
    } else if (consultationData.timeframe || consultationData.consultation_type?.includes('holistic')) {
      serviceCategory = 'holistic';
    }
    
    return {
      clientName: consultationData.client_name || '',
      email: consultationData.client_email || '',
      referenceId: consultationData.reference_id || '',
      consultationType: consultationData.consultation_type || '',
      services: services,
      date: consultationData.date ? new Date(consultationData.date) : undefined,
      timeSlot: consultationData.time_slot || undefined,
      timeframe: consultationData.timeframe || undefined,
      message: consultationData.message || '',
      serviceCategory: serviceCategory
    };
  } catch (error) {
    console.error("Error creating booking details from consultation:", error);
    return null;
  }
};
