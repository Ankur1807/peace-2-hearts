
import { supabase } from "@/integrations/supabase/client";

/**
 * Update consultation status in the database
 */
export async function updateConsultationStatus(
  referenceId: string, 
  status: string,
  additionalData: Record<string, any> = {}
): Promise<boolean> {
  try {
    console.log(`Updating consultation status for ${referenceId} to ${status}`);
    
    const { data, error } = await supabase
      .from('consultations')
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...additionalData
      })
      .eq('reference_id', referenceId);
      
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
 * Determine service category from consultation type
 */
export function determineServiceCategory(consultationType: string): string {
  consultationType = consultationType.toLowerCase();
  
  // Legal services
  if (consultationType.includes('legal') || 
      consultationType.includes('lawyer') || 
      consultationType.includes('divorce') || 
      consultationType.includes('custody')) {
    return 'legal';
  }
  
  // Mental health services
  if (consultationType.includes('therapy') || 
      consultationType.includes('counseling') || 
      consultationType.includes('mental') || 
      consultationType.includes('psychological')) {
    return 'mental-health';
  }
  
  // Holistic packages
  if (consultationType.includes('package') || 
      consultationType.includes('holistic') || 
      consultationType.includes('prevention') || 
      consultationType.includes('clarity')) {
    return 'holistic';
  }
  
  // Default
  return 'service';
}
