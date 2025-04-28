
/**
 * Utility functions for payment service
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Determine service category from consultation type
 */
export function determineServiceCategory(consultationType: string): string {
  if (!consultationType) return 'mental-health';
  
  const lowerCaseType = consultationType.toLowerCase();
  
  if (lowerCaseType.includes('legal') || lowerCaseType.includes('divorce')) {
    return 'legal';
  } else if (lowerCaseType.includes('holistic')) {
    return 'holistic';
  } else {
    return 'mental-health';
  }
}

/**
 * Update the status of a consultation
 */
export async function updateConsultationStatus(consultationId: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('consultations')
      .update({ status: status === 'completed' ? 'paid' : status })
      .eq('id', consultationId);
    
    if (error) {
      console.error("Error updating consultation status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating consultation status:", error);
    return false;
  }
}
