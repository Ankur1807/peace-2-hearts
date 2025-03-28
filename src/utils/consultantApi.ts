
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
    // First check if we need to create a consultant_profile
    let profileId = consultantData.profile_id;
    
    // If no valid profile_id was provided, generate a new one
    if (!profileId || profileId === "00000000-0000-0000-0000-000000000000") {
      profileId = crypto.randomUUID();
      console.log("Generated new profile_id:", profileId);
    }
    
    // First ensure the consultant_profile exists
    console.log("Creating or checking consultant profile with ID:", profileId);
    const { data: existingProfile } = await supabase
      .from('consultant_profiles')
      .select('id')
      .eq('id', profileId)
      .single();
      
    if (!existingProfile) {
      // Create the profile if it doesn't exist
      const { error: insertProfileError } = await supabase
        .from('consultant_profiles')
        .insert({
          id: profileId,
          full_name: consultantData.name || 'Unnamed Consultant'
        });
        
      if (insertProfileError) {
        console.error("Error creating consultant profile:", insertProfileError);
        throw new Error(`Unable to create consultant profile: ${insertProfileError.message}`);
      }
      
      console.log("Consultant profile created successfully with ID:", profileId);
    } else {
      console.log("Consultant profile already exists with ID:", profileId);
    }
    
    let profile_picture_url = null;
    
    // Upload profile picture if provided
    if (consultantData.profile_picture) {
      const file = consultantData.profile_picture;
      const fileExt = file.name.split('.').pop();
      const fileName = `${profileId}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log("Uploading profile picture:", filePath);
      
      // Ensure the storage bucket exists
      try {
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('consultant_profile_pictures');
        
        if (bucketError && bucketError.message.includes('does not exist')) {
          console.log("Bucket does not exist, creating it");
          const { error: createBucketError } = await supabase.storage.createBucket('consultant_profile_pictures', {
            public: true
          });
          
          if (createBucketError) {
            console.error("Error creating bucket:", createBucketError);
            // Continue without the profile picture
          } else {
            console.log("Bucket created successfully");
          }
        }
      } catch (bucketError) {
        console.error("Error checking/creating bucket:", bucketError);
        // Continue without the profile picture
      }
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('consultant_profile_pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        // Continue with consultant creation even if image upload fails
      } else {
        console.log("Profile picture uploaded successfully:", uploadData);
        
        // Get the public URL for the uploaded file
        const { data: publicUrlData } = supabase.storage
          .from('consultant_profile_pictures')
          .getPublicUrl(filePath);
        
        profile_picture_url = publicUrlData.publicUrl;
        console.log("Profile picture public URL:", profile_picture_url);
      }
    }
    
    // Remove the File object before inserting into database
    const { profile_picture, ...dbConsultantData } = consultantData;
    
    // Make sure to use the confirmed profileId
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
