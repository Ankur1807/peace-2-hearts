
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
    // Generate a new profile_id if one wasn't provided
    const profileId = consultantData.profile_id || crypto.randomUUID();
    console.log("Using profile_id:", profileId);
    
    // First ALWAYS create or update the consultant_profile record
    console.log("Creating consultant profile with ID:", profileId);
    const { error: profileError } = await supabase
      .from('consultant_profiles')
      .upsert({
        id: profileId,
        full_name: consultantData.name || 'Unnamed Consultant'
      });
      
    if (profileError) {
      console.error("Error creating consultant profile:", profileError);
      throw new Error(`Unable to create consultant profile: ${profileError.message}`);
    }
    
    console.log("Consultant profile created/updated successfully with ID:", profileId);
    
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
        console.log("Checking if storage bucket exists");
        const { error: bucketError } = await supabase.storage.getBucket('consultant_profile_pictures');
        
        if (bucketError) {
          console.log("Bucket error response:", bucketError);
          if (bucketError.message.includes('not found') || bucketError.status === 400) {
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
          } else {
            console.error("Unexpected error checking bucket:", bucketError);
          }
        } else {
          console.log("Bucket already exists");
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
        const publicUrlData = supabase.storage
          .from('consultant_profile_pictures')
          .getPublicUrl(filePath);
        
        profile_picture_url = publicUrlData.publicUrl;
        console.log("Profile picture public URL:", profile_picture_url);
      }
    }
    
    // Remove the File object before inserting into database
    const { profile_picture, ...dbConsultantData } = consultantData;
    
    // Always use the profileId we created or checked above
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
