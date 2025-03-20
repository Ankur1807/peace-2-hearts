
import { supabase } from "@/integrations/supabase/client";
import { generateReferenceId } from "./referenceGenerator";
import { PersonalDetails } from "./types";

export const saveConsultation = async (
  consultationType: string,
  date: Date | undefined,
  timeSlot: string,
  personalDetails: PersonalDetails
) => {
  if (!date) {
    throw new Error("Date is required");
  }

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

    // If no consultant is found with the specific specialization, try to find any available consultant
    let consultantId;
    if (consultants && consultants.length > 0) {
      consultantId = consultants[0].id;
    } else {
      // Select any consultant as fallback
      const { data: anyConsultant, error: anyConsultantError } = await supabase
        .from('consultants')
        .select('id')
        .limit(1);
        
      if (anyConsultantError) {
        throw new Error("Unable to check consultant availability. Please try again later.");
      }
      
      if (!anyConsultant || anyConsultant.length === 0) {
        // No consultants available in the system - create placeholder entry for testing
        const { data: newConsultant, error: createError } = await supabase
          .from('consultants')
          .insert({
            specialization: 'general',
            is_available: true,
            hourly_rate: 1000,
            profile_id: '00000000-0000-0000-0000-000000000000' // Placeholder ID
          })
          .select();
          
        if (createError) {
          console.error("Error creating placeholder consultant:", createError);
          throw new Error("No consultants available. Please contact support for assistance.");
        }
        
        consultantId = newConsultant[0].id;
      } else {
        consultantId = anyConsultant[0].id;
      }
    }

    // Create a reference ID for the consultation
    const referenceId = generateReferenceId();

    // Save the consultation without requiring user authentication
    const { data: consultation, error: consultationError } = await supabase
      .from('consultations')
      .insert({
        consultant_id: consultantId,
        consultation_type: consultationType,
        date: date.toISOString(),
        time_slot: timeSlot,
        message: personalDetails.message,
        status: 'scheduled',
        user_id: 'guest', // Using a placeholder value for non-authenticated users
        reference_id: referenceId,
        client_name: `${personalDetails.firstName} ${personalDetails.lastName}`,
        client_email: personalDetails.email,
        client_phone: personalDetails.phone
      })
      .select()
      .single();

    if (consultationError) {
      console.error("Error saving consultation:", consultationError);
      throw new Error("Unable to save your consultation. Please try again later.");
    }

    return { ...consultation, referenceId };
  } catch (error) {
    console.error("Error in saveConsultation:", error);
    throw error;
  }
};
