
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
    // Check if the bucket exists before trying to upload
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
    }
    
    console.log("Available buckets:", buckets);
    
    const bucketName = 'consultant_images';
    
    let bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log("Bucket does not exist, creating bucket:", bucketName);
      const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
        public: true
      });
      
      if (bucketError) {
        console.error("Error creating bucket:", bucketError);
        throw new Error(`Unable to create storage bucket: ${bucketError.message}`);
      }
      console.log("Bucket created successfully");
      bucketExists = true;
    } else {
      console.log("Bucket already exists:", bucketName);
    }
    
    let profile_picture_url = null;
    
    // Upload profile picture if provided and bucket exists
    if (consultantData.profile_picture && bucketExists) {
      const file = consultantData.profile_picture;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      console.log("Attempting to upload file:", fileName);
      
      // Upload the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);
      
      if (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        // Continue without image rather than failing completely
      } else if (uploadData) {
        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);
          
        profile_picture_url = urlData.publicUrl;
        console.log("File uploaded successfully. URL:", profile_picture_url);
      }
    }
    
    // Remove the File object before inserting into database
    const { profile_picture, ...dbConsultantData } = consultantData;
    
    // Generate a UUID for profile_id if not provided or is default
    if (!dbConsultantData.profile_id || dbConsultantData.profile_id === "00000000-0000-0000-0000-000000000000") {
      dbConsultantData.profile_id = crypto.randomUUID();
      console.log("Generated new profile_id:", dbConsultantData.profile_id);
    }
    
    // Log the data being sent to the database
    console.log("Inserting consultant data:", {
      ...dbConsultantData,
      profile_picture_url
    });
    
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
