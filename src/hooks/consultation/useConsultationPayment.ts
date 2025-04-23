
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isRazorpayAvailable, loadRazorpayScript } from '@/utils/payment/razorpayService';
import { generateReferenceId } from '@/utils/referenceGenerator';
import { usePaymentValidation } from './usePaymentValidation';
import { useRazorpayPayment } from './useRazorpayPayment';

interface UseConsultationPaymentProps {
  state: any;
  toast: any;
  setIsProcessing?: (isProcessing: boolean) => void;
  setShowPaymentStep?: (show: boolean) => void;
  handleConfirmBooking?: () => Promise<void>;
  setReferenceId?: (id: string) => void;
}

export function useConsultationPayment({
  state,
  toast,
  setIsProcessing,
  setShowPaymentStep,
  handleConfirmBooking,
  setReferenceId
}: UseConsultationPaymentProps) {
  const { validatePersonalDetails, validateServiceSelection, validatePaymentAmount } = usePaymentValidation();
  const { initializeRazorpayPayment, openRazorpayCheckout } = useRazorpayPayment({
    state,
    toast,
    setIsProcessing: setIsProcessing || (() => {}),
    setReferenceId,
    handleConfirmBooking
  });
  
  // Function to get the actual price from the pricing map
  const getActualPrice = useCallback(() => {
    if (!state.selectedServices || state.selectedServices.length === 0 || !state.pricing) {
      return state.totalPrice;
    }
    
    // Test service pricing check
    if (state.selectedServices.includes('test-service') && state.pricing.has('test-service')) {
      const price = state.pricing.get('test-service');
      if (price) {
        console.log(`Payment using test service price: ${price}`);
        return price;
      }
    }
    
    // Check direct match in pricing map for other service
    const serviceId = state.selectedServices[0];
    if (state.pricing.has(serviceId)) {
      const price = state.pricing.get(serviceId);
      if (price) {
        console.log(`Payment using direct service price for ${serviceId}: ${price}`);
        return price;
      }
    }
    
    // Check if it's a package
    if (serviceId === 'divorce-prevention' || serviceId === 'pre-marriage-clarity') {
      if (state.pricing.has(serviceId)) {
        const price = state.pricing.get(serviceId);
        if (price) {
          console.log(`Payment using package price for ${serviceId}: ${price}`);
          return price;
        }
      }
    }
    
    console.log(`Payment using total price: ${state.totalPrice}`);
    return state.totalPrice;
  }, [state.selectedServices, state.pricing, state.totalPrice]);
  
  // Function to proceed to payment step
  const proceedToPayment = useCallback(() => {
    // Only include if setShowPaymentStep is provided
    if (!setShowPaymentStep) return;
    
    // Validate form first
    if (!validatePersonalDetails(state.personalDetails) || 
        !validateServiceSelection(state.selectedServices)) {
      toast({
        title: "Form Incomplete",
        description: "Please fill out all required fields before proceeding to payment.",
        variant: "destructive"
      });
      return;
    }
    
    // Log current state for debugging
    console.log("useConsultationPayment state:", {
      selectedServices: state.selectedServices,
      totalPrice: state.totalPrice,
      pricing: state.pricing ? Object.fromEntries(state.pricing) : "No pricing data"
    });
    
    setShowPaymentStep(true);
  }, [state.personalDetails, state.selectedServices, toast, setShowPaymentStep, state.pricing, state.totalPrice]);

  // Process payment using Razorpay
  const processPayment = useCallback(async () => {
    // Only include if necessary setters are provided
    if (!setIsProcessing || !handleConfirmBooking) return;
    
    // Get the actual price to charge
    const actualPrice = getActualPrice();
    console.log(`Processing payment with calculated price: ${actualPrice}`);
    
    if (!actualPrice || !validatePaymentAmount(actualPrice)) {
      toast({
        title: "Invalid Amount",
        description: "Cannot process payment for zero amount.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Ensure Razorpay is loaded
      let razorpayLoaded = isRazorpayAvailable();
      
      if (!razorpayLoaded) {
        console.log("Razorpay not loaded, attempting to load script");
        razorpayLoaded = await loadRazorpayScript();
        
        if (!razorpayLoaded) {
          throw new Error("Payment gateway failed to load. Please refresh the page and try again.");
        }
      }
      
      // Generate a reference ID for this transaction
      const receiptId = generateReferenceId();
      if (setReferenceId) {
        setReferenceId(receiptId);
      }
      
      // Initialize payment
      const { order, razorpayKey } = await initializeRazorpayPayment(receiptId);
      
      // Open checkout
      openRazorpayCheckout(order, razorpayKey, receiptId);
      
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Processing Error",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  }, [state, toast, setIsProcessing, setReferenceId, handleConfirmBooking, getActualPrice]);

  return {
    proceedToPayment,
    processPayment
  };
}
