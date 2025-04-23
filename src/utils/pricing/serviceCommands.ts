
/**
 * This file consolidates all service operations into a single module.
 * It provides functions for managing service pricing data.
 */

import { supabase } from '@/integrations/supabase/client';
import { expandClientToDbPackageIds } from './serviceIdMapper';

// Helper function to check admin authentication
const checkAdminAuth = async () => {
  // First check localStorage for direct admin authentication
  const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated') === 'true';
  const authTime = parseInt(localStorage.getItem('p2h_admin_auth_time') || '0', 10);
  const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
  
  if (adminAuthenticated && (Date.now() - authTime < sessionDuration)) {
    return true;
  }
  
  // Then check Supabase session
  const { data: sessionData } = await supabase.auth.getSession();
  return !!sessionData.session;
};

// Update package price in the service_pricing table
export async function updatePackagePrice(id: string, price: number) {
  console.log(`Updating package price for ID ${id} to ${price}`);
  
  try {
    // Check if user is authenticated
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

// Sync all package IDs with the same name
export async function syncPackageIds(packageName: string, clientId: string, price: number) {
  console.log(`Syncing prices for all "${packageName}" packages to ${price}`);
  
  try {
    // Check if user is authenticated
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      throw new Error("Authentication required to update services.");
    }
    
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

// Update service price
export async function updateServicePrice(id: string, price: number) {
  console.log(`Updating service price for ID ${id} to ${price}`);
  
  try {
    // Check if user is authenticated
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

// Toggle service active status
export async function toggleServiceActive(id: string, currentStatus: boolean) {
  console.log(`Toggling service active status for ID ${id} from ${currentStatus} to ${!currentStatus}`);
  
  try {
    // Check if user is authenticated
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

// Create a new service
export async function createService(serviceData: any) {
  console.log(`Creating new service:`, serviceData);
  
  try {
    // Check if user is authenticated
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

    // Add explicit auth headers to ensure the token is sent
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

// Remove a service
export async function removeService(id: string) {
  console.log(`Removing service with ID ${id}`);
  
  try {
    // Check if user is authenticated
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
