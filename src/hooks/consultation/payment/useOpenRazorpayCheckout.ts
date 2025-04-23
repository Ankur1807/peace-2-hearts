
import { verifyRazorpayPayment, savePaymentDetails, SavePaymentParams } from '@/utils/payment/razorpayService';

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
  handleConfirmBooking,
  toast,
}: OpenRazorpayCheckoutArgs) => {
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
          if (!isVerified) throw new Error("Payment verification failed");
          const paymentParams: SavePaymentParams = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: effectivePrice,
            consultationId: receiptId,
          };
          await savePaymentDetails(paymentParams);
          if (setPaymentCompleted) setPaymentCompleted(true);
          if (handleConfirmBooking) await handleConfirmBooking();
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully.",
          });
        } catch (error) {
          console.error("Error processing payment confirmation:", error);
          toast({
            title: "Payment Verification Error",
            description: error instanceof Error ? error.message : "Failed to verify payment",
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
        toast({
          title: "Payment Failed",
          description: response.error.description || "Your payment was not successful. Please try again.",
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
};
