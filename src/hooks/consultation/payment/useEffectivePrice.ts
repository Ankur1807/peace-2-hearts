
import { useMemo } from 'react';
import { getPackageName } from '@/utils/consultation/packageUtils';
import { getFallbackPrice } from '@/utils/pricing/fallbackPrices';

// Map from legacy client IDs to Supabase-aligned IDs
const legacyToSupabaseIdMap: Record<string, string> = {
  'divorce-prevention': 'P2H-H-divorce-prevention-package',
  'pre-marriage-clarity': 'P2H-H-pre-marriage-clarity-solutions',
  'mental-health-counselling': 'P2H-MH-mental-health-counselling',
  'family-therapy': 'P2H-MH-family-therapy',
  'couples-counselling': 'P2H-MH-couples-counselling',
  'sexual-health-counselling': 'P2H-MH-sexual-health-counselling',
  'test-service': 'P2H-MH-test-service',
  'mediation': 'P2H-L-mediation-services',
  'divorce': 'P2H-L-divorce-consultation',
  'custody': 'P2H-L-child-custody-consultation',
  'maintenance': 'P2H-L-maintenance-consultation',
  'general-legal': 'P2H-L-general-legal-consultation'
};

// Package names to their Supabase IDs
const packageNameToSupabaseId: Record<string, string> = {
  "Divorce Prevention Package": 'P2H-H-divorce-prevention-package',
  "Pre-Marriage Clarity Package": 'P2H-H-pre-marriage-clarity-solutions'
};

interface UseEffectivePriceProps {
  selectedServices: string[];
  pricing?: Map<string, number>;
  totalPrice?: number;
}

export function useEffectivePrice({ 
  selectedServices, 
  pricing, 
  totalPrice 
}: UseEffectivePriceProps) {
  return useMemo(() => {
    // If no services selected, return provided totalPrice or 0
    if (selectedServices.length === 0) {
      return totalPrice || 0;
    }

    // For packages
    const packageName = getPackageName(selectedServices);
    if (packageName) {
      const packageId = packageNameToSupabaseId[packageName];
      if (packageId) {
        // First try pricing map
        if (pricing && pricing.has(packageId)) {
          return pricing.get(packageId)!;
        }
        // Then try fallback price
        const fallbackPrice = getFallbackPrice(packageId);
        if (fallbackPrice !== undefined) {
          return fallbackPrice;
        }
      }
    }

    // For individual services
    const serviceId = selectedServices[0];
    if (serviceId) {
      // Normalize ID for lookup
      const resolvedId = legacyToSupabaseIdMap[serviceId] || serviceId;
      
      // First try pricing map
      if (pricing && pricing.has(resolvedId)) {
        return pricing.get(resolvedId)!;
      }
      // Then try fallback price
      const fallbackPrice = getFallbackPrice(resolvedId);
      if (fallbackPrice !== undefined) {
        return fallbackPrice;
      }
    }

    // Default to provided totalPrice or 0
    return totalPrice || 0;
  }, [selectedServices, pricing, totalPrice]);
}
