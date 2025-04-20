
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
  // Determine the price to display based on selected services
  let displayPrice = totalPrice;
  
  // If we have a single service selected, use its price from pricing map if available
  if (selectedServices.length === 1 && pricing && pricing.has(selectedServices[0])) {
    displayPrice = pricing.get(selectedServices[0])!;
  }
  
  // Log debug info
  React.useEffect(() => {
    console.log(`PaymentActions: displayPrice=${displayPrice}, totalPrice=${totalPrice}, selectedServices=${selectedServices}`);
  }, [displayPrice, totalPrice, selectedServices]);
  
  return (
    <div className="pt-6 flex justify-between">
      <Button type="button" variant="outline" onClick={onPrevStep}>
        Back
      </Button>
      <Button 
        type="submit" 
        className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        disabled={isProcessing || !acceptTerms || !razorpayLoaded || displayPrice <= 0}
        onClick={onSubmit}
      >
        {!razorpayLoaded ? "Loading Payment..." : 
         isProcessing ? "Processing..." : 
         displayPrice <= 0 ? "Price Not Available" : 
         `Pay ${formatPrice(displayPrice)}`}
      </Button>
    </div>
  );
};

export default PaymentActions;
