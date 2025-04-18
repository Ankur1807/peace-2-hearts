
import { useState, useCallback } from 'react';

export function useBookingState() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [serviceCategory, setServiceCategory] = useState('holistic');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [timeSlot, setTimeSlot] = useState('');
  const [timeframe, setTimeframe] = useState('1-2-weeks');
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const setSelectedServicesWithLog = useCallback((
    services: string[] | ((prev: string[]) => string[])
  ) => {
    setSelectedServices(prev => {
      const updatedServices = typeof services === 'function' 
        ? services(prev) 
        : services;
      console.log("Updating selected services:", updatedServices);
      return updatedServices;
    });
  }, []);

  return {
    date,
    setDate,
    serviceCategory,
    setServiceCategory,
    selectedServices,
    setSelectedServices: setSelectedServicesWithLog,
    timeSlot,
    setTimeSlot,
    timeframe,
    setTimeframe,
    submitted,
    setSubmitted,
    isProcessing,
    setIsProcessing,
    referenceId,
    setReferenceId,
    bookingError,
    setBookingError,
    showPaymentStep,
    setShowPaymentStep,
    paymentCompleted,
    setPaymentCompleted,
    orderId,
    setOrderId
  };
}
