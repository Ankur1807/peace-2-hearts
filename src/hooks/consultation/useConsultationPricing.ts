
import { useEffect, useState, useCallback } from 'react';
import { getPackageName } from './consultationHelpers';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing/fetchPricing';
import { useToast } from '@/hooks/use-toast';

interface UseConsultationPricingProps {
  selectedServices: string[];
  serviceCategory: string;
}

export function useConsultationPricing({ selectedServices, serviceCategory }: UseConsultationPricingProps) {
  const [pricing, setPricing] = useState<Map<string, number>>(new Map());
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { toast } = useToast();
  
  // Load pricing data when services change
  const updatePricing = useCallback(async () => {
    if (selectedServices.length === 0) {
      setTotalPrice(0);
      return;
    }
    
    try {
      let pricingMap: Map<string, number> = new Map();
      
      if (serviceCategory === 'holistic') {
        // Check if it matches a pre-defined package
        const packageName = getPackageName(selectedServices);
        if (packageName === "Divorce Prevention Package") {
          pricingMap = await fetchPackagePricing(['divorce-prevention']);
          console.log('Fetched divorce-prevention package price:', pricingMap);
        } else if (packageName === "Pre-Marriage Clarity Package") {
          pricingMap = await fetchPackagePricing(['pre-marriage-clarity']);
          console.log('Fetched pre-marriage-clarity package price:', pricingMap);
        } else {
          // If not a pre-defined package, get individual service prices
          pricingMap = await fetchServicePricing(selectedServices);
          console.log('Fetched individual service prices for holistic:', pricingMap);
        }
      } else {
        // For regular services, get individual prices
        pricingMap = await fetchServicePricing(selectedServices);
        console.log('Fetched individual service prices:', pricingMap);
      }
      
      // Calculate total price
      let total = 0;
      if (serviceCategory === 'holistic') {
        const packageName = getPackageName(selectedServices);
        if (packageName === "Divorce Prevention Package") {
          total = pricingMap.get('divorce-prevention') || 0;
        } else if (packageName === "Pre-Marriage Clarity Package") {
          total = pricingMap.get('pre-marriage-clarity') || 0;
        } else {
          // Sum individual services
          selectedServices.forEach(serviceId => {
            total += pricingMap.get(serviceId) || 0;
          });
        }
      } else {
        // Sum individual services
        selectedServices.forEach(serviceId => {
          total += pricingMap.get(serviceId) || 0;
        });
      }
      
      console.log('Calculated total price:', total);
      setPricing(pricingMap);
      setTotalPrice(total);
      
      // Show warning if no prices found
      if (total === 0 && selectedServices.length > 0) {
        console.warn('No pricing information available for selected services');
      }
    } catch (error) {
      console.error("Error fetching pricing:", error);
      toast({ 
        title: "Error retrieving pricing information", 
        description: "Using default pricing for now. Please try again later.",
        variant: "destructive"
      });
    }
  }, [selectedServices, serviceCategory, toast]);
  
  useEffect(() => {
    updatePricing();
  }, [updatePricing]);
  
  return { pricing, totalPrice, updatePricing };
}
