
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/pricing';
import { useEffectivePrice } from '@/hooks/consultation/payment/useEffectivePrice';
import PaymentErrorMessage from './PaymentErrorMessage';

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
  // Get the effective price calculation logic
  const getEffectivePrice = useEffectivePrice({
    selectedServices,
    pricing,
    totalPrice
  });
  
  // Calculate the effective price
  const effectivePrice = getEffectivePrice();
  
  // Ensure we have a valid price - use fallback if needed
  const displayPrice = effectivePrice > 0 ? effectivePrice : 1500;
  
  // Track if price is valid
  const [priceError, setPriceError] = React.useState<string | null>(null);
  
  // Extra debug logging
  React.useEffect(() => {
    console.log("PaymentActions Debug:", {
      selectedServices: selectedServices.join(','),
      pricing: pricing ? Object.fromEntries(pricing) : "N/A",
      totalPrice,
      effectivePrice,
      displayPrice,
      valid: displayPrice > 0
    });
    
    // Update error state
    if (effectivePrice <= 0 && selectedServices.length > 0) {
      setPriceError("Unable to determine price. Using default price for this service.");
    } else {
      setPriceError(null);
    }
  }, [effectivePrice, totalPrice, selectedServices, pricing, displayPrice]);
  
  return (
    <>
      {priceError && <PaymentErrorMessage message={priceError} />}
      
      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevStep}>
          Back
        </Button>
        <Button 
          type="submit" 
          className="bg-peacefulBlue hover:bg-peacefulBlue/90"
          disabled={isProcessing || !acceptTerms || !razorpayLoaded}
          onClick={(e) => {
            console.log(`Payment button clicked with displayPrice: ${displayPrice}`);
            onSubmit(e);
          }}
        >
          {!razorpayLoaded ? "Loading Payment..." : 
           isProcessing ? "Processing..." : 
           `Pay ${formatPrice(displayPrice)}`}
        </Button>
      </div>
    </>
  );
};

export default PaymentActions;
