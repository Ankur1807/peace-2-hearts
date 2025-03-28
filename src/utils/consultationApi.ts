
import { supabase } from "@/integrations/supabase/client";
import { generateReferenceId } from "./referenceGenerator";
import { PersonalDetails } from "./types";

export const saveConsultation = async (
  consultationType: string,
  date: Date | undefined,
  timeSlotOrTimeframe: string,
  personalDetails: PersonalDetails
) => {
  // For holistic packages, we use timeframe instead of specific date
  const isTimeframe = ['1-2-weeks', '2-4-weeks', '4-weeks-plus'].includes(timeSlotOrTimeframe);
  
  if (!date && !isTimeframe) {
    throw new Error("Date or timeframe is required");
  }

  console.log("saveConsultation called with:", { 
    consultationType, 
    date: date?.toISOString() || 'Using timeframe instead', 
    timeSlotOrTimeframe, 
    personalDetails 
  });

  try {
    // Try to find a consultant with the appropriate specialization
    const { data: consultants, error: consultantError } = await supabase
      .from('consultants')
      .select('id')
      .eq('specialization', consultationType)
      .eq('is_available', true)
      .limit(1);

    if (consultantError) {
      console.error("Error fetching consultants:", consultantError);
      throw new Error("Unable to check consultant availability. Please try again later.");
    }

    console.log("Consultants query result:", consultants);

    // If no consultant is found with the specific specialization, try to find any available consultant
    let consultantId;
    if (consultants && consultants.length > 0) {
      consultantId = consultants[0].id;
    } else {
      console.log("No specific consultant found, looking for any consultant");
      // Select any consultant as fallback
      const { data: anyConsultant, error: anyConsultantError } = await supabase
        .from('consultants')
        .select('id')
        .limit(1);
        
      if (anyConsultantError) {
        console.error("Error fetching any consultant:", anyConsultantError);
        throw new Error("Unable to check consultant availability. Please try again later.");
      }
      
      console.log("Any consultant query result:", anyConsultant);
      
      if (!anyConsultant || anyConsultant.length === 0) {
        console.log("No consultants found, creating placeholder");
        // No consultants available in the system - create placeholder entry for testing
        const { data: newConsultant, error: createError } = await supabase
          .from('consultants')
          .insert({
            name: 'Default Consultant',
            specialization: 'general',
            is_available: true,
            hourly_rate: 1000,
            profile_id: crypto.randomUUID() // Generate a UUID instead of hardcoding
          })
          .select();
          
        if (createError) {
          console.error("Error creating placeholder consultant:", createError);
          throw new Error("No consultants available. Please contact support for assistance.");
        }
        
        console.log("Created new consultant:", newConsultant);
        consultantId = newConsultant[0].id;
      } else {
        consultantId = anyConsultant[0].id;
      }
    }

    console.log("Selected consultant ID:", consultantId);

    // Create a reference ID for the consultation
    const referenceId = generateReferenceId();
    console.log("Generated reference ID:", referenceId);

    // Save the consultation without requiring user authentication
    const consultationData = {
      consultant_id: consultantId,
      consultation_type: consultationType,
      date: date ? date.toISOString() : null,
      time_slot: isTimeframe ? null : timeSlotOrTimeframe,
      timeframe: isTimeframe ? timeSlotOrTimeframe : null,
      message: personalDetails.message,
      status: 'scheduled',
      user_id: 'guest', // Using a placeholder value for non-authenticated users
      reference_id: referenceId,
      client_name: `${personalDetails.firstName} ${personalDetails.lastName}`,
      client_email: personalDetails.email,
      client_phone: personalDetails.phone
    };
    
    console.log("Saving consultation with data:", consultationData);

    const { data: consultation, error: consultationError } = await supabase
      .from('consultations')
      .insert(consultationData)
      .select()
      .single();

    if (consultationError) {
      console.error("Error saving consultation:", consultationError);
      throw new Error(`Unable to save your consultation: ${consultationError.message}`);
    }

    console.log("Consultation saved successfully:", consultation);
    return { ...consultation, referenceId };
  } catch (error) {
    console.error("Error in saveConsultation:", error);
    throw error;
  }
};
