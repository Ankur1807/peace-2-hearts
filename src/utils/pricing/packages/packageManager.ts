
import { supabase } from '@/integrations/supabase/client';
import { checkAdminAuth } from '../core/adminAuth';

/**
 * Update package price in database
 * @param id - Package ID
 * @param price - New price
 * @returns True if successful, throws error otherwise
 */
export async function updatePackagePrice(id: string, price: number): Promise<boolean> {
  console.log(`Updating package price for ID ${id} to ${price}`);
  
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      throw new Error("Authentication required to update packages.");
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

/**
 * Sync all package IDs with the same name to have the same price
 * @param packageName - Package name
 * @param clientId - Client package ID
 * @param price - New price
 * @returns True if successful, throws error otherwise
 */
export async function syncPackageIds(packageName: string, clientId: string, price: number): Promise<boolean> {
  console.log(`Syncing prices for all "${packageName}" packages to ${price}`);
  
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      throw new Error("Authentication required to update packages.");
    }
    
    // Get DB package ID from client ID
    let dbPackageId: string;
    if (clientId === 'divorce-prevention') {
      dbPackageId = 'P2H-H-divorce-prevention-package';
    } else if (clientId === 'pre-marriage-clarity') {
      dbPackageId = 'P2H-H-pre-marriage-clarity-solutions';
    } else {
      dbPackageId = clientId;
    }
    
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

/**
 * Calculate package price based on component services
 * @param packageId - Package ID
 * @returns Calculated package price or 0 if not available
 */
export async function calculatePackagePrice(packageId: string): Promise<number> {
  console.log(`Calculating price for package: ${packageId}`);
  
  let serviceIds: string[] = [];
  
  if (packageId === 'divorce-prevention') {
    serviceIds = ['couples-counselling', 'mental-health-counselling', 'mediation', 'general-legal'];
  } else if (packageId === 'pre-marriage-clarity') {
    serviceIds = ['pre-marriage-legal', 'premarital-counselling-individual', 'mental-health-counselling'];
  } else {
    return 0;
  }
  
  try {
    // First try to get direct package price from database
    const packageDbId = packageId === 'divorce-prevention' 
      ? 'P2H-H-divorce-prevention-package' 
      : 'P2H-H-pre-marriage-clarity-solutions';
    
    // Query the database for the package directly
    const { data: packageData, error: packageError } = await supabase
      .from('service_pricing')
      .select('price')
      .eq('type', 'package')
      .ilike('service_id', `%${packageDbId}%`)
      .eq('is_active', true)
      .single();
    
    if (packageData && packageData.price) {
      console.log(`Found direct package price in database for ${packageId}: ${packageData.price}`);
      return packageData.price;
    }
    
    // If package not found directly, calculate from component services
    console.log('Package not found directly, calculating from component services');
    
    // Expand client IDs to database IDs
    const clientToDbServiceIdMap: Record<string, string[]> = {
      'mental-health-counselling': ['Mental-Health-Counselling', 'P2H-MH-mental-health-counselling'],
      'family-therapy': ['Family-Therapy', 'P2H-MH-family-therapy'],
      'premarital-counselling-individual': ['Premarital-Counselling', 'P2H-MH-premarital-counselling-individual'],
      'couples-counselling': ['Couples-Counselling', 'P2H-MH-couples-counselling'],
      'pre-marriage-legal': ['Pre-Marriage-Legal-Consultation', 'P2H-L-pre-marriage-legal-consultation'],
      'divorce': ['Divorce-Consultation', 'P2H-L-divorce-consultation'],
      'custody': ['Child-Custody-Consultation', 'P2H-L-child-custody-consultation'],
      'mediation': ['Mediation-Services', 'P2H-L-mediation-services'],
      'maintenance': ['Maintenance-Consultation', 'P2H-L-maintenance-consultation'],
      'general-legal': ['General-Legal-Consultation', 'P2H-L-general-legal-consultation']
    };
    
    // Create expanded service IDs array
    const expandedServiceIds: string[] = [];
    serviceIds.forEach(id => {
      if (clientToDbServiceIdMap[id]) {
        expandedServiceIds.push(...clientToDbServiceIdMap[id]);
      } else {
        expandedServiceIds.push(id);
      }
    });
    
    // Fetch prices for component services
    const { data: servicesData, error } = await supabase
      .from('service_pricing')
      .select('service_id, price')
      .in('service_id', expandedServiceIds)
      .eq('type', 'service')
      .eq('is_active', true);
      
    if (error) {
      console.error('Error fetching service pricing data for package:', error);
      throw error;
    }
    
    if (!servicesData || servicesData.length === 0) {
      console.log('No service pricing data found for package components');
      return 0;
    }
    
    // Create a map of service_id to price
    const servicesPriceMap = new Map<string, number>();
    const dbToClientServiceIdMap: Record<string, string> = {};
    
    // Create reverse mapping for db to client IDs
    Object.entries(clientToDbServiceIdMap).forEach(([clientId, dbIds]) => {
      dbIds.forEach(dbId => {
        dbToClientServiceIdMap[dbId] = clientId;
      });
    });
    
    // Populate the services price map
    servicesData.forEach((item) => {
      if (item.price && item.price > 0) {
        const clientId = dbToClientServiceIdMap[item.service_id.trim()] || item.service_id;
        servicesPriceMap.set(clientId, item.price);
      }
    });
    
    // Calculate package total
    let packageTotal = 0;
    let allServicesHavePrices = true;
    
    serviceIds.forEach(serviceId => {
      const servicePrice = servicesPriceMap.get(serviceId);
      if (servicePrice && servicePrice > 0) {
        packageTotal += servicePrice;
      } else {
        allServicesHavePrices = false;
      }
    });
    
    // Apply package discount if all services have prices
    if (packageTotal > 0 && allServicesHavePrices) {
      packageTotal = Math.round(packageTotal * 0.85); // 15% discount
    }
    
    return packageTotal;
  } catch (error) {
    console.error('Error calculating package price:', error);
    return 0;
  }
}
