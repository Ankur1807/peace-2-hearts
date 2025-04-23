
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
      
      // Special handling for test service
      if (selectedServices.includes('test-service')) {
        console.log('Test service selected, setting fixed price');
        pricingMap.set('test-service', 11);
        finalPrice = 11;
      } else {
        // Check if selected services match a package
        const packageName = getPackageName(selectedServices);
        
        if (packageName) {
          // This is a package, get package price
          const packageId = packageName === "Divorce Prevention Package" 
            ? 'divorce-prevention' 
            : 'pre-marriage-clarity';
          
          console.log(`Fetching package price for ${packageId}`);
          const packagePricing = await fetchPackagePricing([packageId], skipCache);
          
          // Get the package price
          finalPrice = packagePricing.get(packageId) || 0;
          
          console.log(`Package price for ${packageId}: ${finalPrice}`);
          
          if (finalPrice > 0) {
            // Add the package price to the pricing map
            pricingMap.set(packageId, finalPrice);
            
            // Also fetch individual service prices for display purposes
            const servicePricing = await fetchServicePricing(selectedServices);
            
            // Combine the maps
            pricingMap = new Map([...pricingMap, ...servicePricing]);
          } else {
            console.warn(`No price found for package ${packageId}, attempting to calculate from services`);
            
            // Calculate from individual services as fallback
            pricingMap = await fetchServicePricing(selectedServices);
            
            // Sum up individual service prices
            selectedServices.forEach(serviceId => {
              const price = pricingMap.get(serviceId) || 0;
              finalPrice += price;
              console.log(`Adding ${price} for ${serviceId} (fallback calculation)`);
            });
            
            // Apply package discount
            if (finalPrice > 0) {
              finalPrice = Math.round(finalPrice * 0.85); // 15% discount
              console.log(`Applied 15% package discount: ${finalPrice}`);
              
              // Add the calculated package price
              pricingMap.set(packageId, finalPrice);
            }
          }
        } else {
          // Just individual services
          pricingMap = await fetchServicePricing(selectedServices);
          
          // Calculate total price from individual services
          console.log('Calculating total from individual services:', selectedServices);
          selectedServices.forEach(serviceId => {
            const price = pricingMap.get(serviceId) || 0;
            finalPrice += price;
            console.log(`Adding ${price} for ${serviceId}`);
          });
          
          // Make sure we add the direct service price to the pricing map
          if (selectedServices.length === 1) {
            const serviceId = selectedServices[0];
            const price = pricingMap.get(serviceId) || 0;
            if (price > 0) {
              console.log(`Setting direct price for single service ${serviceId}: ${price}`);
            } else {
              console.warn(`No price found for service ${serviceId} in pricing map`);
            }
          }
        }
      }
      
      console.log('Final calculated price:', finalPrice);
      console.log('Final pricing map:', Object.fromEntries(pricingMap));
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
    // Only fetch if we have services or haven't done the initial fetch yet
    if (selectedServices.length > 0 || !initialFetchDone.current) {
      updatePricing();
    }
  }, [updatePricing]);
  
  // For debugging
  useEffect(() => {
    console.log(`Current totalPrice: ${totalPrice}, Selected services: ${selectedServices.join(', ')}`);
    
    if (selectedServices.length === 1) {
      const serviceId = selectedServices[0];
      console.log(`Single service selected: ${serviceId}, Price: ${pricing.get(serviceId) || 'not found'}`);
    }
    
    // Log the package name if applicable
    const packageName = getPackageName(selectedServices);
    if (packageName) {
      const packageId = packageName === "Divorce Prevention Package" 
        ? 'divorce-prevention' 
        : 'pre-marriage-clarity';
      console.log(`Selected package: ${packageName} (${packageId}), Price: ${pricing.get(packageId) || 'not found'}`);
    }
  }, [totalPrice, selectedServices, pricing]);
  
  return { 
    pricing, 
    totalPrice, 
    isLoading, 
    pricingError, 
    updatePricing: () => updatePricing(true), // Use the skip cache version when manually refreshing
    setTotalPrice // Export this so we can update it directly if needed
  };
}
