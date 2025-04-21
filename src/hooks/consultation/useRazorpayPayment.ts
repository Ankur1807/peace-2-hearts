
import { 
  createRazorpayOrder, 
  savePaymentDetails, 
  verifyRazorpayPayment, 
  isRazorpayAvailable, 
  loadRazorpayScript,
  type SavePaymentParams
} from '@/utils/payment/razorpayService';
import { generateReferenceId } from '@/utils/referenceGenerator';

interface RazorpayPaymentProps {
  state: any;
  toast: any;
  setIsProcessing: (isProcessing: boolean) => void;
  setOrderId?: (id: string | null) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  setReferenceId?: (id: string) => void;
  handleConfirmBooking?: () => Promise<void>;
}

export function useRazorpayPayment({
  state,
  toast,
  setIsProcessing,
  setOrderId,
  setPaymentCompleted,
  setReferenceId,
  handleConfirmBooking
}: RazorpayPaymentProps) {
  
  // Helper function to calculate the actual amount to charge
  const getEffectivePrice = () => {
    if (!state.selectedServices || state.selectedServices.length === 0 || !state.pricing) {
      return state.totalPrice;
    }
    
    // First check if we have a direct service price
    if (state.selectedServices.length === 1) {
      const serviceId = state.selectedServices[0];
      
      if (state.pricing.has(serviceId)) {
        const price = state.pricing.get(serviceId);
        if (price && price > 0) {
          console.log(`Using direct price for ${serviceId}: ${price}`);
          return price;
        }
      }
    }
    
    // If we don't have a direct price, use totalPrice
    return state.totalPrice > 0 ? state.totalPrice : 0;
  };
  
  // Initialize Razorpay payment 
  const initializeRazorpayPayment = async (receiptId: string) => {
    // Get the effective price to use for payment
    const effectivePrice = getEffectivePrice();
    console.log("Starting payment process with amount:", effectivePrice);
    
    if (effectivePrice <= 0) {
      throw new Error("Cannot process payment with zero or negative amount");
    }
      
    // Create an order through our edge function
    const orderResponse = await createRazorpayOrder({
      amount: effectivePrice,
      receipt: receiptId,
      notes: {
        services: state.selectedServices.join(','),
        client: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`
      }
    });
    
    if (!orderResponse.success || !orderResponse.order) {
      throw new Error(orderResponse.error || 'Failed to create order');
    }
    
    const { order, key_id } = orderResponse;
    console.log("Order created successfully:", order);
    
    if (setOrderId) {
      setOrderId(order.id);
    }
    
    // Use key from response or fallback to test key
    const razorpayKey = key_id || "rzp_test_C4wVqKJiq5fXgj";
    
    console.log("Initializing Razorpay with key:", razorpayKey);
    
    return { order, razorpayKey };
  };
  
  // Configure and open Razorpay payment modal
  const openRazorpayCheckout = (order: any, razorpayKey: string, receiptId: string) => {
    // Get the effective price for display
    const effectivePrice = getEffectivePrice();
    
    // Initialize Razorpay
    const options = {
      key: razorpayKey,
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "Peace2Hearts",
      description: `Payment for consultation services`,
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
          const paymentParams: SavePaymentParams = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: effectivePrice, // Use the effective price here
            consultationId: receiptId // Using reference ID as consultation ID for now
          };
          
          await savePaymentDetails(paymentParams);
          
          if (setPaymentCompleted) {
            setPaymentCompleted(true);
          }
          
          // Now proceed with booking confirmation
          if (handleConfirmBooking) {
            await handleConfirmBooking();
          }
          
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully."
          });
        } catch (error) {
          console.error("Error processing payment confirmation:", error);
          toast({
            title: "Payment Verification Error",
            description: error instanceof Error ? error.message : "Failed to verify payment"
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
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal dismissed");
          setIsProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process."
          });
        }
      }
    };
    
    try {
      // Initialize and open Razorpay
      const razorpay = new window.Razorpay(options);
      
      // Handle errors from Razorpay
      razorpay.on('payment.failed', function(response: any) {
        console.error("Payment failed:", response.error);
        toast({
          title: "Payment Failed",
          description: response.error.description || "Your payment was not successful. Please try again."
        });
        setIsProcessing(false);
      });
      
      console.log("Opening Razorpay payment modal");
      razorpay.open();
    } catch (err) {
      console.error("Error initializing Razorpay:", err);
      throw new Error("Failed to initialize payment gateway");
    }
  };
  
  return {
    initializeRazorpayPayment,
    openRazorpayCheckout
  };
}
