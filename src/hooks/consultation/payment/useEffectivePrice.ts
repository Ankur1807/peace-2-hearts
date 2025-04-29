
import { useEffect, useState } from 'react';

interface UseEffectivePriceProps {
  selectedServices: string[];
  pricing?: Map<string, number>;
  totalPrice?: number;
}

export const useEffectivePrice = ({
  selectedServices,
  pricing,
  totalPrice
}: UseEffectivePriceProps) => {
  const [effectivePrice, setEffectivePrice] = useState<number>(0);

  useEffect(() => {
    const calculateEffectivePrice = () => {
      // If total price is directly provided, use it
      if (totalPrice !== undefined && totalPrice > 0) {
        console.log(`Using provided total price: ${totalPrice}`);
        setEffectivePrice(totalPrice);
        return;
      }

      // Check if we have test service
      const hasTestService = selectedServices.includes('test-service');
      if (hasTestService) {
        console.log('Test service detected, setting fixed price');
        setEffectivePrice(50); // Fixed price for test service
        return;
      }
      
      // Calculate based on selected services and pricing map
      if (selectedServices.length > 0 && pricing && pricing.size > 0) {
        let total = 0;
        let calculatedPrice = false;
        
        // Try to get price for each selected service
        for (const service of selectedServices) {
          const price = pricing.get(service);
          if (price) {
            total += price;
            calculatedPrice = true;
            console.log(`Adding price for ${service}: ${price}`);
          } else {
            console.log(`No price found for service: ${service}`);
          }
        }
        
        if (calculatedPrice) {
          console.log(`Calculated total price from pricing map: ${total}`);
          setEffectivePrice(total);
          return;
        }
      }
      
      // If we reach here, no valid price was found
      console.log('Could not determine price. Setting to 0.');
      setEffectivePrice(0);
    };
    
    calculateEffectivePrice();
  }, [selectedServices, pricing, totalPrice]);

  return () => effectivePrice;
};
