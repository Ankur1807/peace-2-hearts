
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import { getPackageName } from '@/utils/consultation/packageUtils';
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
          console.log(`No pricing found for package ${packageId}, setting to 0`);
          setTotalPrice(0);
        }
      } else if (selectedServices.length === 1) {
        // Single service
        const serviceId = selectedServices[0];
        if (pricing?.has(serviceId)) {
          const servicePrice = pricing.get(serviceId)!;
          console.log(`Setting total price to service price: ${servicePrice} for ${serviceId}`);
          setTotalPrice(servicePrice);
        } else if (selectedServices.includes('test-service')) {
          console.log('Setting test service price: 11');
          setTotalPrice(11);
        } else {
          console.log(`No pricing found for service ${serviceId}, setting to 0`);
          setTotalPrice(0);
        }
      }
    } else {
      // No service selected
      setTotalPrice(0);
    }
  }, [selectedServices, pricing, setTotalPrice]);

  return bookingState;
};
