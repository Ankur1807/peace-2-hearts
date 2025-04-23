
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
  // Check if we're dealing with test service - this should be the first check
  const isTestService = selectedServices.includes('test-service');
  const TEST_SERVICE_PRICE = 11; // Fixed price for test service
  
  // Set the effective price - hardcode for test service
  const effectivePrice = isTestService ? TEST_SERVICE_PRICE : totalPrice;
  
  // Extra debug logging
  React.useEffect(() => {
    console.log(`PaymentActions Debug - isTestService: ${isTestService}`);
    console.log(`PaymentActions Debug - fixed test price: ${TEST_SERVICE_PRICE}`);
    console.log(`PaymentActions Debug - effectivePrice: ${effectivePrice}`);
    console.log(`PaymentActions Debug - totalPrice: ${totalPrice}`);
    console.log(`PaymentActions Debug - selectedServices: ${selectedServices.join(',')}`);
  }, [isTestService, effectivePrice, totalPrice, selectedServices]);
  
  return (
    <div className="pt-6 flex justify-between">
      <Button type="button" variant="outline" onClick={onPrevStep}>
        Back
      </Button>
      <Button 
        type="submit" 
        className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        disabled={isProcessing || !acceptTerms || !razorpayLoaded || (!isTestService && effectivePrice <= 0)}
        onClick={(e) => {
          console.log(`Payment button clicked with effectivePrice: ${effectivePrice}, isTestService: ${isTestService}`);
          onSubmit(e);
        }}
      >
        {!razorpayLoaded ? "Loading Payment..." : 
         isProcessing ? "Processing..." : 
         !isTestService && effectivePrice <= 0 ? "Price Not Available" : 
         `Pay ${formatPrice(isTestService ? TEST_SERVICE_PRICE : effectivePrice)}`}
      </Button>
    </div>
  );
};

export default PaymentActions;
