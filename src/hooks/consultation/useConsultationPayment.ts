
import { useCallback } from 'react';

interface UseConsultationPaymentProps {
  state: any;
  toast: any;
  setIsProcessing?: (isProcessing: boolean) => void;
  setShowPaymentStep?: (show: boolean) => void;
  handleConfirmBooking?: () => Promise<void>;
  setOrderId?: (id: string | null) => void;
  setPaymentCompleted?: (completed: boolean) => void;
}

export function useConsultationPayment({
  state,
  toast,
  setIsProcessing,
  setShowPaymentStep,
  handleConfirmBooking,
  setOrderId,
  setPaymentCompleted
}: UseConsultationPaymentProps) {
  // Function to proceed to payment step
  const proceedToPayment = useCallback(() => {
    // Only include if setShowPaymentStep is provided
    if (!setShowPaymentStep) return;
    
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

  // Process payment using Razorpay
  const processPayment = useCallback(async () => {
    // Only include if necessary setters are provided
    if (!setIsProcessing || !handleConfirmBooking) return;
    
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
      if (setOrderId) {
        setOrderId(tempOrderId);
      }
      
      // In production, you would create an order on your backend and get the order ID
      // Example: const order = await createOrder(state.totalPrice);
      
      const options = {
        key: "rzp_test_C4wVqKJiq5fXgj", // Replace with actual key
        amount: state.totalPrice * 100, // Razorpay accepts amount in paise
        currency: "INR",
        name: "Peace2Hearts",
        description: `Payment for ${state.selectedServices.length} services`,
        order_id: tempOrderId,
        handler: function(response: any) {
          // Handle successful payment
          console.log("Payment successful:", response);
          if (setPaymentCompleted) {
            setPaymentCompleted(true);
          }
          
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

  return {
    proceedToPayment,
    processPayment
  };
}
