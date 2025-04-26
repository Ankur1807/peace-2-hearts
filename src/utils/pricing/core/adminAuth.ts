
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if the current user has admin authentication
 * @returns True if user has admin authentication, false otherwise
 */
export async function checkAdminAuth(): Promise<boolean> {
  // First check localStorage for direct admin authentication
  const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated') === 'true';
  const authTime = parseInt(localStorage.getItem('p2h_admin_auth_time') || '0', 10);
  const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
  
  if (adminAuthenticated && (Date.now() - authTime < sessionDuration)) {
    return true;
  }
  
  // Then check Supabase session
  const { data: sessionData } = await supabase.auth.getSession();
  return !!sessionData.session;
}
