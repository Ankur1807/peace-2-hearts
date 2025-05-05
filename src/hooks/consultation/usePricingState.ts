
import { useState } from 'react';
import { fallbackPrices } from '@/utils/pricing/fallbackPrices';

export function usePricingState() {
  // Service selection
  const [serviceCategory, setServiceCategory] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Pricing data
  const [pricing, setPricing] = useState<Map<string, number>>(
    new Map(Object.entries(fallbackPrices))
  );
  
  // Total price
  const [totalPrice, setTotalPrice] = useState(0);

  return {
    serviceCategory,
    setServiceCategory,
    selectedServices,
    setSelectedServices,
    pricing,
    setPricing,
    totalPrice,
    setTotalPrice
  };
}
