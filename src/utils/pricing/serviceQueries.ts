
import { supabase } from '@/integrations/supabase/client';
import { ServicePrice } from '@/utils/pricingTypes';

// Fetch all services from the database
export async function fetchAllServices(): Promise<ServicePrice[]> {
  try {
    console.log('Fetching all services from Supabase...');
    
    const { data, error } = await supabase
      .from('service_pricing')
      .select('*')
      .order('category', { ascending: true })
      .order('service_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    return data as ServicePrice[];
  } catch (error) {
    console.error('Exception fetching services:', error);
    throw error;
  }
}

// Fetch a specific service by ID
export async function fetchServiceById(id: string): Promise<ServicePrice | null> {
  try {
    const { data, error } = await supabase
      .from('service_pricing')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      throw error;
    }
    
    return data as ServicePrice;
  } catch (error) {
    console.error(`Exception fetching service with ID ${id}:`, error);
    throw error;
  }
}
