import { verifyRazorpayPayment, savePaymentDetails, SavePaymentParams } from '@/utils/payment/razorpayService';
import { useNavigate } from 'react-router-dom';

interface OpenRazorpayCheckoutArgs {
  getEffectivePrice: () => number;
  state: any;
  setIsProcessing: (processing: boolean) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  setReferenceId?: (id: string) => void;
  handleConfirmBooking?: () => Promise<void>;
  toast: any;
}

export const useOpenRazorpayCheckout = ({
  getEffectivePrice,
  state,
  setIsProcessing,
  setPaymentCompleted,
  setReferenceId,
  handleConfirmBooking,
  toast,
}: OpenRazorpayCheckoutArgs) => {
  const navigate = useNavigate();
  
  return (order: any, razorpayKey: string, receiptId: string) => {
    const effectivePrice = getEffectivePrice();
    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: "Peace2Hearts",
      description: `Payment for consultation services`,
      order_id: order.id,
      handler: async function (response: any) {
        console.log("Payment successful:", response);
        
        // Navigate to payment verification immediately after Razorpay closes
        navigate("/payment-verification", {
          state: {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: effectivePrice,
            receiptId: receiptId
          }
        });
        
        try {
          const isVerified = await verifyRazorpayPayment({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
          
          console.log("Payment verification result:", isVerified);
          
          const paymentParams: SavePaymentParams = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: effectivePrice,
            consultationId: receiptId,
          };
          
          console.log("Payment parameters for saving:", paymentParams);
          
          const saveResult = await savePaymentDetails(paymentParams);
          console.log("Payment save result:", saveResult);
          
          // Redirect to final confirmation page after verification
          navigate("/payment-confirmation", {
            state: {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: effectivePrice,
              referenceId: receiptId
            }
          });
          
        } catch (error) {
          console.error("Error processing payment confirmation:", error);
          navigate("/payment-confirmation", {
            state: {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: effectivePrice,
              referenceId: receiptId
            }
          });
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
        email: state.personalDetails.email,
        contact: state.personalDetails.phone,
      },
      notes: {
        services: state.selectedServices.join(','),
        consultationId: receiptId,
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
          console.log("Payment modal dismissed");
          setIsProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
          });
        },
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        
        if (response.error && response.error.metadata && response.error.metadata.payment_id) {
          navigate("/payment-confirmation", {
            state: {
              paymentId: response.error.metadata.payment_id,
              orderId: order.id,
              amount: effectivePrice,
              referenceId: receiptId
            }
          });
        }
        
        toast({
          title: "Payment Failed",
          description: response.error.description || "Your payment could not be processed. Please try again.",
        });
        setIsProcessing(false);
      });
      
      console.log("Opening Razorpay payment modal with options:", {
        key: options.key,
        orderId: options.order_id,
        amount: options.amount,
        currency: options.currency,
      });
      razorpay.open();
    } catch (err) {
      console.error("Error initializing Razorpay:", err);
      setIsProcessing(false);
      throw new Error("Failed to initialize payment gateway");
    }
  };
};
