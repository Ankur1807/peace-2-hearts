
import { supabase } from '@/integrations/supabase/client';

export async function checkAdminPermission() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session found');
      return false;
    }
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error checking admin permission:', error);
      return false;
    }
    
    return !!data && data.role === 'admin';
  } catch (error) {
    console.error('Error in checkAdminPermission:', error);
    return false;
  }
}
