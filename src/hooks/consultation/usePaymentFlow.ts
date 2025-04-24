
import { useCallback } from 'react';
import { isRazorpayAvailable, loadRazorpayScript } from '@/utils/payment/razorpayService';
import { generateReferenceId } from '@/utils/referenceGenerator';
import { usePaymentValidation } from './usePaymentValidation';
import { useRazorpayPayment } from './useRazorpayPayment';

interface UsePaymentFlowProps {
  state: any; // Using any for simplicity, but in a real app, define a proper type
  toast: any;
  setIsProcessing?: (isProcessing: boolean) => void;
  setShowPaymentStep?: (show: boolean) => void;
  handleConfirmBooking?: () => Promise<void>;
  setOrderId?: (id: string | null) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  setReferenceId?: (id: string) => void;
}

export function usePaymentFlow({
  state,
  toast,
  setIsProcessing,
  setShowPaymentStep,
  handleConfirmBooking,
  setOrderId,
  setPaymentCompleted,
  setReferenceId
}: UsePaymentFlowProps) {
  const { validatePersonalDetails, validateServiceSelection, validatePaymentAmount } = usePaymentValidation();
  const { initializeRazorpayPayment, openRazorpayCheckout } = useRazorpayPayment({
    state,
    toast,
    setIsProcessing: setIsProcessing || (() => {}),
    setOrderId,
    setPaymentCompleted,
    setReferenceId,
    handleConfirmBooking
  });
  
  // Function to proceed to payment step
  const proceedToPayment = useCallback(() => {
    // Only include if setShowPaymentStep is provided
    if (!setShowPaymentStep) {
      console.error("setShowPaymentStep not provided to usePaymentFlow");
      return;
    }
    
    console.log("proceedToPayment called with:", {
      personalDetails: state.personalDetails,
      selectedServices: state.selectedServices
    });

    // Validate form first
    if (!validatePersonalDetails(state.personalDetails) || 
        !validateServiceSelection(state.selectedServices)) {
      console.error("Form validation failed:", {
        personalDetails: validatePersonalDetails(state.personalDetails),
        serviceSelection: validateServiceSelection(state.selectedServices)
      });
      
      toast({
        title: "Form Incomplete",
        description: "Please fill out all required fields before proceeding to payment.",
        variant: "destructive"
      });
      return;
    }
    
    // Force setShowPaymentStep to true to ensure the component updates
    console.log("Form validation passed, proceeding to payment step - SETTING showPaymentStep to TRUE");
    setTimeout(() => {
      setShowPaymentStep(true);
    }, 0);
  }, [state.personalDetails, state.selectedServices, toast, setShowPaymentStep, validatePersonalDetails, validateServiceSelection]);

  // Process payment using Razorpay
  const processPayment = useCallback(async () => {
    // Only include if necessary setters are provided
    if (!setIsProcessing || !handleConfirmBooking) {
      console.error("Required handlers not provided to processPayment");
      return;
    }
    
    console.log("processPayment called with:", {
      selectedServices: state.selectedServices,
      totalPrice: state.totalPrice
    });
    
    // Special handling for test service
    const isTestService = state.selectedServices.includes('test-service');
    let effectivePrice = state.totalPrice;
    
    if (isTestService) {
      // For test service, use price from pricing map or fallback to 11
      effectivePrice = state.pricing?.get('test-service') || 11;
      console.log(`Using test service price for payment: ${effectivePrice}`);
    }
    
    // Validate payment amount for non-test services
    if (!isTestService && !validatePaymentAmount(effectivePrice)) {
      console.error("Invalid payment amount:", effectivePrice);
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
      console.log("Initializing Razorpay payment with receipt ID:", receiptId);
      const { order, razorpayKey } = await initializeRazorpayPayment(receiptId);
      
      console.log("Payment initialized, opening checkout with order:", order);
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
  }, [
    state.totalPrice, 
    state.personalDetails, 
    state.selectedServices, 
    state.pricing,
    toast, 
    setIsProcessing, 
    setReferenceId, 
    handleConfirmBooking, 
    validatePaymentAmount,
    initializeRazorpayPayment,
    openRazorpayCheckout
  ]);

  return {
    proceedToPayment,
    processPayment
  };
}
