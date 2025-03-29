
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates or updates a consultant profile
 */
export const upsertConsultantProfile = async (
  profileId: string,
  name: string | null
): Promise<boolean> => {
  console.log("Creating/updating consultant profile with ID:", profileId);
  
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profileId,
        full_name: name || 'Unnamed Consultant'
      });
      
    if (error) {
      console.error("Error creating/updating consultant profile:", error);
      return false;
    }
    
    console.log("Consultant profile created/updated successfully with ID:", profileId);
    return true;
  } catch (error) {
    console.error("Error in upsertConsultantProfile:", error);
    return false;
  }
};
