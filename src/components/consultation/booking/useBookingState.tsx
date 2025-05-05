
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import { getPackageName } from '@/utils/consultation/packageUtils';
import { getFallbackPrice } from '@/utils/pricing/fallbackPrices';
import { useEffect } from 'react';

export const useBookingState = (bookingState: ConsultationBookingHook) => {
  const {
    selectedServices,
    pricing,
    setTotalPrice
  } = bookingState;

  useEffect(() => {
    // Update total price based on current selection
    if (selectedServices.length > 0) {
      // Check if it's a package
      const packageName = getPackageName(selectedServices);
      if (packageName) {
        const packageId = packageName === "Divorce Prevention Package" 
          ? 'divorce-prevention' 
          : 'pre-marriage-clarity';
          
        // Check if we have price for this package
        if (pricing?.has(packageId)) {
          const packagePrice = pricing.get(packageId)!;
          console.log(`Setting total price to package price: ${packagePrice} for ${packageId}`);
          setTotalPrice(packagePrice);
        } else {
          console.log(`No pricing found for package ${packageId}, calculating from services`);
          // Calculate total from individual services
          let sum = 0;
          selectedServices.forEach(serviceId => {
            if (pricing?.has(serviceId)) {
              sum += pricing.get(serviceId)!;
            }
          });
          if (sum > 0) {
            // Apply 15% discount for packages
            const discountedSum = Math.round(sum * 0.85);
            console.log(`Calculated discounted package price: ${discountedSum} from sum ${sum}`);
            setTotalPrice(discountedSum);
          }
        }
      } else if (selectedServices.length === 1) {
        // Single service
        const serviceId = selectedServices[0];
        if (pricing?.has(serviceId)) {
          const servicePrice = pricing.get(serviceId)!;
          console.log(`Setting total price to service price: ${servicePrice} for ${serviceId}`);
          setTotalPrice(servicePrice);
        } else if (selectedServices.includes('test-service')) {
          console.log('Setting test service default price: 11');
          setTotalPrice(11);
        }
      }
    } else {
      // No service selected
      setTotalPrice(0);
    }
  }, [selectedServices, pricing, setTotalPrice]);

  return bookingState;
};
