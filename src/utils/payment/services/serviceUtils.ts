
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
    // First check if consultationId is a UUID or a reference_id
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(consultationId);
    
    const { error } = await supabase
      .from('consultations')
      .update({ status: status === 'completed' ? 'paid' : status })
      .eq(isUuid ? 'id' : 'reference_id', consultationId);
    
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

/**
 * Get consultation data by reference ID
 */
export async function getConsultationByReferenceId(referenceId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("Error fetching consultation:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception fetching consultation:", error);
    return null;
  }
}
