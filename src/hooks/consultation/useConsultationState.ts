
import { useState, useCallback, useEffect } from 'react';
import { PersonalDetails } from '@/utils/types';
import { getPackageName } from './consultationHelpers';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing/fetchPricing';

// State type definition
interface BookingState {
  date: Date | undefined;
  serviceCategory: string;
  selectedServices: string[];
  timeSlot: string;
  timeframe: string;
  submitted: boolean;
  isProcessing: boolean;
  referenceId: string | null;
  bookingError: string | null;
  personalDetails: PersonalDetails;
  pricing: Map<string, number>;
  totalPrice: number;
  showPaymentStep: boolean;
  paymentCompleted: boolean;
  orderId: string | null;
}

export function useConsultationState() {
  const [state, setState] = useState<BookingState>({
    date: undefined,
    serviceCategory: 'holistic',
    selectedServices: [],
    timeSlot: '',
    timeframe: '1-2-weeks',
    submitted: false,
    isProcessing: false,
    referenceId: null,
    bookingError: null,
    personalDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    },
    pricing: new Map<string, number>(),
    totalPrice: 0,
    showPaymentStep: false,
    paymentCompleted: false,
    orderId: null
  });
  
  // State setter functions using useCallback
  const setDate = useCallback((date: Date | undefined) => 
    setState(prev => ({ ...prev, date })), []);
  
  const setServiceCategory = useCallback((serviceCategory: string) => 
    setState(prev => ({ ...prev, serviceCategory })), []);
  
  const setSelectedServices = useCallback((services: string[] | ((prev: string[]) => string[])) => {
    setState(prev => {
      const updatedServices = typeof services === 'function' 
        ? services(prev.selectedServices) 
        : services;
      
      console.log("Updating selected services:", updatedServices);
      return { ...prev, selectedServices: updatedServices };
    });
  }, []);
  
  const setTimeSlot = useCallback((timeSlot: string) => 
    setState(prev => ({ ...prev, timeSlot })), []);
  
  const setTimeframe = useCallback((timeframe: string) => 
    setState(prev => ({ ...prev, timeframe })), []);
  
  const setSubmitted = useCallback((submitted: boolean) => 
    setState(prev => ({ ...prev, submitted })), []);
  
  const setIsProcessing = useCallback((isProcessing: boolean) => 
    setState(prev => ({ ...prev, isProcessing })), []);
  
  const setReferenceId = useCallback((referenceId: string | null) => 
    setState(prev => ({ ...prev, referenceId })), []);
  
  const setBookingError = useCallback((bookingError: string | null) => 
    setState(prev => ({ ...prev, bookingError })), []);
    
  const setShowPaymentStep = useCallback((showPaymentStep: boolean) => 
    setState(prev => ({ ...prev, showPaymentStep })), []);
    
  const setPaymentCompleted = useCallback((paymentCompleted: boolean) => 
    setState(prev => ({ ...prev, paymentCompleted })), []);
    
  const setOrderId = useCallback((orderId: string | null) => 
    setState(prev => ({ ...prev, orderId })), []);

  // Handle personal details updates
  const handlePersonalDetailsChange = useCallback((details: PersonalDetails) => {
    console.log("Updating personal details:", details);
    setState(prev => ({ ...prev, personalDetails: details }));
  }, []);

  // Fetch pricing data when services change
  useEffect(() => {
    const loadPricing = async () => {
      if (state.selectedServices.length === 0) {
        setState(prev => ({ ...prev, totalPrice: 0 }));
        return;
      }
      
      try {
        let pricingMap: Map<string, number>;
        
        if (state.serviceCategory === 'holistic') {
          // Check if it matches a pre-defined package
          const packageName = getPackageName(state.selectedServices);
          if (packageName === "Divorce Prevention Package") {
            pricingMap = await fetchPackagePricing(['divorce-prevention']);
          } else if (packageName === "Pre-Marriage Clarity Package") {
            pricingMap = await fetchPackagePricing(['pre-marriage-clarity']);
          } else {
            // If not a pre-defined package, get individual service prices
            pricingMap = await fetchServicePricing(state.selectedServices);
          }
        } else {
          // For regular services, get individual prices
          pricingMap = await fetchServicePricing(state.selectedServices);
        }
        
        // Calculate total price
        let total = 0;
        if (state.serviceCategory === 'holistic') {
          const packageName = getPackageName(state.selectedServices);
          if (packageName === "Divorce Prevention Package") {
            total = pricingMap.get('divorce-prevention') || 0;
          } else if (packageName === "Pre-Marriage Clarity Package") {
            total = pricingMap.get('pre-marriage-clarity') || 0;
          } else {
            // Sum individual services
            state.selectedServices.forEach(serviceId => {
              total += pricingMap.get(serviceId) || 0;
            });
          }
        } else {
          // Sum individual services
          state.selectedServices.forEach(serviceId => {
            total += pricingMap.get(serviceId) || 0;
          });
        }
        
        setState(prev => ({ ...prev, pricing: pricingMap, totalPrice: total }));
      } catch (error) {
        console.error("Error fetching pricing:", error);
      }
    };
    
    loadPricing();
  }, [state.selectedServices, state.serviceCategory]);

  return {
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
    setPaymentCompleted,
    setOrderId,
    handlePersonalDetailsChange
  };
}
