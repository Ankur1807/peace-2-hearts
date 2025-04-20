
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Load pricing data when services change
  const updatePricing = useCallback(async (skipCache = false) => {
    if (selectedServices.length === 0) {
      setTotalPrice(0);
      setPricingError(null);
      return;
    }
    
    setIsLoading(true);
    setPricingError(null);
    console.log('Updating pricing for services:', selectedServices, 'in category:', serviceCategory);
    
    try {
      let pricingMap: Map<string, number> = new Map();
      
      if (serviceCategory === 'holistic') {
        // Check if it matches a pre-defined package
        const packageName = getPackageName(selectedServices);
        if (packageName === "Divorce Prevention Package") {
          console.log('Fetching Divorce Prevention Package pricing');
          pricingMap = await fetchPackagePricing(['divorce-prevention'], skipCache);
        } else if (packageName === "Pre-Marriage Clarity Package") {
          console.log('Fetching Pre-Marriage Clarity Package pricing');
          pricingMap = await fetchPackagePricing(['pre-marriage-clarity'], skipCache);
        } else {
          // If not a pre-defined package, get individual service prices
          console.log('Fetching individual service prices for holistic services');
          pricingMap = await fetchServicePricing(selectedServices);
        }
      } else {
        // For regular services, get individual prices
        console.log('Fetching individual service prices for category:', serviceCategory);
        pricingMap = await fetchServicePricing(selectedServices);
      }
      
      console.log('Pricing data retrieved:', Object.fromEntries(pricingMap));
      
      // Calculate total price
      let total = 0;
      if (serviceCategory === 'holistic') {
        const packageName = getPackageName(selectedServices);
        if (packageName === "Divorce Prevention Package") {
          total = pricingMap.get('divorce-prevention') || 0;
          console.log('Using Divorce Prevention Package price:', total);
        } else if (packageName === "Pre-Marriage Clarity Package") {
          total = pricingMap.get('pre-marriage-clarity') || 0;
          console.log('Using Pre-Marriage Clarity Package price:', total);
        } else {
          // Sum individual services
          console.log('Calculating total from individual services for holistic');
          selectedServices.forEach(serviceId => {
            const price = pricingMap.get(serviceId) || 0;
            total += price;
            console.log(`Adding ${price} for ${serviceId}`);
          });
        }
      } else {
        // Sum individual services
        console.log('Calculating total from individual services');
        selectedServices.forEach(serviceId => {
          const price = pricingMap.get(serviceId) || 0;
          total += price;
          console.log(`Adding ${price} for ${serviceId}`);
        });
      }
      
      console.log('Calculated total price:', total);
      setPricing(pricingMap);
      setTotalPrice(total);
      
      // If no prices found despite having valid services, try a direct fetch from database
      if (total === 0 && selectedServices.length > 0) {
        const errorMsg = 'No pricing information available for selected services';
        console.warn(errorMsg);
        
        // Try to fetch all service data for debugging
        try {
          const allServiceResp = await fetch('/api/debug/all-services');
          const allServices = await allServiceResp.json();
          console.log('Available services in database:', allServices);
        } catch (err) {
          console.error('Could not fetch debug service data:', err);
        }
        
        setPricingError(errorMsg);
      }
    } catch (error) {
      console.error("Error fetching pricing:", error);
      setPricingError("Failed to fetch pricing information");
      toast({ 
        title: "Error retrieving pricing information", 
        description: "Please try again later or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedServices, serviceCategory, toast]);
  
  useEffect(() => {
    updatePricing();
  }, [updatePricing]);
  
  return { 
    pricing, 
    totalPrice, 
    isLoading, 
    pricingError, 
    updatePricing: () => updatePricing(true) // Use the skip cache version when manually refreshing
  };
}
