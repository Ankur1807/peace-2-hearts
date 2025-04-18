
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
    
    setShowPaymentStep(true);
  }, [state.personalDetails, state.selectedServices, toast, setShowPaymentStep]);

  // Process payment using Razorpay
  const processPayment = useCallback(async () => {
    // Only include if necessary setters are provided
    if (!setIsProcessing || !handleConfirmBooking) return;
    
    if (!validatePaymentAmount(state.totalPrice)) {
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
  }, [state.totalPrice, state.personalDetails, state.selectedServices, toast, setIsProcessing, setReferenceId, handleConfirmBooking]);

  return {
    proceedToPayment,
    processPayment
  };
}
