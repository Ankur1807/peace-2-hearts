
import { useState } from 'react';

export function usePricingState() {
  // Service selection
  const [serviceCategory, setServiceCategory] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Pricing data will be fetched dynamically from Supabase
  const [pricing, setPricing] = useState<Map<string, number>>(new Map());
  
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
