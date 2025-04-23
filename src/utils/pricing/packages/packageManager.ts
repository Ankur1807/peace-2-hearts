
import { supabase } from '@/integrations/supabase/client';
import { checkAdminAuth } from '../auth/adminAuthChecker';
import { expandClientToDbPackageIds } from '../serviceIdMapper';

export async function updatePackagePrice(id: string, price: number) {
  console.log(`Updating package price for ID ${id} to ${price}`);
  
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
      console.error('Error updating package price:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update package price:', error);
    throw error;
  }
}

export async function syncPackageIds(packageName: string, clientId: string, price: number) {
  console.log(`Syncing prices for all "${packageName}" packages to ${price}`);
  
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      throw new Error("Authentication required to update services.");
    }
    
    const expandedIds = expandClientToDbPackageIds([clientId]);
    if (expandedIds.length === 0) {
      console.error('No DB ID found for client ID:', clientId);
      return false;
    }
    
    const dbPackageId = expandedIds[0];
    
    // Update all packages with this name to have the same price
    const { error } = await supabase
      .from('service_pricing')
      .update({ 
        price,
        updated_at: new Date().toISOString() 
      })
      .ilike('service_name', `%${packageName}%`)
      .eq('type', 'package');
    
    if (error) {
      console.error('Error syncing package prices:', error);
      throw error;
    }
    
    const { error: idError } = await supabase
      .from('service_pricing')
      .update({ 
        price,
        updated_at: new Date().toISOString() 
      })
      .eq('service_id', dbPackageId)
      .eq('type', 'package');
    
    if (idError) {
      console.error('Error syncing package by ID:', idError);
      throw idError;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to sync package prices:', error);
    throw error;
  }
}
