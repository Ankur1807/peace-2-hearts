
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures the consultant_profile_pictures bucket exists
 */
export const ensureConsultantBucketExists = async (): Promise<boolean> => {
  console.log("Checking if storage bucket exists for consultant profile pictures");
  try {
    const { data, error } = await supabase.storage.getBucket('consultant_profile_pictures');
    
    if (error) {
      // Check if the error message indicates the bucket doesn't exist
      if (error.message?.includes('not found')) {
        console.log("Bucket does not exist, creating it");
        const { error: createError } = await supabase.storage.createBucket('consultant_profile_pictures', {
          public: true
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          return false;
        }
        
        // Set public bucket policy
        const { data } = supabase.storage.from('consultant_profile_pictures').getPublicUrl('test');
        console.log("Public URL test:", data);
        
        console.log("Bucket created successfully");
        return true;
      } else {
        console.error("Error checking bucket:", error);
        return false;
      }
    }
    
    console.log("Bucket already exists");
    return true;
  } catch (error) {
    console.error("Error in ensureConsultantBucketExists:", error);
    return false;
  }
};

/**
 * Uploads a profile picture to the storage bucket
 */
export const uploadProfilePicture = async (
  profileId: string,
  file: File
): Promise<string | null> => {
  try {
    // Ensure bucket exists
    await ensureConsultantBucketExists();
    
    // Format filename and upload
    const fileExt = file.name.split('.').pop();
    const fileName = `${profileId}.${fileExt}`;
    const filePath = `${fileName}`;
    
    console.log("Uploading profile picture:", filePath);
    
    const { error: uploadError } = await supabase.storage
      .from('consultant_profile_pictures')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error("Error uploading profile picture:", uploadError);
      return null;
    }
    
    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from('consultant_profile_pictures')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Error in uploadProfilePicture:", error);
    return null;
  }
};
