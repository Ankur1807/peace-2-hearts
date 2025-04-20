
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Script from '@/components/Script';
import { loadRazorpayScript, isRazorpayAvailable } from '@/utils/payment/razorpayService';

interface PaymentLoaderProps {
  onRazorpayLoad: (loaded: boolean) => void;
  onLoadError: (error: string | null) => void;
  loadError: string | null;
}

const PaymentLoader: React.FC<PaymentLoaderProps> = ({ 
  onRazorpayLoad,
  onLoadError,
  loadError
}) => {
  useEffect(() => {
    const checkAndLoadRazorpay = async () => {
      try {
        if (isRazorpayAvailable()) {
          console.log("Razorpay already available");
          onRazorpayLoad(true);
          return;
        }
        
        const loaded = await loadRazorpayScript();
        console.log("Razorpay script load result:", loaded);
        onRazorpayLoad(loaded);
        
        if (!loaded) {
          onLoadError("Failed to load payment gateway. Please refresh and try again.");
        }
      } catch (err) {
        console.error("Error loading Razorpay:", err);
        onLoadError("Error initializing payment gateway. Please refresh and try again.");
      }
    };
    
    checkAndLoadRazorpay();
  }, [onRazorpayLoad, onLoadError]);
  
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        id="razorpay-script"
        onLoad={() => {
          console.log("Razorpay script loaded via Script component");
          onRazorpayLoad(true);
          onLoadError(null);
        }}
      />
      
      <div className="flex flex-col items-center space-y-4">
        {loadError ? (
          <>
            <div className="text-red-500 text-center mb-4">
              <p className="font-semibold">{loadError}</p>
              <p className="text-sm mt-1">Please try again or contact support if the issue persists.</p>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="h-12 w-12 text-peacefulBlue animate-spin" />
            <h3 className="text-xl font-semibold text-gray-700">
              Preparing Your Payment
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Please wait while we initialize the secure payment gateway...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentLoader;
