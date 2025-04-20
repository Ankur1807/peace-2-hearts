
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/pricing/fetchPricing';

type PaymentActionsProps = {
  onPrevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  acceptTerms: boolean;
  razorpayLoaded: boolean;
  totalPrice: number;
};

const PaymentActions: React.FC<PaymentActionsProps> = ({
  onPrevStep,
  onSubmit,
  isProcessing,
  acceptTerms,
  razorpayLoaded,
  totalPrice
}) => {
  // Generate appropriate button text based on state
  const getButtonText = () => {
    if (!razorpayLoaded) return "Loading Payment...";
    if (isProcessing) return "Processing...";
    return totalPrice > 0 ? `Pay ${formatPrice(totalPrice)}` : "Pay Now";
  };

  return (
    <div className="pt-6 flex justify-between">
      <Button type="button" variant="outline" onClick={onPrevStep}>
        Back
      </Button>
      <Button 
        type="submit" 
        className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        disabled={isProcessing || !acceptTerms || !razorpayLoaded}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};

export default PaymentActions;
