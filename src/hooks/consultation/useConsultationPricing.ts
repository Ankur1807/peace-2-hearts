
import { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { calculatePricingMap } from './useConsultationPricingHelpers';
import { useConsultationPricingDebug } from './useConsultationPricingDebug';

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

  const prevSelectedServices = useRef<string[]>([]);
  const prevServiceCategory = useRef<string>('');
  const initialFetchDone = useRef(false);

  const updatePricing = useCallback(async (skipCache = false) => {
    const servicesChanged =
      selectedServices.length !== prevSelectedServices.current.length ||
      selectedServices.some(s => !prevSelectedServices.current.includes(s)) ||
      serviceCategory !== prevServiceCategory.current;

    if (!servicesChanged && initialFetchDone.current && !skipCache) {
      return;
    }

    prevSelectedServices.current = [...selectedServices];
    prevServiceCategory.current = serviceCategory;

    setIsLoading(true);
    setPricingError(null);

    try {
      console.log(`[PRICE DEBUG] Fetching pricing data for category: ${serviceCategory}, services: ${selectedServices.join(', ')}`);
      const { pricingMap, finalPrice } = await calculatePricingMap(
        selectedServices, 
        serviceCategory, 
        setPricingError, 
        toast
      );

      console.log(`[PRICE DEBUG] Received pricing data with ${pricingMap.size} items, final price: ${finalPrice}`);
      
      // Verify we have pricing data before setting the state
      if (pricingMap.size === 0) {
        console.warn("[PRICE WARNING] No pricing data was fetched from Supabase");
      } else {
        console.log(`[PRICE DEBUG] Final pricing map before setting state:`, Object.fromEntries(pricingMap));
        // Verify specific packages have prices
        console.log(`[PRICE DEBUG] divorce-prevention price: ${pricingMap.get('divorce-prevention')}`);
        console.log(`[PRICE DEBUG] pre-marriage-clarity price: ${pricingMap.get('pre-marriage-clarity')}`);
      }
      
      setPricing(pricingMap);
      setTotalPrice(finalPrice);

      if (finalPrice === 0 && selectedServices.length > 0) {
        const errorMsg = 'No pricing information available for selected services';
        console.warn(errorMsg);
        setPricingError(errorMsg);
      }
    } catch (error) {
      console.error("[PRICE ERROR] Error in useConsultationPricing:", error);
      setPricingError("Failed to fetch pricing information");
      toast({ 
        title: "Error retrieving pricing information - Please try again later or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      initialFetchDone.current = true;
    }
  }, [selectedServices, serviceCategory, toast]);

  // Always fetch initial pricing data when component mounts
  useEffect(() => {
    if (!initialFetchDone.current) {
      console.log("[PRICE DEBUG] Initial pricing fetch triggered");
      updatePricing(true); // Skip cache on initial fetch
    } else if (selectedServices.length > 0) {
      console.log("[PRICE DEBUG] Service selection changed, updating pricing");
      updatePricing();
    }
  }, [updatePricing, selectedServices]);

  // Always force initial pricing fetch on mount
  useEffect(() => {
    console.log("[PRICE DEBUG] Component mounted, forcing initial pricing fetch");
    updatePricing(true);
  }, []);

  // After state update, log the pricing information
  useEffect(() => {
    console.log(`[PRICE DEBUG] Current pricing state:`, Object.fromEntries(pricing));
    console.log(`[PRICE DEBUG] Current total price:`, totalPrice);
    
    // Verify specific packages have prices
    if (pricing) {
      console.log(`[PRICE DEBUG] divorce-prevention price in state: ${pricing.get('divorce-prevention')}`);
      console.log(`[PRICE DEBUG] pre-marriage-clarity price in state: ${pricing.get('pre-marriage-clarity')}`);
    }
  }, [pricing, totalPrice]);

  // Debug hook to log pricing information
  useConsultationPricingDebug(totalPrice, selectedServices, pricing);

  return { 
    pricing, 
    totalPrice, 
    isLoading, 
    pricingError, 
    updatePricing: () => updatePricing(true),
    setTotalPrice
  };
}
