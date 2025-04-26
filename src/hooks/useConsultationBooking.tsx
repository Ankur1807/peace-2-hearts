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
  
  // Get all state from the consultation state hook
  const consultationState = useConsultationState();
  
  // Destructure the state for easier access
  const {
    date,
    setDate,
    serviceCategory,
    setServiceCategory,
    selectedServices,
    setSelectedServices,
    timeSlot,
    setTimeSlot,
    timeframe,
    setTimeframe,
    personalDetails,
    handlePersonalDetailsChange,
    pricing,
    totalPrice,
    setTotalPrice,
  } = consultationState;
  
  // Other state that's managed locally in this hook
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Combine all state into a single object for passing to child hooks
  const state = {
    ...consultationState,
    submitted,
    isProcessing,
    referenceId,
    bookingError,
    showPaymentStep,
    paymentCompleted,
    orderId
  };
  
  // Use actions hook with the consolidated state
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

  // Compose all required functions for the payment hook
  const useConsultationPaymentParams = {
    state,
    toast,
    setIsProcessing,
    setShowPaymentStep,
    handleConfirmBooking,
    setReferenceId
  };
  
  // Only initialize hooks once to avoid duplicating logic
  const paymentHook = useConsultationPayment(useConsultationPaymentParams);

  // Return all state and functions
  return {
    // State from useConsultationState
    date,
    serviceCategory,
    selectedServices,
    timeSlot,
    timeframe,
    personalDetails,
    pricing,
    totalPrice,
    
    // Local state
    submitted,
    isProcessing,
    referenceId,
    bookingError,
    showPaymentStep,
    paymentCompleted,
    orderId,
    
    // State setters
    setDate,
    setServiceCategory,
    setSelectedServices,
    setTimeSlot,
    setTimeframe,
    setTotalPrice,
    
    // Actions
    handlePersonalDetailsChange,
    handleConfirmBooking,
    ...paymentHook, // includes processPayment and proceedToPayment
    setShowPaymentStep
  };
}

export type ConsultationBookingHook = ReturnType<typeof useConsultationBooking>;
