
import { supabase } from "@/integrations/supabase/client";

export interface Consultant {
  id: string;
  name?: string;
  specialization: string;
  is_available: boolean;
  hourly_rate: number;
  profile_id: string;
  available_days?: string[] | null;
  available_hours?: string | null;
  bio?: string | null;
  qualifications?: string | null;
  profile_picture_url?: string | null;
}

export const getConsultants = async (specialization?: string): Promise<Consultant[]> => {
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
    
    return data || [];
  } catch (error) {
    console.error("Error in getConsultants:", error);
    throw error;
  }
};

export const createConsultant = async (
  consultantData: Omit<Consultant, 'id'> & { profile_picture: File | null }
): Promise<Consultant> => {
  try {
    let profile_picture_url = null;
    
    // Upload profile picture if provided
    if (consultantData.profile_picture) {
      const fileName = `${Date.now()}_${consultantData.profile_picture.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('consultant_images')
        .upload(fileName, consultantData.profile_picture);
      
      if (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        throw new Error("Unable to upload profile picture. Please try again later.");
      }
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('consultant_images')
        .getPublicUrl(fileName);
        
      profile_picture_url = urlData.publicUrl;
    }
    
    // Remove the File object before inserting into database
    const { profile_picture, ...dbConsultantData } = consultantData;
    
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
      throw new Error("Unable to create consultant. Please try again later.");
    }
    
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
  try {
    const { error } = await supabase
      .from('consultants')
      .update({ is_available: isAvailable })
      .eq('id', consultantId);
    
    if (error) {
      console.error("Error updating consultant availability:", error);
      throw new Error("Unable to update consultant availability. Please try again later.");
    }
  } catch (error) {
    console.error("Error in updateConsultantAvailability:", error);
    throw error;
  }
};

export const getConsultantById = async (consultantId: string): Promise<Consultant | null> => {
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
    
    return data;
  } catch (error) {
    console.error("Error in getConsultantById:", error);
    throw error;
  }
};
