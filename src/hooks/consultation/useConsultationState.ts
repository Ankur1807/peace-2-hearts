
import { useState } from 'react';
import { usePricingState } from './usePricingState';
import { usePersonalDetailsState } from './usePersonalDetailsState';
import { useBookingState } from './useBookingState';
import { useDiscountState } from './useDiscountState';

export function useConsultationState() {
  const pricing = usePricingState();
  const personalDetails = usePersonalDetailsState();
  const booking = useBookingState();
  const discount = useDiscountState(pricing.totalPrice, pricing.setTotalPrice);

  return {
    ...pricing,
    ...personalDetails,
    ...booking,
    ...discount,
  };
}
