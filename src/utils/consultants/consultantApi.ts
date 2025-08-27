import { supabase } from "@/integrations/supabase/client";
import { Consultant, CreateConsultantData, ConsultantPublic } from "./types";
import { upsertConsultantProfile } from "./profileManager";
import { uploadProfilePicture } from "./storageBucket";

/**
 * Fetches consultants with optional specialization filter
 */
export const getConsultants = async (specialization?: string): Promise<ConsultantPublic[]> => {
  console.log("getConsultants called with specialization:", specialization);
  try {
    let query = supabase
      .from('consultants_public')
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

/**
 * Creates a new consultant
 */
export const createConsultant = async (
  consultantData: CreateConsultantData
): Promise<Consultant> => {
  console.log("createConsultant called with data:", { 
    ...consultantData, 
    profile_picture: consultantData.profile_picture ? 
      `${consultantData.profile_picture.name} (${consultantData.profile_picture.size} bytes)` : null 
  });
  
  try {
    // First create the consultant_profile record
    const { data: newProfile, error: profileError } = await supabase
      .from('consultant_profiles')
      .insert({
        full_name: consultantData.name
      })
      .select();
    
    if (profileError) {
      console.error("Error creating consultant profile:", profileError);
      throw new Error("Failed to create consultant profile");
    }
    
    const profileId = newProfile[0].id;
    console.log("Created profile with ID:", profileId);
    
    let profile_picture_url = null;
    
    // Upload profile picture if provided
    if (consultantData.profile_picture) {
      profile_picture_url = await uploadProfilePicture(profileId, consultantData.profile_picture);
    }
    
    // Remove the File object before inserting into database
    const { profile_picture, ...dbConsultantData } = consultantData;
    
    // Always use the profileId we created above
    dbConsultantData.profile_id = profileId;
    
    // Log the data being sent to the database
    console.log("Inserting consultant data:", { ...dbConsultantData, profile_picture_url });
    
    // Create a new consultant record
    const { data, error } = await supabase
      .from('consultants')
      .insert({
        ...dbConsultantData,
        profile_picture_url
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

/**
 * Updates the availability status of a consultant
 */
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

/**
 * Retrieves a consultant by ID
 */
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

/**
 * Deletes a consultant and their associated profile
 */
export const deleteConsultant = async (consultantId: string): Promise<void> => {
  console.log("deleteConsultant called with ID:", consultantId);
  try {
    // First delete the consultant record
    const { error: consultantError } = await supabase
      .from('consultants')
      .delete()
      .eq('id', consultantId);
    
    if (consultantError) {
      console.error("Error deleting consultant:", consultantError);
      throw new Error("Unable to delete consultant. Please try again later.");
    }
    
    console.log("Consultant deleted successfully");
  } catch (error) {
    console.error("Error in deleteConsultant:", error);
    throw error;
  }
};
