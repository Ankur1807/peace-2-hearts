
import { supabase } from '@/integrations/supabase/client';
import { checkAdminAuth } from '../auth/adminAuthChecker';

export async function updateServicePrice(id: string, price: number) {
  console.log(`Updating service price for ID ${id} to ${price}`);
  
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      throw new Error("Authentication required to update services.");
    }
    
    const { error } = await supabase
      .from('service_pricing')
      .update({ 
        price, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating service price:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update service price:', error);
    throw error;
  }
}

export async function toggleServiceActive(id: string, currentStatus: boolean) {
  console.log(`Toggling service active status for ID ${id} from ${currentStatus} to ${!currentStatus}`);
  
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      throw new Error("Authentication required to update services.");
    }
    
    const { error } = await supabase
      .from('service_pricing')
      .update({ 
        is_active: !currentStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error toggling service active status:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to toggle service active status:', error);
    throw error;
  }
}
