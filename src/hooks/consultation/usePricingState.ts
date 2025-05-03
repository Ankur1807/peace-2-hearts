
import { useState } from 'react';

export function usePricingState() {
  // Service selection
  const [serviceCategory, setServiceCategory] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Pricing data
  const [pricing, setPricing] = useState<Map<string, number>>(new Map([
    ['mental-health-counselling', 1500],
    ['family-therapy', 2000],
    ['couples-counselling', 1800],
    ['sexual-health-counselling', 2500],
    ['test-service', 11], // Test service with small amount
    ['pre-marriage-legal', 3000],
    ['mediation', 4000],
    ['divorce-consultation', 3500],
    ['child-custody', 3000],
    ['maintenance', 2500],
    ['legal-general', 2000],
    ['divorce-prevention', 5000],
    ['pre-marriage-clarity', 4500]
  ]));
  
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
