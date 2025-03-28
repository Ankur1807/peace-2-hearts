
import { supabase } from "@/integrations/supabase/client";

export interface Consultant {
  id: string;
  specialization: string;
  is_available: boolean;
  hourly_rate: number;
  profile_id: string;
  available_days?: string[] | null;
  bio?: string | null;
  qualifications?: string | null;
  profile_picture_url?: string | null;
  name?: string | null;
  experience?: number | null;
}

export const getConsultants = async (specialization?: string): Promise<Consultant[]> => {
  console.log("getConsultants called with specialization:", specialization);
  try {
    let query = supabase
      .from('consultants')
      .select('*');
    
    if (specialization) {
      query = query.eq('specialization', specialization);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching consultants:", error);
      throw new Error("Unable to fetch consultants. Please try again later.");
    }
    
    console.log(`Retrieved ${data?.length || 0} consultants:`, data);
    return data || [];
  } catch (error) {
    console.error("Error in getConsultants:", error);
    throw error;
  }
};

export const createConsultant = async (
  consultantData: Omit<Consultant, 'id'> & { profile_picture: File | null }
): Promise<Consultant> => {
  console.log("createConsultant called with data:", { 
    ...consultantData, 
    profile_picture: consultantData.profile_picture ? 
      `${consultantData.profile_picture.name} (${consultantData.profile_picture.size} bytes)` : null 
  });
  
  try {
    // Remove the profile picture handling since we don't have bucket creation permissions
    // We'll skip the image upload for now
    
    // Generate a UUID for profile_id if not provided or is default
    if (!consultantData.profile_id || consultantData.profile_id === "00000000-0000-0000-0000-000000000000") {
      consultantData.profile_id = crypto.randomUUID();
      console.log("Generated new profile_id:", consultantData.profile_id);
    }
    
    // Remove the File object before inserting into database
    const { profile_picture, ...dbConsultantData } = consultantData;
    
    // Log the data being sent to the database
    console.log("Inserting consultant data:", dbConsultantData);
    
    // Create a new consultant record
    const { data, error } = await supabase
      .from('consultants')
      .insert({
        ...dbConsultantData,
        profile_picture_url: null // Set to null since we're not uploading images for now
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating consultant:", error);
      throw new Error(`Unable to create consultant: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("No data returned from consultant creation");
    }
    
    console.log("Consultant created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in createConsultant:", error);
    throw error;
  }
};

export const updateConsultantAvailability = async (
  consultantId: string, 
  isAvailable: boolean
): Promise<void> => {
  console.log("updateConsultantAvailability called with:", { consultantId, isAvailable });
  try {
    const { error } = await supabase
      .from('consultants')
      .update({ is_available: isAvailable })
      .eq('id', consultantId);
    
    if (error) {
      console.error("Error updating consultant availability:", error);
      throw new Error("Unable to update consultant availability. Please try again later.");
    }
    
    console.log("Consultant availability updated successfully");
  } catch (error) {
    console.error("Error in updateConsultantAvailability:", error);
    throw error;
  }
};

export const getConsultantById = async (consultantId: string): Promise<Consultant | null> => {
  console.log("getConsultantById called with ID:", consultantId);
  try {
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
      .eq('id', consultantId)
      .single();
    
    if (error) {
      console.error("Error fetching consultant:", error);
      throw new Error("Unable to fetch consultant details. Please try again later.");
    }
    
    console.log("Retrieved consultant:", data);
    return data;
  } catch (error) {
    console.error("Error in getConsultantById:", error);
    throw error;
  }
};
