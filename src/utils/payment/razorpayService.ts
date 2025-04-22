
/**
 * Utility functions for Razorpay integration
 */

// Check if Razorpay script is already loaded
export const isRazorpayAvailable = (): boolean => {
  return typeof window !== 'undefined' && window.Razorpay !== undefined;
};

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isRazorpayAvailable()) {
      console.log('Razorpay is already loaded');
      resolve(true);
      return;
    }

    console.log('Attempting to load Razorpay script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

// Initialize Razorpay checkout
export const initRazorpayCheckout = (options: any) => {
  if (!isRazorpayAvailable()) {
    console.error('Razorpay not loaded');
    return null;
  }
  
  try {
    return new window.Razorpay(options);
  } catch (error) {
    console.error('Failed to initialize Razorpay:', error);
    return null;
  }
};
