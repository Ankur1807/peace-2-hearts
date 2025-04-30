
import { generateReferenceId } from "./referenceGenerator";
import { PersonalDetails } from "./types";
import { supabase } from "@/integrations/supabase/client";

// This function is kept for reference but should not be used anymore.
// All database operations should happen via the verify-payment edge function.
// Note: This function is now marked as deprecated
/**
 * @deprecated This function should no longer be used. All database operations are now handled by edge functions.
 */
export const saveConsultation = async (
  consultationType: string,
  date: Date | undefined,
  timeSlotOrTimeframe: string,
  personalDetails: PersonalDetails
) => {
  console.warn("saveConsultation is deprecated and should not be called directly - use edge functions instead");
  // This function is kept for backward compatibility but should not be used anymore
  throw new Error("Direct database operations from frontend are no longer supported. Use edge functions instead.");
};

// Update a consultation record - now should only be done via edge functions
/**
 * @deprecated This function should no longer be used. All database operations are now handled by edge functions.
 */
export const updateConsultationStatus = async (
  referenceId: string,
  newStatus: string
) => {
  console.warn("updateConsultationStatus is deprecated and should not be called directly - use edge functions instead");
  // This function is kept for backward compatibility but should not be used anymore
  throw new Error("Direct database operations from frontend are no longer supported. Use edge functions instead.");
};

// Get consultation details by reference ID - read operation is still allowed
export const getConsultationByReferenceId = async (referenceId: string) => {
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
    console.error("Error in getConsultationByReferenceId:", error);
    return null;
  }
};
