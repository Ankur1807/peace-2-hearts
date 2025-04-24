
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
      status: 'scheduled',
      message: personalDetails.message,
      reference_id: referenceId
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
    
    console.log("Consultation saved successfully to Supabase:", data);
    
    return { ...data[0], referenceId };
  } catch (error) {
    console.error("Error in saveConsultation:", error);
    throw error;
  }
};

