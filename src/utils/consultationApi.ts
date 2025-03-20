
import { supabase } from "@/integrations/supabase/client";
import { generateReferenceId } from "./referenceGenerator";

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

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
      throw consultantError;
    }

    // If no consultant is found, use any available consultant
    let consultantId;
    if (consultants && consultants.length > 0) {
      consultantId = consultants[0].id;
    } else {
      // Select any consultant
      const { data: anyConsultant, error: anyConsultantError } = await supabase
        .from('consultants')
        .select('id')
        .limit(1);
        
      if (anyConsultantError || !anyConsultant || anyConsultant.length === 0) {
        throw new Error("No consultants available. Please contact support.");
      }
      
      consultantId = anyConsultant[0].id;
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
      throw consultationError;
    }

    return { ...consultation, referenceId };
  } catch (error) {
    console.error("Error in saveConsultation:", error);
    throw error;
  }
};
