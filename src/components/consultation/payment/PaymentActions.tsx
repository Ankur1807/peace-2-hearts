
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/pricing/fetchPricing';

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
  // Get the effective price for this service
  const [effectivePrice, setEffectivePrice] = React.useState<number>(totalPrice);
  
  // Calculate the actual price to display and use for payment
  React.useEffect(() => {
    // Check if test service is selected - always use hardcoded price 11
    if (selectedServices.includes('test-service')) {
      console.log('PaymentActions: Using hardcoded price 11 for test-service');
      setEffectivePrice(11);
      return;
    }
    
    let price = totalPrice;
    
    if (selectedServices.length === 1 && pricing) {
      const serviceId = selectedServices[0];
      
      if (pricing.has(serviceId)) {
        price = pricing.get(serviceId) || price;
        console.log(`PaymentActions: Using price ${price} for service ${serviceId}`);
      }
    }
    
    if (price !== effectivePrice) {
      console.log(`PaymentActions: Updating effective price from ${effectivePrice} to ${price}`);
      setEffectivePrice(price);
    }
  }, [totalPrice, selectedServices, pricing, effectivePrice]);
  
  // Log debug info
  React.useEffect(() => {
    console.log(`PaymentActions: effectivePrice=${effectivePrice}, totalPrice=${totalPrice}, selectedServices=${selectedServices}`);
    if (pricing) {
      console.log(`PaymentActions: Available pricing:`, Object.fromEntries(pricing));
    }
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
        onClick={onSubmit}
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
