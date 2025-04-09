
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PersonalDetails } from '@/utils/types';
import { useConsultationState } from './consultation/useConsultationState';
import { useConsultationActions } from './consultation/useConsultationActions';
import { useConsultationPricing } from './consultation/useConsultationPricing';
import { useConsultationPayment } from './consultation/useConsultationPayment';

// Hook for managing consultation booking state
export function useConsultationBooking() {
  const { toast } = useToast();
  
  // Use focused hooks to manage different aspects of the consultation process
  const { 
    state, 
    setDate, 
    setServiceCategory, 
    setSelectedServices, 
    setTimeSlot, 
    setTimeframe,
    setSubmitted,
    setIsProcessing,
    setReferenceId,
    setBookingError,
    setShowPaymentStep,
    handlePersonalDetailsChange
  } = useConsultationState();
  
  const { 
    handleConfirmBooking, 
    processServiceBookings 
  } = useConsultationActions({
    state,
    setReferenceId,
    setSubmitted,
    setBookingError,
    setIsProcessing,
    toast
  });
  
  const { 
    proceedToPayment 
  } = useConsultationPayment({
    state,
    toast,
    setShowPaymentStep
  });
  
  const {
    processPayment
  } = useConsultationPayment({
    state,
    toast,
    setIsProcessing,
    handleConfirmBooking
  });

  // Return all state and functions
  return {
    ...state,
    setDate,
    setServiceCategory,
    setSelectedServices,
    setTimeSlot,
    setTimeframe,
    handlePersonalDetailsChange,
    handleConfirmBooking,
    processPayment,
    proceedToPayment,
    setShowPaymentStep
  };
}

export type ConsultationBookingHook = ReturnType<typeof useConsultationBooking>;
