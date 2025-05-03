
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
  totalPrice?: number;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({
  onPrevStep,
  onSubmit,
  selectedServices = [],
  pricing,
  isProcessing,
  acceptTerms,
  razorpayLoaded,
  totalPrice
}) => {
  const getEffectivePrice = useEffectivePrice({
    selectedServices,
    pricing,
    totalPrice
  });
  
  const effectivePrice = getEffectivePrice();
  
  // Debug pricing information passed to Razorpay
  React.useEffect(() => {
    console.log("[PRICE DEBUG] PaymentActions - Price Info:", {
      selectedServices: selectedServices.join(', '),
      effectivePrice,
      totalPrice,
      pricingMap: pricing ? Object.fromEntries(pricing) : 'none'
    });
    
    // Check specific package prices
    if (selectedServices.includes('divorce-prevention') && pricing) {
      console.log('[PRICE DEBUG] PaymentActions divorce-prevention price:', pricing.get('divorce-prevention'));
    }
    if (selectedServices.includes('pre-marriage-clarity') && pricing) {
      console.log('[PRICE DEBUG] PaymentActions pre-marriage-clarity price:', pricing.get('pre-marriage-clarity'));
    }
    
    console.log('[PRICE DEBUG] PaymentActions FINAL PRICE TO RAZORPAY:', effectivePrice);
  }, [selectedServices, effectivePrice, pricing, totalPrice]);

  const canProceed = razorpayLoaded && acceptTerms && effectivePrice > 0;
  
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
          console.log(`[PRICE DEBUG] Payment button clicked with price: ${effectivePrice}`);
          onSubmit(e);
        }}
      >
        {!razorpayLoaded ? "Loading Payment..." : 
         isProcessing ? "Processing..." : 
         !effectivePrice ? "Select a service" :
         `Pay ${formatPrice(effectivePrice)}`}
      </Button>
    </div>
  );
};

export default PaymentActions;
