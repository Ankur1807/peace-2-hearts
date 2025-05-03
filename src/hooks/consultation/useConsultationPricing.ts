
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
    console.log('[PRICE DEBUG] updatePricing called with skipCache:', skipCache);
    console.log('[PRICE DEBUG] Current selectedServices:', selectedServices);
    console.log('[PRICE DEBUG] Current serviceCategory:', serviceCategory);
    
    const servicesChanged =
      selectedServices.length !== prevSelectedServices.current.length ||
      selectedServices.some(s => !prevSelectedServices.current.includes(s)) ||
      serviceCategory !== prevServiceCategory.current;

    if (!servicesChanged && initialFetchDone.current && !skipCache) {
      console.log('[PRICE DEBUG] No changes detected, skipping price update');
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

      console.log(`[PRICE DEBUG] Received pricing data: pricing map size=${pricingMap.size}, final price=${finalPrice}`);
      console.log('[PRICE DEBUG] Received pricing map:', Object.fromEntries(pricingMap));
      
      // Verify we have pricing data before setting the state
      if (pricingMap.size === 0) {
        console.warn("[PRICE WARNING] No pricing data was fetched from Supabase");
      } else {
        console.log(`[PRICE DEBUG] Final pricing map before setting state:`, Object.fromEntries(pricingMap));
        
        // Verify specific packages have prices
        if (selectedServices.includes('divorce-prevention')) {
          console.log(`[PRICE DEBUG] divorce-prevention price: ${pricingMap.get('divorce-prevention')}`);
        }
        if (selectedServices.includes('pre-marriage-clarity')) {
          console.log(`[PRICE DEBUG] pre-marriage-clarity price: ${pricingMap.get('pre-marriage-clarity')}`);
        }
      }
      
      setPricing(pricingMap);
      setTotalPrice(finalPrice);
      console.log('[PRICE DEBUG] State updated with pricing map and total price:', finalPrice);

      if (finalPrice === 0 && selectedServices.length > 0) {
        const errorMsg = 'No pricing information available for selected services';
        console.warn(`[PRICE WARNING] ${errorMsg}`);
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
      if (selectedServices.includes('divorce-prevention')) {
        console.log(`[PRICE DEBUG] divorce-prevention price in state: ${pricing.get('divorce-prevention')}`);
      }
      if (selectedServices.includes('pre-marriage-clarity')) {
        console.log(`[PRICE DEBUG] pre-marriage-clarity price in state: ${pricing.get('pre-marriage-clarity')}`);
      }
    }
  }, [pricing, totalPrice, selectedServices]);

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
