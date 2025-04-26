
import { generateReferenceId } from "./referenceGenerator";
import { PersonalDetails } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const saveConsultation = async (
  consultationType: string,
  date: Date | undefined,
  timeSlotOrTimeframe: string,
  personalDetails: PersonalDetails
) => {
  // For holistic packages, we use timeframe instead of specific date
  const isTimeframe = ['1-2-weeks', '2-4-weeks', '4-weeks-plus'].includes(timeSlotOrTimeframe);
  
  console.log("saveConsultation called with:", { 
    consultationType, 
    date: date?.toISOString() || 'Using timeframe instead', 
    timeSlotOrTimeframe, 
    isTimeframe,
    personalDetails 
  });

  try {
    // Create a reference ID for the consultation
    const referenceId = generateReferenceId();
    console.log("Generated reference ID:", referenceId);

    // Prepare the consultation data
    const consultationData = {
      consultation_type: consultationType,
      date: date ? date.toISOString() : null,
      time_slot: isTimeframe ? null : timeSlotOrTimeframe,
      timeframe: isTimeframe ? timeSlotOrTimeframe : null,
      client_name: `${personalDetails.firstName} ${personalDetails.lastName}`,
      client_email: personalDetails.email,
      client_phone: personalDetails.phone,
      status: 'scheduled', // Initially set to scheduled, will be updated to 'paid' after payment
      message: personalDetails.message,
      reference_id: referenceId,
    };
    
    console.log("Saving consultation to Supabase:", consultationData);
    
    // Insert the consultation into Supabase
    const { data, error } = await supabase
      .from('consultations')
      .insert(consultationData)
      .select();
    
    if (error) {
      console.error("Error inserting consultation into Supabase:", error);
      throw new Error(`Failed to save consultation: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.error("No data returned after inserting consultation");
      throw new Error("Failed to save consultation: No data returned");
    }
    
    console.log("Consultation saved successfully to Supabase:", data);
    
    return { ...data[0], referenceId };
  } catch (error) {
    console.error("Error in saveConsultation:", error);
    throw error;
  }
};

// Update a consultation record (e.g., after payment)
export const updateConsultationStatus = async (
  referenceId: string,
  newStatus: string
) => {
  try {
    console.log(`Updating consultation ${referenceId} to status ${newStatus}`);
    
    const { data, error } = await supabase
      .from('consultations')
      .update({ status: newStatus })
      .eq('reference_id', referenceId)
      .select();
    
    if (error) {
      console.error("Error updating consultation status:", error);
      return false;
    }
    
    console.log("Consultation status updated successfully:", data);
    return true;
  } catch (error) {
    console.error("Error in updateConsultationStatus:", error);
    return false;
  }
};

// Get consultation details by reference ID
export const getConsultationByReferenceId = async (referenceId: string) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("Error fetching consultation by reference ID:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getConsultationByReferenceId:", error);
    return null;
  }
};
