
import { useState, useEffect } from 'react';
import { loadRazorpayScript, isRazorpayAvailable } from '@/utils/payment/razorpayService';
import { useToast } from '@/hooks/use-toast';

interface UsePaymentHandlerProps {
  onRazorpayLoad: (loaded: boolean) => void;
  onLoadError: (error: string | null) => void;
}

export const usePaymentHandler = ({ onRazorpayLoad, onLoadError }: UsePaymentHandlerProps) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAndLoadRazorpay = async () => {
      try {
        if (isRazorpayAvailable()) {
          console.log("Razorpay already available");
          setRazorpayLoaded(true);
          onRazorpayLoad(true);
          return;
        }

        const loaded = await loadRazorpayScript();
        console.log("Razorpay script load result:", loaded);
        setRazorpayLoaded(loaded);
        onRazorpayLoad(loaded);

        if (!loaded) {
          const error = "Failed to load payment gateway. Please refresh and try again.";
          setLoadError(error);
          onLoadError(error);
        }
      } catch (err) {
        console.error("Error loading Razorpay:", err);
        const error = "Error initializing payment gateway. Please refresh and try again.";
        setLoadError(error);
        onLoadError(error);
        setRazorpayLoaded(false);
      }
    };

    checkAndLoadRazorpay();
  }, [onRazorpayLoad, onLoadError]);

  return {
    razorpayLoaded,
    loadError
  };
};
