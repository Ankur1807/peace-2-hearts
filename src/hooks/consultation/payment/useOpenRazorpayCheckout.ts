
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
        try {
          const isVerified = await verifyRazorpayPayment({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
          
          console.log("Payment verification result:", isVerified);
          
          // Always try to save payment details regardless of verification result
          // This ensures we have a record of the payment attempt
          const paymentParams: SavePaymentParams = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: effectivePrice,
            consultationId: receiptId,
          };
          
          console.log("Payment parameters for saving:", paymentParams);
          
          const saveResult = await savePaymentDetails(paymentParams);
          console.log("Payment save result:", saveResult);
          
          if (!saveResult) {
            console.warn("Failed to save payment details to database directly. Will redirect to confirmation page for recovery");
          }
          
          // If payment is verified and data was saved successfully, continue with booking
          if (isVerified && saveResult) {
            if (setPaymentCompleted) setPaymentCompleted(true);
            if (setReferenceId) setReferenceId(receiptId);
            if (handleConfirmBooking) await handleConfirmBooking();
            
            toast({
              title: "Payment Successful",
              description: "Your payment has been processed successfully.",
            });
          } else {
            // If verification or saving fails, redirect to payment confirmation page
            // with all the data needed to recover
            navigate("/payment-confirmation", {
              state: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: effectivePrice,
                referenceId: receiptId
              }
            });
            
            if (!isVerified) {
              console.warn("Payment verification failed, redirecting to confirmation page");
              toast({
                title: "Payment Verification",
                description: "Your payment is being processed. Please wait for confirmation.",
              });
            }
          }
        } catch (error) {
          console.error("Error processing payment confirmation:", error);
          toast({
            title: "Payment Processing",
            description: "We received your payment but need to verify it. Please check the confirmation page.",
          });
          
          // Redirect to payment confirmation page with available information
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
        
        // Even if payment fails in Razorpay UI, we will redirect to confirmation
        // page with payment ID to check if payment was actually successful
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
          title: "Payment Status",
          description: response.error.description || "Your payment status is being verified. If paid, you will see confirmation soon.",
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
