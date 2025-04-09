
import { 
  createRazorpayOrder, 
  savePaymentDetails, 
  verifyRazorpayPayment, 
  isRazorpayAvailable, 
  loadRazorpayScript 
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
  
  // Initialize Razorpay payment 
  const initializeRazorpayPayment = async (receiptId: string) => {
    console.log("Starting payment process with amount:", state.totalPrice);
      
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
          if (handleConfirmBooking) {
            await handleConfirmBooking();
          }
          
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
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal dismissed");
          setIsProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
            variant: "default"
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
          description: response.error.description || "Your payment was not successful. Please try again.",
          variant: "destructive"
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
