
import { useEffect, useState, useCallback } from 'react';
import { getPackageName } from './consultationHelpers';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing/fetchPricing';

interface UseConsultationPricingProps {
  selectedServices: string[];
  serviceCategory: string;
}

export function useConsultationPricing({ selectedServices, serviceCategory }: UseConsultationPricingProps) {
  const [pricing, setPricing] = useState<Map<string, number>>(new Map());
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  // Load pricing data when services change
  const updatePricing = useCallback(async () => {
    if (selectedServices.length === 0) {
      setTotalPrice(0);
      return;
    }
    
    try {
      let pricingMap: Map<string, number>;
      
      if (serviceCategory === 'holistic') {
        // Check if it matches a pre-defined package
        const packageName = getPackageName(selectedServices);
        if (packageName === "Divorce Prevention Package") {
          pricingMap = await fetchPackagePricing(['divorce-prevention']);
        } else if (packageName === "Pre-Marriage Clarity Package") {
          pricingMap = await fetchPackagePricing(['pre-marriage-clarity']);
        } else {
          // If not a pre-defined package, get individual service prices
          pricingMap = await fetchServicePricing(selectedServices);
        }
      } else {
        // For regular services, get individual prices
        pricingMap = await fetchServicePricing(selectedServices);
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
      
      setPricing(pricingMap);
      setTotalPrice(total);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    }
  }, [selectedServices, serviceCategory]);
  
  useEffect(() => {
    updatePricing();
  }, [updatePricing]);
  
  return { pricing, totalPrice };
}
