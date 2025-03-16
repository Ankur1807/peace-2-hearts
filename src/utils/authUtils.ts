
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
