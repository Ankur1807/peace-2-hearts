
import { supabase } from "@/integrations/supabase/client";

// Session duration constant (24 hours)
export const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000;

/**
 * Validates an API key against the admin-auth edge function
 */
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-auth', {
      body: { apiKey }
    });

    if (!error && data?.success) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("API key validation error:", error);
    return false;
  }
};

/**
 * Check if the user is an admin via Supabase
 */
export const checkSupabaseAdminStatus = async (): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;
    
    // Pre-approved admin emails list
    const adminEmails = [
      'admin@peace2hearts.com', 
      'founder@peace2hearts.com',
      'ankurb@peace2hearts.com'
    ];
    
    return adminEmails.includes(userData.user.email || '');
  } catch (error) {
    console.error('Error checking Supabase admin status:', error);
    return false;
  }
};

/**
 * Clear all admin authentication data from localStorage
 */
export const clearAdminAuthData = (): void => {
  localStorage.removeItem('admin_api_key');
  localStorage.removeItem('p2h_admin_authenticated');
  localStorage.removeItem('p2h_admin_auth_time');
};

/**
 * Set admin authentication data in localStorage
 */
export const setAdminAuthData = (apiKey?: string): void => {
  if (apiKey) {
    localStorage.setItem('admin_api_key', apiKey);
  }
  localStorage.setItem('p2h_admin_authenticated', 'true');
  localStorage.setItem('p2h_admin_auth_time', Date.now().toString());
};
