
import { useCallback } from 'react';

type RazorpayParams = {
  razorpayKey: string;
  orderId: string;
  amount: number;
  receipt: string;
  name: string;
  email: string;
  phone?: string;
  successCallback: (response: any) => void;
  errorCallback: (error: any) => void;
};

export function useProcessPayment() {
  const processPaymentWithRazorpay = useCallback((params: RazorpayParams) => {
    const {
      razorpayKey,
      orderId,
      amount,
      receipt,
      name,
      email,
      phone,
      successCallback,
      errorCallback
    } = params;

    console.log("Setting up Razorpay payment with:", { orderId, amount, receipt });
    
    // Razorpay should be loaded by now via the script
    if (typeof window.Razorpay === 'undefined') {
      console.error("Razorpay is not loaded");
      errorCallback({ description: "Payment gateway is not available. Please refresh the page and try again." });
      return;
    }

    try {
      // Initialize Razorpay options
      const options = {
        key: razorpayKey,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Peace2Hearts",
        description: "Consultation Booking",
        order_id: orderId,
        handler: function (response: any) {
          console.log("Razorpay payment successful:", response);
          successCallback(response);
        },
        prefill: {
          name: name,
          email: email,
          contact: phone || ""
        },
        notes: {
          receipt_id: receipt
        },
        theme: {
          color: "#4F6CF7"
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            errorCallback({ description: "Payment cancelled" });
          }
        }
      };

      console.log("Creating Razorpay instance with options:", options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error opening Razorpay:", error);
      errorCallback({ description: "Failed to open payment gateway" });
    }
  }, []);

  return { processPaymentWithRazorpay };
}

// Add Razorpay to window type
declare global {
  interface Window {
    Razorpay: any;
  }
}
