
import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Script from '@/components/Script';
import { isRazorpayAvailable, loadRazorpayScript } from '@/utils/payment/razorpayService';

type PaymentLoaderProps = {
  onRazorpayLoad?: (loaded: boolean) => void;
  onLoadError?: (error: string | null) => void;
  loadError?: string | null;
};

const PaymentLoader: React.FC<PaymentLoaderProps> = ({ 
  onRazorpayLoad = () => {},
  onLoadError = () => {},
  loadError = null
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAndLoadRazorpay = async () => {
      try {
        // Check if already loaded
        if (isRazorpayAvailable()) {
          console.log("Razorpay already available in window");
          onRazorpayLoad(true);
          setIsLoading(false);
          return;
        }

        // Try to load the script
        const loaded = await loadRazorpayScript();
        console.log("Razorpay script load result:", loaded);
        onRazorpayLoad(loaded);
        
        if (!loaded) {
          onLoadError("Failed to load payment gateway. Please refresh and try again.");
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading Razorpay:", err);
        onLoadError("Error initializing payment gateway. Please refresh and try again.");
        onRazorpayLoad(false);
        setIsLoading(false);
      }
    };

    checkAndLoadRazorpay();
  }, [onRazorpayLoad, onLoadError]);

  return (
    <>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        id="razorpay-script"
        onLoad={() => {
          console.log("Razorpay script loaded via Script component");
          onRazorpayLoad(true);
          onLoadError(null);
        }}
      />
      
      {loadError && (
        <div className="flex items-center p-4 mb-4 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <p className="text-sm text-red-600">
            {loadError}
          </p>
        </div>
      )}
      
      {isLoading && !loadError && (
        <div className="text-center text-amber-600 text-sm mt-2 mb-4">
          Payment gateway is loading. Please wait...
        </div>
      )}
    </>
  );
};

export default PaymentLoader;
