
import { useCallback } from 'react';
import { createRazorpayOrder, savePaymentDetails, verifyRazorpayPayment } from '@/utils/payment/razorpayService';
import { generateReferenceId } from '@/utils/referenceGenerator';

interface UseConsultationPaymentProps {
  state: any;
  toast: any;
  setIsProcessing?: (isProcessing: boolean) => void;
  setShowPaymentStep?: (show: boolean) => void;
  handleConfirmBooking?: () => Promise<void>;
  setOrderId?: (id: string | null) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  setReferenceId?: (id: string) => void;
}

export function useConsultationPayment({
  state,
  toast,
  setIsProcessing,
  setShowPaymentStep,
  handleConfirmBooking,
  setOrderId,
  setPaymentCompleted,
  setReferenceId
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
      // Generate a reference ID for this transaction
      const receiptId = generateReferenceId();
      if (setReferenceId) {
        setReferenceId(receiptId);
      }
      
      // Create an order through our edge function
      const orderResponse = await createRazorpayOrder({
        amount: state.totalPrice,
        receipt: receiptId,
        notes: {
          services: state.selectedServices.join(','),
          client: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`
        }
      });
      
      if (!orderResponse.success || !orderResponse.order) {
        throw new Error(orderResponse.error || 'Failed to create order');
      }
      
      const { order } = orderResponse;
      console.log("Order created successfully:", order);
      
      if (setOrderId) {
        setOrderId(order.id);
      }
      
      // Initialize Razorpay
      const options = {
        key: process.env.NODE_ENV === 'production' 
          ? process.env.RAZORPAY_KEY_ID 
          : "rzp_test_C4wVqKJiq5fXgj", // Fallback to test key
        amount: order.amount, // Amount in paise
        currency: order.currency,
        name: "Peace2Hearts",
        description: `Payment for ${state.selectedServices.length} services`,
        order_id: order.id,
        handler: async function(response: any) {
          // Handle successful payment
          console.log("Payment successful:", response);
          
          try {
            // Verify the payment
            const isVerified = await verifyRazorpayPayment({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });
            
            if (!isVerified) {
              throw new Error("Payment verification failed");
            }
            
            // Save payment details in database
            await savePaymentDetails(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              state.totalPrice,
              receiptId // Using reference ID as consultation ID for now
            );
            
            if (setPaymentCompleted) {
              setPaymentCompleted(true);
            }
            
            // Now proceed with booking confirmation
            await handleConfirmBooking();
            
            toast({
              title: "Payment Successful",
              description: "Your payment has been processed successfully.",
              variant: "default"
            });
          } catch (error) {
            console.error("Error processing payment confirmation:", error);
            toast({
              title: "Payment Verification Error",
              description: error instanceof Error ? error.message : "Failed to verify payment",
              variant: "destructive"
            });
          } finally {
            setIsProcessing(false);
          }
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
  }, [state.totalPrice, state.personalDetails, state.selectedServices, toast, setIsProcessing, setOrderId, setPaymentCompleted, setReferenceId, handleConfirmBooking]);

  return {
    proceedToPayment,
    processPayment
  };
}
