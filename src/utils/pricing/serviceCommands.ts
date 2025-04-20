
/**
 * This file consolidates all service operations into a single module.
 * It re-exports all service operations from their respective modules.
 */

import { supabase } from '@/integrations/supabase/client';
import { NewServiceFormValues } from '@/components/pricing/AddServiceForm';

/**
 * Updates a service price
 * @param id - The ID of the service to update
 * @param price - The new price
 * @returns The updated service data
 */
export const updateServicePrice = async (id: string, price: number) => {
  console.log(`Updating service price for ID ${id} to ${price}`);
  
  try {
    const timestamp = new Date().toISOString();
    const { data, error } = await supabase
      .from('service_pricing')
      .update({ 
        price, 
        updated_at: timestamp 
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating service price:', error);
      throw error;
    }
    
    console.log('Service price updated successfully:', data);
    
    // This extra delay helps ensure the update is processed by the database
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return data;
  } catch (err) {
    console.error('Exception in updateServicePrice:', err);
    throw err;
  }
};

/**
 * Toggles a service's active status
 * @param id - The ID of the service to toggle
 * @param currentStatus - The current active status
 * @returns The updated service data
 */
export const toggleServiceActive = async (id: string, currentStatus: boolean) => {
  console.log(`Toggling service active status for ID ${id} from ${currentStatus} to ${!currentStatus}`);
  
  try {
    const timestamp = new Date().toISOString();
    const { data, error } = await supabase
      .from('service_pricing')
      .update({ 
        is_active: !currentStatus, 
        updated_at: timestamp 
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error toggling service active status:', error);
      throw error;
    }
    
    console.log('Service active status toggled successfully:', data);
    
    // This extra delay helps ensure the update is processed by the database
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return data;
  } catch (err) {
    console.error('Exception in toggleServiceActive:', err);
    throw err;
  }
};

/**
 * Creates a new service
 * @param data - The service data to create
 * @returns The created service data
 */
export const createService = async (data: NewServiceFormValues) => {
  console.log('Creating new service:', data);
  
  try {
    const timestamp = new Date().toISOString();
    const { data: newService, error } = await supabase
      .from('service_pricing')
      .insert([{
        service_name: data.service_name,
        service_id: data.service_id,
        price: data.price,
        category: data.category,
        currency: 'INR',
        is_active: true,
        scenario: 'regular',
        type: 'service', // Set the type explicitly
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select();

    if (error) {
      console.error('Error creating service:', error);
      throw error;
    }
    
    console.log('New service created successfully:', newService);
    return newService;
  } catch (err) {
    console.error('Exception in createService:', err);
    throw err;
  }
};

/**
 * Removes a service
 * @param id - The ID of the service to remove
 * @returns The removed service data
 */
export const removeService = async (id: string) => {
  console.log(`Removing service with ID ${id}`);
  
  try {
    const { data, error } = await supabase
      .from('service_pricing')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error removing service:', error);
      throw error;
    }
    
    console.log('Service removed successfully:', data);
    return data;
  } catch (err) {
    console.error('Exception in removeService:', err);
    throw err;
  }
};

/**
 * Updates a package price
 * @param id - The ID of the package to update
 * @param price - The new price
 * @returns The updated package data
 */
export const updatePackagePrice = async (id: string, price: number) => {
  console.log(`Updating package price for ID ${id} to ${price}`);
  
  try {
    const timestamp = new Date().toISOString();
    const { data, error } = await supabase
      .from('service_pricing')
      .update({ 
        price, 
        updated_at: timestamp 
      })
      .eq('id', id)
      .eq('type', 'package')
      .select();

    if (error) {
      console.error('Error updating package price:', error);
      throw error;
    }
    
    console.log('Package price updated successfully:', data);
    
    // This extra delay helps ensure the update is processed by the database
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return data;
  } catch (err) {
    console.error('Exception in updatePackagePrice:', err);
    throw err;
  }
};

/**
 * Synchronizes package IDs to ensure consistency
 * @param packageName - The name of the package to synchronize
 * @param packageId - The ID to use for the package
 * @param price - The price to set for the package
 */
export const syncPackageIds = async (packageName: string, packageId: string, price: number) => {
  console.log(`Synchronizing package IDs for ${packageName} with ID ${packageId} and price ${price}`);
  
  try {
    // Find all entries with the given package name
    const { data: packageData, error: fetchError } = await supabase
      .from('service_pricing')
      .select('*')
      .eq('type', 'package')
      .ilike('service_name', packageName);
      
    if (fetchError) {
      console.error('Error fetching packages:', fetchError);
      throw fetchError;
    }
    
    console.log(`Found ${packageData?.length || 0} packages with name ${packageName}:`, packageData);
    
    if (packageData && packageData.length > 0) {
      // Update all matching packages to have the same ID and price
      for (const pkg of packageData) {
        const timestamp = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('service_pricing')
          .update({ 
            service_id: packageId,
            price: price,
            updated_at: timestamp 
          })
          .eq('id', pkg.id)
          .select();
          
        if (error) {
          console.error(`Error updating package ${pkg.id}:`, error);
        } else {
          console.log(`Updated package ${pkg.id}:`, data);
        }
      }
      
      console.log('Package synchronization complete');
    }
    
    return packageData;
  } catch (err) {
    console.error('Exception in syncPackageIds:', err);
    throw err;
  }
};

// Re-export service operations from other modules
export { fetchAllServices, fetchServiceById } from './serviceQueries';
export { fetchInitialServices, addInitialServices } from './serviceInitializer';
