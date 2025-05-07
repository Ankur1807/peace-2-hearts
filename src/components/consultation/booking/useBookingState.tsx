
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
        // Map package name to full Supabase ID
        const packageSupabaseId = packageName === "Divorce Prevention Package" 
          ? 'P2H-H-divorce-prevention-package' 
          : 'P2H-H-pre-marriage-clarity-solutions';
          
        // Check if we have price for this package in pricing map
        if (pricing?.has(packageSupabaseId)) {
          const packagePrice = pricing.get(packageSupabaseId)!;
          console.log(`Setting total price to package price: ${packagePrice} for ${packageSupabaseId}`);
          setTotalPrice(packagePrice);
        } else {
          console.log(`No pricing found for package ${packageSupabaseId}, calculating from services or using fallback`);
          // Try to get price from fallbackPrices
          const fallbackPrice = getFallbackPrice(packageSupabaseId);
          if (fallbackPrice !== undefined) {
            console.log(`Using fallback price for ${packageSupabaseId}: ${fallbackPrice}`);
            setTotalPrice(fallbackPrice);
          } else {
            // Calculate total from individual services
            let sum = 0;
            selectedServices.forEach(serviceId => {
              // Map the client service ID to Supabase ID for consistency
              const serviceMap: Record<string, string> = {
                'couples-counselling': 'P2H-MH-couples-counselling',
                'mental-health-counselling': 'P2H-MH-mental-health-counselling',
                'mediation': 'P2H-L-mediation-services',
                'general-legal': 'P2H-L-general-legal-consultation',
                'pre-marriage-legal': 'P2H-L-pre-marriage-legal-consultation'
              };
              
              const supabaseServiceId = serviceMap[serviceId] || serviceId;
              
              if (pricing?.has(supabaseServiceId)) {
                sum += pricing.get(supabaseServiceId)!;
              } else {
                const fallbackServicePrice = getFallbackPrice(supabaseServiceId);
                if (fallbackServicePrice !== undefined) {
                  sum += fallbackServicePrice;
                }
              }
            });
            if (sum > 0) {
              // Apply 15% discount for packages
              const discountedSum = Math.round(sum * 0.85);
              console.log(`Calculated discounted package price: ${discountedSum} from sum ${sum}`);
              setTotalPrice(discountedSum);
            }
          }
        }
      } else if (selectedServices.length === 1) {
        // Single service - map to full Supabase ID
        const serviceId = selectedServices[0];
        const serviceMap: Record<string, string> = {
          'mental-health-counselling': 'P2H-MH-mental-health-counselling',
          'family-therapy': 'P2H-MH-family-therapy',
          'couples-counselling': 'P2H-MH-couples-counselling', 
          'sexual-health-counselling': 'P2H-MH-sexual-health-counselling',
          'test-service': 'P2H-MH-test-service',
          'pre-marriage-legal': 'P2H-L-pre-marriage-legal-consultation',
          'mediation': 'P2H-L-mediation-services',
          'divorce': 'P2H-L-divorce-consultation',
          'custody': 'P2H-L-child-custody-consultation',
          'maintenance': 'P2H-L-maintenance-consultation',
          'general-legal': 'P2H-L-general-legal-consultation'
        };
        
        const supabaseServiceId = serviceMap[serviceId] || serviceId;
        
        if (pricing?.has(supabaseServiceId)) {
          const servicePrice = pricing.get(supabaseServiceId)!;
          console.log(`Setting total price to service price: ${servicePrice} for ${supabaseServiceId} (mapped from ${serviceId})`);
          setTotalPrice(servicePrice);
        } else {
          // Try fallback price
          const fallbackPrice = getFallbackPrice(supabaseServiceId);
          if (fallbackPrice !== undefined) {
            console.log(`Using fallback price for ${supabaseServiceId}: ${fallbackPrice}`);
            setTotalPrice(fallbackPrice);
          } else if (serviceId === 'test-service') {
            console.log('Setting test service default price: 11');
            setTotalPrice(11);
          } else {
            setTotalPrice(0);
          }
        }
      }
    } else {
      // No service selected
      setTotalPrice(0);
    }
  }, [selectedServices, pricing, setTotalPrice]);

  return bookingState;
};
