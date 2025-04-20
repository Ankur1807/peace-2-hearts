
/**
 * This file consolidates all service operations into a single module.
 * It re-exports all service operations from their respective modules.
 */

import { fetchAllServices, fetchServiceById } from './serviceQueries';
import { 
  updateServicePrice, 
  toggleServiceActive, 
  createService, 
  removeService,
  updatePackagePrice,
  syncPackageIds
} from './serviceCommands';
import { fetchInitialServices, addInitialServices } from './serviceInitializer';
import { supabase } from '@/integrations/supabase/client';
import { expandClientToDbPackageIds } from './serviceIdMapper';

// Update package price in the service_pricing table
export async function updatePackagePrice(id: string, price: number) {
  console.log(`Updating package price for ID ${id} to ${price}`);
  
  try {
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

// Sync all package IDs with the same name
export async function syncPackageIds(packageName: string, clientId: string, price: number) {
  console.log(`Syncing prices for all "${packageName}" packages to ${price}`);
  
  try {
    // Get expanded DB ID from client ID
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
    
    // Also update any packages with the matching service_id
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

export {
  fetchAllServices,
  fetchServiceById,
  fetchInitialServices,
  updateServicePrice,
  toggleServiceActive,
  createService,
  removeService,
  addInitialServices
};
