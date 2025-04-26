
import { usePricingState } from './usePricingState';
import { usePersonalDetailsState } from './usePersonalDetailsState';
import { useBookingState } from './useBookingState';

export function useConsultationState() {
  const pricing = usePricingState();
  const personalDetails = usePersonalDetailsState();
  const booking = useBookingState();

  return {
    ...pricing,
    ...personalDetails,
    ...booking,
  };
}
