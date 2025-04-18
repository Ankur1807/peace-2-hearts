
import { useState, useEffect } from 'react';
import { getPricingForPublicDisplay } from '@/utils/pricing/pricingService';

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
        
        // Get all ids we need for pricing
        const allIds = [...mentalHealthIds, ...legalIds, ...packageIds];
        
        // Fetch pricing data for all services at once
        const pricingData = await getPricingForPublicDisplay(allIds);
        
        console.log("Initialized pricing data:", Object.fromEntries(pricingData));
        setPricing(pricingData);
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
