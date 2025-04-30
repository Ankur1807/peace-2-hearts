
import { useState, useCallback } from 'react';
import { useRazorpayPayment } from './useRazorpayPayment';
import { usePaymentFlow } from './usePaymentFlow';
import { BookingDetails } from '@/utils/types';
import { getPackageName } from '@/utils/consultation/packageUtils';
import { convertISTTimeSlotToUTCString } from '@/utils/dateUtils';

interface UseConsultationPaymentProps {
  state: any;
  toast: any;
  setIsProcessing: (isProcessing: boolean) => void;
  setShowPaymentStep?: (show: boolean) => void;
  handleConfirmBooking?: () => Promise<void>;
  setReferenceId?: (id: string | null) => void;
}

export function useConsultationPayment({
  state,
  toast,
  setIsProcessing,
  setShowPaymentStep,
  handleConfirmBooking,
  setReferenceId
}: UseConsultationPaymentProps) {
  const [bookingComplete, setBookingComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Get payment flow functions
  const paymentFlow = usePaymentFlow({
    state,
    toast,
    setIsProcessing,
    setShowPaymentStep,
    handleConfirmBooking,
    setOrderId,
    setPaymentCompleted,
    setReferenceId
  });
  
  // Create booking details object for payment
  const createBookingDetails = useCallback((): BookingDetails => {
    // Create the basic booking details
    const bookingDetails: BookingDetails = {
      clientName: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
      email: state.personalDetails.email,
      phone: state.personalDetails.phone,
      referenceId: state.referenceId || '',
      consultationType: state.selectedServices.length > 1 ? 'multiple' : state.selectedServices[0] || state.serviceCategory,
      services: state.selectedServices || [],
      timeSlot: state.timeSlot,
      timeframe: state.timeframe,
      serviceCategory: state.serviceCategory,
      packageName: getPackageName(state.selectedServices),
      amount: state.totalPrice,
      message: state.personalDetails.message
    };
    
    // If we have both date and timeSlot, convert to UTC for storage
    if (state.date && state.timeSlot) {
      console.log('[useConsultationPayment] Original date before conversion:', state.date);
      
      // Format the date string (YYYY-MM-DD) from the Date object
      const dateStr = state.date instanceof Date 
        ? state.date.toISOString().split('T')[0] 
        : state.date;
        
      // Convert to UTC using our hardcoded function
      const utcDateString = convertISTTimeSlotToUTCString(dateStr, state.timeSlot);
      console.log('[useConsultationPayment] Converted UTC string for storage:', utcDateString);
      
      bookingDetails.date = utcDateString;
    } else {
      bookingDetails.date = state.date; // Keep original format if missing timeSlot
    }
    
    return bookingDetails;
  }, [state.personalDetails, state.referenceId, state.selectedServices, state.serviceCategory, state.date, state.timeSlot, state.timeframe, state.totalPrice]);
  
  // Get Razorpay payment functions with our booking details
  const razorpayPayment = useRazorpayPayment({
    state,
    createBookingDetails,
    toast,
    setIsProcessing,
    setBookingComplete,
    handleConfirmBooking
  });
  
  return {
    ...paymentFlow,
    ...razorpayPayment,
    bookingComplete,
    orderId,
    paymentCompleted,
    createBookingDetails
  };
}
