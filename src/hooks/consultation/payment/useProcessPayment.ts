
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: any) => void;
}

interface ProcessPaymentProps {
  razorpayKey: string;
  orderId: string;
  amount: number;
  receipt: string;
  name: string;
  email: string;
  phone?: string;
  successCallback: (response: any) => void;
  errorCallback: (error: any) => void;
}

export const useProcessPayment = () => {
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }
      
      // Check if Razorpay is already loaded
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      
      // Load the script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      
      document.body.appendChild(script);
    });
  };
  
  const processPaymentWithRazorpay = async (props: ProcessPaymentProps) => {
    try {
      // Ensure Razorpay script is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay checkout script');
      }
      
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
      } = props;
      
      // Prepare Razorpay options
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Peace2Hearts',
        description: `Consultation Booking: ${receipt}`,
        order_id: orderId,
        prefill: {
          name: name,
          email: email,
          contact: phone
        },
        notes: {
          reference_id: receipt
        },
        theme: {
          color: '#4f6cf7'
        },
        handler: successCallback
      };
      
      // Create and open Razorpay checkout
      const razorpay = new (window as any).Razorpay(options);
      
      // Set up error handler
      razorpay.on('payment.failed', errorCallback);
      
      // Open the checkout
      razorpay.open();
    } catch (error) {
      console.error('Error processing payment:', error);
      props.errorCallback({
        description: error instanceof Error ? error.message : 'Failed to process payment'
      });
    }
  };
  
  return { processPaymentWithRazorpay };
};
