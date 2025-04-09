
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
  const { toast } = useToast();
  
  // Load pricing data when services change
  const updatePricing = useCallback(async () => {
    if (selectedServices.length === 0) {
      setTotalPrice(0);
      return;
    }
    
    setIsLoading(true);
    console.log('Updating pricing for services:', selectedServices, 'in category:', serviceCategory);
    
    try {
      let pricingMap: Map<string, number> = new Map();
      
      if (serviceCategory === 'holistic') {
        // Check if it matches a pre-defined package
        const packageName = getPackageName(selectedServices);
        if (packageName === "Divorce Prevention Package") {
          console.log('Fetching Divorce Prevention Package pricing');
          pricingMap = await fetchPackagePricing(['divorce-prevention']);
        } else if (packageName === "Pre-Marriage Clarity Package") {
          console.log('Fetching Pre-Marriage Clarity Package pricing');
          pricingMap = await fetchPackagePricing(['pre-marriage-clarity']);
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
      
      // Show warning if no prices found
      if (total === 0 && selectedServices.length > 0) {
        console.warn('No pricing information available for selected services');
        toast({ 
          title: "Pricing information unavailable", 
          description: "Unable to retrieve current prices from our database.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching pricing:", error);
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
  
  return { pricing, totalPrice, isLoading, updatePricing };
}
