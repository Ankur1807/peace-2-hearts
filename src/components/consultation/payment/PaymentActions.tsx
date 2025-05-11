
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/pricing';
import { useEffectivePrice } from '@/hooks/consultation/payment/useEffectivePrice';

interface PaymentActionsProps {
  onPrevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedServices?: string[];
  pricing?: Map<string, number>;
  isProcessing: boolean;
  acceptTerms: boolean;
  razorpayLoaded: boolean;
  totalPrice?: number; // Added totalPrice prop
}

const PaymentActions: React.FC<PaymentActionsProps> = ({
  onPrevStep,
  onSubmit,
  selectedServices = [],
  pricing,
  isProcessing,
  acceptTerms,
  razorpayLoaded,
  totalPrice // Use the prop
}) => {
  const getEffectivePrice = useEffectivePrice({
    selectedServices,
    pricing,
    totalPrice // Pass to the hook
  });
  
  const effectivePrice = getEffectivePrice();
  
  React.useEffect(() => {
    console.log("PaymentActions - Price Info:", {
      selectedServices: selectedServices.join(','),
      effectivePrice: effectivePrice(),
      totalPrice,
      pricingAvailable: pricing ? Object.fromEntries(pricing) : 'none'
    });
  }, [selectedServices, effectivePrice, pricing, totalPrice]);

  const canProceed = razorpayLoaded && acceptTerms && effectivePrice() > 0;
  
  return (
    <div className="pt-6 flex justify-between">
      <Button type="button" variant="outline" onClick={onPrevStep}>
        Back
      </Button>
      <Button 
        type="submit" 
        className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        disabled={isProcessing || !canProceed}
        onClick={(e) => {
          console.log(`Payment button clicked with price: ${effectivePrice()}`);
          onSubmit(e);
        }}
      >
        {!razorpayLoaded ? "Loading Payment..." : 
         isProcessing ? "Processing..." : 
         !effectivePrice() ? "Select a service" :
         `Pay ${formatPrice(effectivePrice())}`}
      </Button>
    </div>
  );
};

export default PaymentActions;
