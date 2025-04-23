
import { supabase } from '@/integrations/supabase/client';
import { ServicePrice } from '../types';
import { checkAdminAuth } from './adminAuth';

// Cache management for pricing data
const pricingCache: Map<string, Map<string, number>> = new Map();

/**
 * Clear all cached pricing data
 */
export function clearPricingCache(): void {
  pricingCache.clear();
  console.log('Pricing cache cleared');
}

/**
 * Get pricing data from cache
 * @param key - Cache key
 * @returns Cached pricing data if available
 */
export function getPricingCache(key: string): Map<string, number> | undefined {
  return pricingCache.get(key);
}

/**
 * Set pricing data in cache
 * @param key - Cache key
 * @param data - Pricing data to cache
 */
export function setPricingCache(key: string, data: Map<string, number>): void {
  pricingCache.set(key, data);
}

/**
 * Format a price value with currency
 * @param price - Price value to format
 * @param currency - Currency code (default: INR)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Transform raw service pricing data into a price map
 * @param data - Raw service pricing data
 * @param requestedIds - Requested service IDs
 * @returns Price map
 */
export function mapServicePricing(
  data: any[],
  requestedIds: string[] = []
): Map<string, number> {
  const pricingMap = new Map<string, number>();
  
  // Process service data from database
  data.forEach((item) => {
    if (item.service_id && item.price) {
      const serviceId = item.service_id.trim();
      // Map database IDs to client IDs if needed
      const clientId = mapDbIdToClientId(serviceId);
      pricingMap.set(clientId, item.price);
    }
  });

  // Handle special case for test service
  if (requestedIds.includes('test-service') && !pricingMap.has('test-service')) {
    pricingMap.set('test-service', 11);
  }

  return pricingMap;
}

/**
 * Transform raw package pricing data into a price map
 * @param data - Raw package pricing data
 * @param requestedIds - Requested package IDs
 * @returns Price map
 */
export function mapPackagePricing(
  data: any[],
  requestedIds: string[] = []
): Map<string, number> {
  const pricingMap = new Map<string, number>();
  
  data.forEach((item) => {
    if (item.service_id || item.package_id) {
      let packageId = item.service_id || item.package_id;
      
      // Map to simpler package IDs
      if (packageId.includes('divorce-prevention')) {
        packageId = 'divorce-prevention';
      } else if (packageId.includes('pre-marriage-clarity')) {
        packageId = 'pre-marriage-clarity';
      }
      
      pricingMap.set(packageId, item.price);
    }
  });
  
  return pricingMap;
}

// Helper function to map DB IDs to client IDs
function mapDbIdToClientId(dbId: string): string {
  // Define mapping for known IDs
  const dbToClientIdMap: Record<string, string> = {
    'Mental-Health-Counselling': 'mental-health-counselling',
    'P2H-MH-mental-health-counselling': 'mental-health-counselling',
    'Family-Therapy': 'family-therapy',
    'P2H-MH-family-therapy': 'family-therapy',
    'Premarital-Counselling': 'premarital-counselling-individual',
    'P2H-MH-premarital-counselling-individual': 'premarital-counselling-individual',
    'Couples-Counselling': 'couples-counselling',
    'P2H-MH-couples-counselling': 'couples-counselling',
    'Pre-Marriage-Legal-Consultation': 'pre-marriage-legal',
    'P2H-L-pre-marriage-legal-consultation': 'pre-marriage-legal',
    'Divorce-Consultation': 'divorce',
    'P2H-L-divorce-consultation': 'divorce',
    'Child-Custody-Consultation': 'custody',
    'P2H-L-child-custody-consultation': 'custody',
    'Mediation-Services': 'mediation',
    'P2H-L-mediation-services': 'mediation',
    'Maintenance-Consultation': 'maintenance',
    'P2H-L-maintenance-consultation': 'maintenance',
    'General-Legal-Consultation': 'general-legal',
    'P2H-L-general-legal-consultation': 'general-legal'
  };

  return dbToClientIdMap[dbId] || dbId;
}

/**
 * Query the database for service pricing data
 * @param serviceIds - Service IDs to query
 * @returns Service pricing data
 */
export async function fetchServicePricingData(serviceIds?: string[]) {
  console.log('Fetching service pricing data for:', serviceIds);
  
  // Expand the requested IDs to include database matches
  const expandedIds = serviceIds ? expandClientToDbIds(serviceIds) : [];
  
  let query = supabase
    .from('service_pricing')
    .select('service_id, price, is_active')
    .eq('type', 'service');
  
  // Apply service_id filter if provided
  if (expandedIds.length > 0) {
    query = query.in('service_id', expandedIds);
  }
  
  // Only fetch active services
  query = query.eq('is_active', true);
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching service pricing data:', error);
    throw error;
  }
  
  console.log('Retrieved service pricing data:', data);
  return data || [];
}

/**
 * Query the database for package pricing data
 * @param packageIds - Package IDs to query
 * @returns Package pricing data
 */
export async function fetchPackagePricingData(packageIds?: string[]) {
  console.log('Fetching package pricing from DB for:', packageIds);
  
  if (!packageIds || packageIds.length === 0) {
    return [];
  }
  
  // Expand client IDs to database IDs
  const expandedIds = expandClientToDbPackageIds(packageIds);
  
  const { data, error } = await supabase
    .from('service_pricing')
    .select('service_id, price, is_active, description')
    .eq('type', 'package')
    .in('service_id', expandedIds)
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching package pricing:', error);
    throw error;
  }
  
  console.log('Retrieved package pricing data:', data);
  return data || [];
}

/**
 * Expand client IDs to database IDs for services
 */
export function expandClientToDbIds(clientIds: string[]): string[] {
  // Define mapping from client IDs to DB IDs
  const clientToDbMap: Record<string, string[]> = {
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
  
  // Expand client IDs to DB IDs
  const expandedIds: string[] = [];
  clientIds.forEach(id => {
    if (clientToDbMap[id]) {
      expandedIds.push(...clientToDbMap[id]);
    } else {
      expandedIds.push(id);
    }
  });
  
  return expandedIds;
}

/**
 * Expand client IDs to database IDs for packages
 */
export function expandClientToDbPackageIds(packageIds: string[]): string[] {
  // Define mapping from client package IDs to DB package IDs
  const packageToDbMap: Record<string, string[]> = {
    'divorce-prevention': ['P2H-H-divorce-prevention-package'],
    'pre-marriage-clarity': ['P2H-H-pre-marriage-clarity-solutions']
  };
  
  // Expand client package IDs to DB package IDs
  const expandedIds: string[] = [];
  packageIds.forEach(id => {
    if (packageToDbMap[id]) {
      expandedIds.push(...packageToDbMap[id]);
    } else {
      expandedIds.push(id);
    }
  });
  
  return expandedIds;
}
