
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
