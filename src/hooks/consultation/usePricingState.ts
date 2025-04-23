
import { useState, useEffect } from 'react';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing';

export function usePricingState() {
  const [pricing, setPricing] = useState<Map<string, number>>(new Map());
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Load initial pricing data for all services
  useEffect(() => {
    const loadInitialPricing = async () => {
      try {
        const mentalHealthIds = [
          'mental-health-counselling', 
          'family-therapy', 
          'premarital-counselling-individual',
          'premarital-counselling-couple',
          'couples-counselling'
        ];
        
        const legalIds = [
          'pre-marriage-legal',
          'mediation',
          'divorce',
          'custody',
          'maintenance',
          'general-legal'
        ];
        
        const packageIds = [
          'divorce-prevention',
          'pre-marriage-clarity'
        ];
        
        const [mentalHealthPricing, legalPricing, packagePricing] = await Promise.all([
          fetchServicePricing(mentalHealthIds),
          fetchServicePricing(legalIds),
          fetchPackagePricing(packageIds)
        ]);
        
        const combinedPricing = new Map<string, number>();
        
        mentalHealthPricing.forEach((price, id) => combinedPricing.set(id, price));
        legalPricing.forEach((price, id) => combinedPricing.set(id, price));
        packagePricing.forEach((price, id) => combinedPricing.set(id, price));
        
        console.log("Initialized pricing data:", Object.fromEntries(combinedPricing));
        setPricing(combinedPricing);
      } catch (error) {
        console.error("Error initializing pricing data:", error);
      }
    };
    
    loadInitialPricing();
  }, []);

  return {
    pricing,
    totalPrice,
    setTotalPrice
  };
}
