
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
  
  console.log("saveConsultation called with:", { 
    consultationType, 
    date: date?.toISOString() || 'Using timeframe instead', 
    timeSlotOrTimeframe, 
    isTimeframe,
    personalDetails 
  });

  try {
    // Try to find a consultant with the appropriate specialization
    // Map consultation type to either "legal" or "mental_health" for consultant search
    let consultantSpecialization = consultationType.includes("legal") || 
                                  consultationType.includes("divorce") || 
                                  consultationType.includes("custody") || 
                                  consultationType.includes("mediation") ? 
                                  "legal" : "mental_health";
    
    const { data: consultants, error: consultantError } = await supabase
      .from('consultants')
      .select('id')
      .eq('specialization', consultantSpecialization)
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
        
        // First create a consultant profile
        const { data: newProfile, error: profileError } = await supabase
          .from('consultant_profiles')
          .insert({
            full_name: 'Default Consultant'
          })
          .select();
          
        if (profileError) {
          console.error("Error creating consultant profile:", profileError);
          throw new Error("No consultants available. Please contact support for assistance.");
        }
        
        // No consultants available in the system - create placeholder entry for testing
        const { data: newConsultant, error: createError } = await supabase
          .from('consultants')
          .insert({
            name: 'Default Consultant',
            specialization: consultantSpecialization,
            is_available: true,
            hourly_rate: 1000,
            profile_id: newProfile[0].id
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
    
    // Generate a random UUID for guest users instead of using the string "guest"
    const guestUserId = crypto.randomUUID();

    // Save the consultation without requiring user authentication
    const consultationData = {
      consultant_id: consultantId,
      consultation_type: consultationType,
      date: date ? date.toISOString() : null,
      time_slot: isTimeframe ? null : timeSlotOrTimeframe,
      timeframe: isTimeframe ? timeSlotOrTimeframe : null,
      message: personalDetails.message,
      status: 'scheduled',
      user_id: guestUserId, // Using a random UUID for guest users
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
