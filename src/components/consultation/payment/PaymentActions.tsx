
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/pricing';
import { useEffectivePrice } from '@/hooks/consultation/payment/useEffectivePrice';

interface PaymentActionsProps {
  onPrevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  totalPrice: number;
  selectedServices?: string[];
  pricing?: Map<string, number>;
  isProcessing: boolean;
  acceptTerms: boolean;
  razorpayLoaded: boolean;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({
  onPrevStep,
  onSubmit,
  totalPrice,
  selectedServices = [],
  pricing,
  isProcessing,
  acceptTerms,
  razorpayLoaded
}) => {
  const getEffectivePrice = useEffectivePrice({
    selectedServices,
    pricing,
    totalPrice
  });
  
  const effectivePrice = getEffectivePrice();
  
  // Extra debug logging
  React.useEffect(() => {
    console.log("PaymentActions Debug:", {
      selectedServices: selectedServices.join(','),
      pricing: pricing ? Object.fromEntries(pricing) : "N/A",
      totalPrice,
      effectivePrice,
      valid: effectivePrice > 0
    });
  }, [effectivePrice, totalPrice, selectedServices, pricing]);
  
  return (
    <div className="pt-6 flex justify-between">
      <Button type="button" variant="outline" onClick={onPrevStep}>
        Back
      </Button>
      <Button 
        type="submit" 
        className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        disabled={isProcessing || !acceptTerms || !razorpayLoaded || effectivePrice <= 0}
        onClick={(e) => {
          console.log(`Payment button clicked with effectivePrice: ${effectivePrice}`);
          onSubmit(e);
        }}
      >
        {!razorpayLoaded ? "Loading Payment..." : 
         isProcessing ? "Processing..." : 
         effectivePrice <= 0 ? "Price Not Available" : 
         `Pay ${formatPrice(effectivePrice)}`}
      </Button>
    </div>
  );
};

export default PaymentActions;
