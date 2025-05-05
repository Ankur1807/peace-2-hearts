
import { useState } from 'react';
import { fallbackPrices } from '@/utils/pricing/fallbackPrices';

export function usePricingState() {
  // Service selection
  const [serviceCategory, setServiceCategory] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Define mapping from client-side short IDs to Supabase service IDs
  const legacyIdMap: Record<string, string> = {
    'mental-health-counselling': 'P2H-MH-mental-health-counselling',
    'family-therapy': 'P2H-MH-family-therapy',
    'couples-counselling': 'P2H-MH-couples-counselling',
    'sexual-health-counselling': 'P2H-MH-sexual-health-counselling',
    'test-service': 'P2H-MH-test-service',
    'pre-marriage-legal': 'P2H-H-pre-marriage-clarity-solutions',
    'mediation': 'P2H-L-mediation-services',
    'divorce-consultation': 'P2H-L-divorce-consultation',
    'child-custody': 'P2H-L-child-custody-consultation',
    'maintenance': 'P2H-L-maintenance-consultation',
    'legal-general': 'P2H-L-general-legal-consultation',
    'divorce-prevention': 'P2H-H-divorce-prevention-package',
    'pre-marriage-clarity': 'P2H-H-pre-marriage-clarity-solutions',
  };
  
  // Pricing data - map from client IDs to prices from Supabase IDs
  const [pricing, setPricing] = useState<Map<string, number>>(
    new Map(
      Object.entries(legacyIdMap).map(([shortId, fullId]) => [
        shortId,
        fallbackPrices[fullId],
      ])
    )
  );
  
  // Total price
  const [totalPrice, setTotalPrice] = useState(0);

  return {
    serviceCategory,
    setServiceCategory,
    selectedServices,
    setSelectedServices,
    pricing,
    setPricing,
    totalPrice,
    setTotalPrice
  };
}
