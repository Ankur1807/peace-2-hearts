
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
    
    console.log('Service price updated:', data);
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
    
    console.log('Service active status toggled:', data);
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
        created_at: timestamp,
        updated_at: timestamp,
      }])
      .select();

    if (error) {
      console.error('Error creating service:', error);
      throw error;
    }
    
    console.log('New service created:', newService);
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
    
    console.log('Service removed:', data);
    return data;
  } catch (err) {
    console.error('Exception in removeService:', err);
    throw err;
  }
};
