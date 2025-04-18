
import { supabase } from '@/integrations/supabase/client';
import { ServicePrice } from '@/utils/pricingTypes';

/**
 * Fetches all services from the database
 * @returns Array of service pricing data
 */
export const fetchAllServices = async () => {
  console.log('Fetching all services');
  try {
    // Add a cache-busting timestamp parameter
    const timestamp = new Date().getTime();
    
    const { data, error } = await supabase
      .from('service_pricing')
      .select('*')
      .order('category', { ascending: true })
      .order('service_name', { ascending: true })
      .returns<ServicePrice[]>();

    if (error) {
      console.error('Error fetching all services:', error);
      throw error;
    }
    
    // Log the data for debugging
    console.log(`Retrieved ${data?.length || 0} services from database`);
    console.log('Sample data:', data?.[0]);
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchAllServices:', error);
    throw error;
  }
};

/**
 * Fetches service by ID
 * @param id - The service ID to fetch
 * @returns The service data
 */
export const fetchServiceById = async (id: string) => {
  console.log(`Fetching service with ID: ${id}`);
  try {
    // Add a cache-busting timestamp parameter
    const timestamp = new Date().getTime();
    
    const { data, error } = await supabase
      .from('service_pricing')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching service by ID:', error);
      throw error;
    }
    
    console.log('Retrieved service:', data);
    return data as ServicePrice;
  } catch (error) {
    console.error('Error in fetchServiceById:', error);
    throw error;
  }
};
