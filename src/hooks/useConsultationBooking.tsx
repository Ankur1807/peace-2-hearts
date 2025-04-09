import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveConsultation } from '@/utils/consultationApi';
import { PersonalDetails } from '@/utils/types';
import { sendBookingConfirmationEmail } from '@/utils/emailService';
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing/fetchPricing';

// Types
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

// Helper to determine package name based on service selection
const getPackageName = (services: string[]): string | null => {
  // Divorce Prevention Package services
  const divorcePrevention = [
    'couples-counselling',
    'mental-health-counselling',
    'mediation',
    'general-legal'
  ];
  
  // Pre-Marriage Clarity Package services
  const preMarriageClarity = [
    'pre-marriage-legal',
    'premarital-counselling',
    'mental-health-counselling'
  ];

  // Check if selected services match a package
  if (services.length === divorcePrevention.length && 
      divorcePrevention.every(s => services.includes(s))) {
    return "Divorce Prevention Package";
  }
  
  if (services.length === preMarriageClarity.length && 
      preMarriageClarity.every(s => services.includes(s))) {
    return "Pre-Marriage Clarity Package";
  }
  
  return null;
};

// Hook for managing consultation booking state
export function useConsultationBooking() {
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
  
  const { toast } = useToast();

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

  // Process each service booking
  const processServiceBookings = useCallback(async () => {
    const { selectedServices, serviceCategory, date, timeSlot, timeframe, personalDetails } = state;
    let lastResult;
    
    for (const service of selectedServices) {
      console.log(`Creating consultation for service: ${service}`);
      const result = await saveConsultation(
        service,
        serviceCategory === 'holistic' ? undefined : date,
        serviceCategory === 'holistic' ? timeframe : timeSlot,
        personalDetails
      );
      
      if (result) {
        console.log(`Consultation created for ${service}:`, result);
        lastResult = result;
      }
    }
    
    return lastResult;
  }, [state]);
  
  // Handle booking confirmation
  const handleConfirmBooking = useCallback(async () => {
    console.log("handleConfirmBooking called with services:", state.selectedServices);
    setIsProcessing(true);
    setBookingError(null);
    
    try {
      if (state.selectedServices.length === 0) {
        throw new Error("Please select at least one service");
      }

      console.log("Starting booking process with state:", {
        services: state.selectedServices,
        date: state.date,
        timeSlot: state.timeSlot,
        timeframe: state.timeframe,
        personalDetails: state.personalDetails,
        totalPrice: state.totalPrice
      });

      // Process all service bookings
      const lastResult = await processServiceBookings();
      
      if (lastResult) {
        console.log("All consultations created successfully. Last result:", lastResult);
        setReferenceId(lastResult.referenceId);
        
        // Get package name if applicable
        const packageName = state.serviceCategory === 'holistic' 
          ? getPackageName(state.selectedServices) 
          : null;
        
        // Send confirmation email
        try {
          await sendBookingConfirmationEmail({
            clientName: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
            email: state.personalDetails.email,
            referenceId: lastResult.referenceId,
            consultationType: state.selectedServices.length > 1 ? 'multiple' : state.selectedServices[0],
            services: state.selectedServices,
            // Only send date and timeSlot for non-holistic bookings
            date: state.serviceCategory === 'holistic' ? undefined : state.date,
            timeSlot: state.serviceCategory === 'holistic' ? undefined : state.timeSlot,
            // Only send timeframe for holistic bookings
            timeframe: state.serviceCategory === 'holistic' ? state.timeframe : undefined,
            message: state.personalDetails.message,
            // Include package name if applicable
            packageName: packageName
          });
          console.log("Confirmation email sent successfully");
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          // Continue with the booking process even if email fails
        }
        
        setSubmitted(true);
        window.scrollTo(0, 0);
        
        toast({
          title: "Booking Confirmed",
          description: `Your consultation${state.selectedServices.length > 1 ? 's have' : ' has'} been successfully booked.`,
        });
      }
    } catch (error: any) {
      console.error("Error confirming booking:", error);
      setBookingError(error.message || "Unknown error occurred");
      
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error confirming your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [state, processServiceBookings, toast, setIsProcessing, setBookingError, setReferenceId, setSubmitted]);

  // Process payment using Razorpay
  const processPayment = useCallback(async () => {
    if (!state.totalPrice) {
      toast({
        title: "Invalid Amount",
        description: "Cannot process payment for zero amount.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // This would normally come from your backend
      // For now we'll generate a temporary order ID locally
      const tempOrderId = `order_${Math.random().toString(36).substring(2, 15)}`;
      setOrderId(tempOrderId);
      
      // In production, you would create an order on your backend and get the order ID
      // Example: const order = await createOrder(state.totalPrice);
      
      const options = {
        key: "RAZORPAY_KEY_ID", // Replace with actual key in production
        amount: state.totalPrice * 100, // Razorpay accepts amount in paise
        currency: "INR",
        name: "Peace2Hearts",
        description: `Payment for ${state.selectedServices.length} services`,
        order_id: tempOrderId,
        handler: function(response: any) {
          // Handle successful payment
          console.log("Payment successful:", response);
          setPaymentCompleted(true);
          
          // Now proceed with booking confirmation
          handleConfirmBooking();
        },
        prefill: {
          name: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
          email: state.personalDetails.email,
          contact: state.personalDetails.phone
        },
        notes: {
          services: state.selectedServices.join(',')
        },
        theme: {
          color: "#3399cc"
        }
      };
      
      // Initialize and open Razorpay
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
      
      // Handle errors from Razorpay
      razorpay.on('payment.failed', function(response: any) {
        console.error("Payment failed:", response.error);
        toast({
          title: "Payment Failed",
          description: response.error.description || "Your payment was not successful. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
      });
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Processing Error",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  }, [state.totalPrice, state.personalDetails, state.selectedServices, toast, setIsProcessing, setOrderId, setPaymentCompleted, handleConfirmBooking]);

  // Function to proceed to payment step
  const proceedToPayment = useCallback(() => {
    // Validate form first
    if (!state.personalDetails.firstName || 
        !state.personalDetails.lastName ||
        !state.personalDetails.email ||
        !state.personalDetails.phone ||
        state.selectedServices.length === 0) {
      toast({
        title: "Form Incomplete",
        description: "Please fill out all required fields before proceeding to payment.",
        variant: "destructive"
      });
      return;
    }
    
    setShowPaymentStep(true);
  }, [state.personalDetails, state.selectedServices, toast, setShowPaymentStep]);

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
