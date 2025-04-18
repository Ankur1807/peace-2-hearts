
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

  // Load initial pricing data for all services
  useEffect(() => {
    const loadInitialPricing = async () => {
      try {
        // Load pricing for common services so they're available before selection
        const mentalHealthIds = [
          'mental-health-counselling', 
          'family-therapy', 
          'premarital-counselling-individual',
          'premarital-counselling-couple',
          'couples-counselling'
        ];
        
        const legalIds = [
          'pre-marriage-legal',
          'mediation',
          'divorce',
          'custody',
          'maintenance',
          'general-legal'
        ];
        
        const packageIds = [
          'divorce-prevention',
          'pre-marriage-clarity'
        ];
        
        // Fetch all types of pricing
        const [mentalHealthPricing, legalPricing, packagePricing] = await Promise.all([
          fetchServicePricing(mentalHealthIds),
          fetchServicePricing(legalIds),
          fetchPackagePricing(packageIds)
        ]);
        
        // Combine all pricing into a single map
        const combinedPricing = new Map<string, number>();
        
        // Add mental health service pricing
        mentalHealthPricing.forEach((price, id) => {
          combinedPricing.set(id, price);
        });
        
        // Add legal service pricing
        legalPricing.forEach((price, id) => {
          combinedPricing.set(id, price);
        });
        
        // Add package pricing
        packagePricing.forEach((price, id) => {
          combinedPricing.set(id, price);
        });
        
        console.log("Initialized pricing data:", Object.fromEntries(combinedPricing));
        
        // Update state with the combined pricing
        setState(prev => ({
          ...prev,
          pricing: combinedPricing
        }));
      } catch (error) {
        console.error("Error initializing pricing data:", error);
      }
    };
    
    // Load initial pricing when component mounts
    loadInitialPricing();
  }, []); // Empty dependency array means this runs once on mount

  // Update total price when selected services or pricing changes
  useEffect(() => {
    const updateTotalPrice = () => {
      if (state.selectedServices.length === 0) {
        setState(prev => ({ ...prev, totalPrice: 0 }));
        return;
      }
      
      let total = 0;
      
      if (state.serviceCategory === 'holistic') {
        // Check if it matches a pre-defined package
        const packageName = getPackageName(state.selectedServices);
        if (packageName === "Divorce Prevention Package") {
          total = state.pricing.get('divorce-prevention') || 0;
          console.log('Using Divorce Prevention Package price:', total);
        } else if (packageName === "Pre-Marriage Clarity Package") {
          total = state.pricing.get('pre-marriage-clarity') || 0;
          console.log('Using Pre-Marriage Clarity Package price:', total);
        } else {
          // Sum individual services
          state.selectedServices.forEach(serviceId => {
            const price = state.pricing.get(serviceId) || 0;
            total += price;
            console.log(`Adding ${price} for ${serviceId} to total`);
          });
        }
      } else {
        // Sum individual services
        state.selectedServices.forEach(serviceId => {
          const price = state.pricing.get(serviceId) || 0;
          total += price;
          console.log(`Adding ${price} for ${serviceId} to total`);
        });
      }
      
      console.log('Final calculated total price:', total);
      setState(prev => ({ ...prev, totalPrice: total }));
    };
    
    updateTotalPrice();
  }, [state.selectedServices, state.serviceCategory, state.pricing]);

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
