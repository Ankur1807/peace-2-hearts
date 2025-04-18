
import { useEffect, useState, useCallback } from 'react';
import { getPricingForPublicDisplay, getPackagePrice } from '@/utils/pricing/pricingService';
import { useToast } from '@/hooks/use-toast';

interface UseConsultationPricingProps {
  selectedServices: string[];
  serviceCategory: string;
}

// Helper function to get package name based on selected services
const getPackageName = (services: string[]) => {
  // Sort services to ensure consistent comparison
  const sortedServices = [...services].sort();
  
  // Divorce Prevention Package services
  const divorcePrevention = [
    'couples-counselling',
    'general-legal',
    'mediation',
    'mental-health-counselling'
  ].sort();
  
  // Pre-Marriage Clarity Package services
  const preMarriageClarity = [
    'mental-health-counselling',
    'pre-marriage-legal',
    'premarital-counselling-individual'
  ].sort();

  // Check if selected services match a package
  if (sortedServices.length === divorcePrevention.length && 
      JSON.stringify(sortedServices) === JSON.stringify(divorcePrevention)) {
    return "divorce-prevention";
  }
  
  if (sortedServices.length === preMarriageClarity.length && 
      JSON.stringify(sortedServices) === JSON.stringify(preMarriageClarity)) {
    return "pre-marriage-clarity";
  }
  
  return null;
};

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
      // Determine if we're dealing with a package
      const packageId = serviceCategory === 'holistic' ? getPackageName(selectedServices) : null;
      
      // Pricing map to be populated
      let pricingMap = new Map<string, number>();
      let total = 0;
      
      // If we're dealing with a package, get its price
      if (packageId) {
        console.log('Fetching package pricing for:', packageId);
        const packagePrice = await getPackagePrice(packageId);
        
        if (packagePrice > 0) {
          pricingMap.set(packageId, packagePrice);
          total = packagePrice;
        } else {
          // If package price is not available, get individual service prices
          console.log('Package price not found, fetching individual service prices');
          pricingMap = await getPricingForPublicDisplay(selectedServices);
          
          // Calculate total from individual services
          selectedServices.forEach(serviceId => {
            const price = pricingMap.get(serviceId) || 0;
            total += price;
          });
        }
      } else {
        // For regular services, get individual prices
        console.log('Fetching individual service prices');
        pricingMap = await getPricingForPublicDisplay(selectedServices);
        
        // Calculate total from individual services
        selectedServices.forEach(serviceId => {
          const price = pricingMap.get(serviceId) || 0;
          total += price;
        });
      }
      
      console.log('Calculated total price:', total);
      setPricing(pricingMap);
      setTotalPrice(total);
      
      // Show warning if no prices found
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
