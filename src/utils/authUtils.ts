import { supabase } from "@/integrations/supabase/client";

export const checkAuthentication = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const getUserProfile = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return {
    ...profile,
    email: userData.user.email
  };
};

export const updateUserProfile = async (updates: { full_name?: string; phone_number?: string }) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userData.user.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  
  return data;
};

// Admin authorization check
export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;
    
    // For now, we'll use a simple email-based check for admin status
    // This should be replaced with a proper role-based system in production
    const adminEmails = ['admin@peace2hearts.com', 'founder@peace2hearts.com'];
    return adminEmails.includes(userData.user.email || '');
    
    // Alternative implementation using a roles table:
    /*
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No row found, user is not an admin
        return false;
      }
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data;
    */
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Creates a storage bucket if it doesn't exist
 */
export const ensureStorageBucketExists = async () => {
  console.log("Ensuring storage bucket exists for consultant profile pictures");
  try {
    const { error } = await supabase.storage.getBucket('consultant_profile_pictures');
    
    if (error && error.message.includes('does not exist')) {
      console.log("Bucket does not exist, creating it");
      const { error: createError } = await supabase.storage.createBucket('consultant_profile_pictures', {
        public: true
      });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
        return false;
      }
      
      // Set public bucket policy
      const { error: policyError } = await supabase.storage.from('consultant_profile_pictures').getPublicUrl('test');
      if (policyError) {
        console.error("Error setting bucket policy:", policyError);
      }
      
      console.log("Bucket created successfully");
      return true;
    } else if (error) {
      console.error("Error checking bucket:", error);
      return false;
    }
    
    console.log("Bucket already exists");
    return true;
  } catch (error) {
    console.error("Error in ensureStorageBucketExists:", error);
    return false;
  }
};
