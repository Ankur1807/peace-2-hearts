
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

    // Get current authenticated user, if any
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id || '00000000-0000-0000-0000-000000000000'; // Default anonymous user ID
    
    // Get default consultant ID (for now use a placeholder)
    // In a real scenario, this would come from a selection or assignment logic
    const defaultConsultantId = '00000000-0000-0000-0000-000000000000'; // Replace with actual default consultant logic
    
    console.log("Using user ID:", userId);
    console.log("Using consultant ID:", defaultConsultantId);

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
      reference_id: referenceId,
      user_id: userId,
      consultant_id: defaultConsultantId
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
