
import { loadRazorpayScript, isRazorpayAvailable } from '@/utils/payment/razorpayService';
import { useToast } from '@/hooks/use-toast';

export const useRazorpayInit = () => {
  const { toast } = useToast();
  
  const initializeRazorpay = async () => {
    let razorpayLoaded = isRazorpayAvailable();
    
    if (!razorpayLoaded) {
      console.log("Razorpay not loaded, attempting to load script");
      razorpayLoaded = await loadRazorpayScript();
      
      if (!razorpayLoaded) {
        toast({
          title: "Payment Error",
          description: "Payment gateway failed to load. Please refresh and try again.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };

  return { initializeRazorpay };
};
