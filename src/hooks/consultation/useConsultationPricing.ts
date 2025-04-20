
import { useEffect, useState, useCallback, useRef } from 'react';
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
  
  // Use refs to track the previous values to prevent unnecessary updates
  const prevSelectedServices = useRef<string[]>([]);
  const prevServiceCategory = useRef<string>('');
  
  // Use a ref to track if we've already done the initial price fetch
  // This prevents infinite update loops
  const initialFetchDone = useRef(false);
  
  // Load pricing data when services change
  const updatePricing = useCallback(async (skipCache = false) => {
    // Check if there's any actual change in the services or category
    const servicesChanged = 
      selectedServices.length !== prevSelectedServices.current.length ||
      selectedServices.some(s => !prevSelectedServices.current.includes(s)) ||
      serviceCategory !== prevServiceCategory.current;
      
    if (!servicesChanged && initialFetchDone.current && !skipCache) {
      return;
    }
    
    // Update refs with current values
    prevSelectedServices.current = [...selectedServices];
    prevServiceCategory.current = serviceCategory;
    
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
      let packagePrice = 0;
      
      // Check if selected services match a package
      const packageName = getPackageName(selectedServices);
      const isPackage = packageName !== null;
      
      if (isPackage || serviceCategory === 'holistic') {
        // First try to fetch package pricing
        let packageId = '';
        
        if (packageName === "Divorce Prevention Package") {
          packageId = 'divorce-prevention';
        } else if (packageName === "Pre-Marriage Clarity Package") {
          packageId = 'pre-marriage-clarity';
        }
        
        if (packageId) {
          console.log(`Fetching ${packageName} pricing`);
          const packagePricingMap = await fetchPackagePricing([packageId], skipCache);
          packagePrice = packagePricingMap.get(packageId) || 0;
          
          if (packagePrice > 0) {
            console.log(`Found package price for ${packageId}: ${packagePrice}`);
          }
        }
      }
      
      // Always fetch individual service prices for display purposes
      console.log('Fetching individual service prices');
      pricingMap = await fetchServicePricing(selectedServices);
      
      console.log('Pricing data retrieved:', Object.fromEntries(pricingMap));
      
      // Calculate total price
      let total = 0;
      
      // If we have a package price, use it
      if (packagePrice > 0) {
        total = packagePrice;
        console.log(`Using package price: ${total}`);
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
      
      // If no prices found despite having valid services, show error
      if (total === 0 && selectedServices.length > 0) {
        const errorMsg = 'No pricing information available for selected services';
        console.warn(errorMsg);
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
      initialFetchDone.current = true;
    }
  }, [selectedServices, serviceCategory, toast]);
  
  useEffect(() => {
    // Only fetch if we have services 
    if (selectedServices.length > 0 || !initialFetchDone.current) {
      updatePricing();
    }
  }, [updatePricing]);
  
  return { 
    pricing, 
    totalPrice, 
    isLoading, 
    pricingError, 
    updatePricing: () => updatePricing(true), // Use the skip cache version when manually refreshing
    setTotalPrice // Export this so we can update it directly if needed
  };
}
