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
    console.log("[BOOKING FLOW] Generated reference ID:", referenceId);

    // Prepare the consultation data (but don't insert)
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
      reference_id: referenceId
    };
    
    console.log("[BOOKING FLOW] Checking for existing consultation with reference ID:", referenceId);
    
    // Check if consultation record already exists
    const { data: existingConsultation, error: checkError } = await supabase
      .from('consultations')
      .select('id')
      .eq('reference_id', referenceId)
      .maybeSingle();
    
    if (checkError) {
      console.error("[BOOKING FLOW] Error checking for existing consultation:", checkError);
      throw checkError;
    }
    
    if (existingConsultation) {
      console.log("[BOOKING FLOW] Consultation record already exists for reference ID:", referenceId);
      // Return the existing record data
      return { ...existingConsultation, referenceId };
    }
    
    console.log("[BOOKING FLOW] No existing consultation found - returning reference ID only:", referenceId);
    
    // Return just the reference ID without inserting
    return { referenceId };
  } catch (error) {
    console.error("[BOOKING FLOW] Error in saveConsultation:", error);
    
    // Log additional information about the connection
    try {
      const { data: connectionTest, error: connectionError } = await supabase
        .from('consultations')
        .select('count(*)')
        .limit(1);
        
      if (connectionError) {
        console.error("[BOOKING FLOW] Database connection test failed:", connectionError);
      } else {
        console.log("[BOOKING FLOW] Database connection test succeeded:", connectionTest);
      }
    } catch (testError) {
      console.error("[BOOKING FLOW] Error testing database connection:", testError);
    }
    
    throw error;
  }
};

// Update a consultation record (e.g., after payment) - keep for reference but don't use
export const updateConsultationStatus = async (
  referenceId: string,
  newStatus: string
) => {
  try {
    console.log(`[BOOKING FLOW] Updating consultation ${referenceId} to status ${newStatus}`);
    
    const { data, error } = await supabase
      .from('consultations')
      .update({ status: newStatus })
      .eq('reference_id', referenceId)
      .select();
    
    if (error) {
      console.error("[BOOKING FLOW] Error updating consultation status:", error);
      return false;
    }
    
    console.log("[BOOKING FLOW] Consultation status updated successfully:", data);
    return true;
  } catch (error) {
    console.error("[BOOKING FLOW] Error in updateConsultationStatus:", error);
    return false;
  }
};

// Get consultation details by reference ID
export const getConsultationByReferenceId = async (referenceId: string) => {
  try {
    console.log("[BOOKING FLOW] Fetching consultation with reference ID:", referenceId);
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("[BOOKING FLOW] Error fetching consultation by reference ID:", error);
      return null;
    }
    
    console.log("[BOOKING FLOW] Consultation data retrieved:", data);
    return data;
  } catch (error) {
    console.error("[BOOKING FLOW] Error in getConsultationByReferenceId:", error);
    return null;
  }
};
