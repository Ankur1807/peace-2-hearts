
/**
 * Utility for dynamically loading the Razorpay SDK
 */

// Check if Razorpay is already available in the window
export const isRazorpayAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof (window as any).Razorpay !== 'undefined';
};

// Load the Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isRazorpayAvailable()) {
      console.log("Razorpay already loaded");
      return resolve(true);
    }

    console.log("Loading Razorpay script");
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
      resolve(true);
    };
    
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};
