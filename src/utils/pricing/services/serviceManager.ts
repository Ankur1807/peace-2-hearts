
import { supabase } from '@/integrations/supabase/client';
import { checkAdminAuth } from '../auth/adminAuthChecker';
import { ServicePrice } from '@/utils/pricingTypes';

export async function createService(serviceData: any) {
  console.log(`Creating new service:`, serviceData);
  
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      throw new Error("Authentication required to create services.");
    }
    
    // Format service_id based on category if not provided
    if (!serviceData.service_id && serviceData.service_name && serviceData.category) {
      const prefix = serviceData.category === 'mental-health' ? 'P2H-MH-' : 
                    serviceData.category === 'legal' ? 'P2H-L-' : 
                    serviceData.category === 'holistic' ? 'P2H-H-' : 'P2H-';
      
      const slug = serviceData.service_name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      serviceData.service_id = `${prefix}${slug}`;
    }

    const { error } = await supabase
      .from('service_pricing')
      .insert([{
        ...serviceData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        type: serviceData.type || 'service',
        currency: serviceData.currency || 'INR',
        is_active: serviceData.is_active !== undefined ? serviceData.is_active : true,
      }]);
    
    if (error) {
      console.error('Error creating service:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to create service:', error);
    throw error;
  }
}

export async function removeService(id: string) {
  console.log(`Removing service with ID ${id}`);
  
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      throw new Error("Authentication required to delete services.");
    }
    
    const { error } = await supabase
      .from('service_pricing')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error removing service:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to remove service:', error);
    throw error;
  }
}

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
