
import { supabase } from '@/integrations/supabase/client';
import { checkAdminAuth } from '../core/adminAuth';
import { NewServiceFormValues, ServicePrice } from '../types';

/**
 * Update service price in database
 * @param id - Service ID
 * @param price - New price
 * @returns True if successful, throws error otherwise
 */
export async function updateServicePrice(id: string, price: number): Promise<boolean> {
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

/**
 * Toggle service active status in database
 * @param id - Service ID
 * @param currentStatus - Current active status
 * @returns True if successful, throws error otherwise
 */
export async function toggleServiceActive(id: string, currentStatus: boolean): Promise<boolean> {
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

/**
 * Create a new service in database
 * @param serviceData - New service data
 * @returns True if successful, throws error otherwise
 */
export async function createService(serviceData: NewServiceFormValues): Promise<boolean> {
  console.log(`Creating new service:`, serviceData);
  
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      throw new Error("Authentication required to create services.");
    }
    
    // Format service_id based on category if not provided
    if (!serviceData.service_id && serviceData.service_name && serviceData.category) {
      // Create a service ID formatted like P2H-MH-service-name or P2H-L-service-name
      const prefix = serviceData.category === 'mental-health' ? 'P2H-MH-' : 
                    serviceData.category === 'legal' ? 'P2H-L-' : 
                    serviceData.category === 'holistic' ? 'P2H-H-' : 'P2H-';
      
      // Create a slug from the service name
      const slug = serviceData.service_name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      serviceData.service_id = `${prefix}${slug}`;
    }

    // Add required fields to ensure type compatibility
    const serviceToInsert = {
      ...serviceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      type: serviceData.type || 'service',
      currency: serviceData.currency || 'INR',
      is_active: serviceData.is_active !== undefined ? serviceData.is_active : true,
      scenario: 'regular' // Add scenario since it's required
    };

    const { error } = await supabase
      .from('service_pricing')
      .insert([serviceToInsert]);
    
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

/**
 * Remove a service from database
 * @param id - Service ID
 * @returns True if successful, throws error otherwise
 */
export async function removeService(id: string): Promise<boolean> {
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

/**
 * Fetch all service pricing data
 * @returns Array of service pricing data
 */
export async function fetchAllServices(): Promise<ServicePrice[]> {
  try {
    const { data, error } = await supabase
      .from('service_pricing')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    // Ensure the returned data conforms to ServicePrice type
    const typedData: ServicePrice[] = data.map(item => ({
      ...item,
      type: item.type as 'service' | 'package', // Ensure the type is correctly cast
      scenario: item.scenario || 'regular', // Ensure scenario exists
    }));
    
    return typedData;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
}

/**
 * Add initial services to database if none exist
 */
export async function addInitialServices(): Promise<boolean> {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      throw new Error("Authentication required to add initial services.");
    }
    
    // Check if services already exist
    const { data, error } = await supabase
      .from('service_pricing')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('Error checking for existing services:', error);
      throw error;
    }
    
    // If services exist, don't add initial services
    if (data && data.length > 0) {
      return false;
    }
    
    // Add initial services with all required fields
    const initialServices = [
      {
        service_id: 'P2H-MH-mental-health-counselling',
        service_name: 'Mental Health Counselling',
        price: 1500,
        category: 'mental-health',
        type: 'service' as const,
        is_active: true,
        currency: 'INR',
        scenario: 'regular',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        service_id: 'P2H-MH-family-therapy',
        service_name: 'Family Therapy',
        price: 2000,
        category: 'mental-health',
        type: 'service' as const,
        is_active: true,
        currency: 'INR',
        scenario: 'regular',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        service_id: 'P2H-L-general-legal-consultation',
        service_name: 'General Legal Consultation',
        price: 2500,
        category: 'legal',
        type: 'service' as const,
        is_active: true,
        currency: 'INR',
        scenario: 'regular',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    ];
    
    const { error: insertError } = await supabase
      .from('service_pricing')
      .insert(initialServices);
      
    if (insertError) {
      console.error('Error adding initial services:', insertError);
      throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to add initial services:', error);
    throw error;
  }
}
