
import { useEffect, useState, useCallback, useRef } from 'react';
import { getPackageName } from '@/utils/consultation/packageUtils';
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
      let finalPrice = 0;
      
      // Check if selected services match a package
      const packageName = getPackageName(selectedServices);
      
      if (packageName) {
        // This is a package, get package price
        const packageId = packageName === "Divorce Prevention Package" 
          ? 'divorce-prevention' 
          : 'pre-marriage-clarity';
        
        console.log(`Fetching package price for ${packageId}`);
        const packagePricing = await fetchPackagePricing([packageId], skipCache);
        finalPrice = packagePricing.get(packageId) || 0;
        
        console.log(`Package price for ${packageId}: ${finalPrice}`);
        
        // Also fetch individual service prices for display purposes
        pricingMap = await fetchServicePricing(selectedServices);
      } else {
        // Just individual services
        pricingMap = await fetchServicePricing(selectedServices);
        
        // Calculate total price from individual services
        console.log('Calculating total from individual services');
        selectedServices.forEach(serviceId => {
          const price = pricingMap.get(serviceId) || 0;
          finalPrice += price;
          console.log(`Adding ${price} for ${serviceId}`);
        });
      }
      
      console.log('Final calculated price:', finalPrice);
      setPricing(pricingMap);
      setTotalPrice(finalPrice);
      
      // If no prices found despite having valid services, show error
      if (finalPrice === 0 && selectedServices.length > 0) {
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
  
  // For debugging
  useEffect(() => {
    console.log(`Current totalPrice: ${totalPrice}, Selected services: ${selectedServices.join(', ')}`);
  }, [totalPrice, selectedServices]);
  
  return { 
    pricing, 
    totalPrice, 
    isLoading, 
    pricingError, 
    updatePricing: () => updatePricing(true), // Use the skip cache version when manually refreshing
    setTotalPrice // Export this so we can update it directly if needed
  };
}
