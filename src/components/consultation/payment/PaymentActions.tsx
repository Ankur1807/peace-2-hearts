
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/pricing/fetchPricing';

type PaymentActionsProps = {
  onPrevStep: () => void;
  isProcessing: boolean;
  acceptTerms: boolean;
  razorpayLoaded: boolean;
  totalPrice: number;
};

const PaymentActions: React.FC<PaymentActionsProps> = ({
  onPrevStep,
  isProcessing,
  acceptTerms,
  razorpayLoaded,
  totalPrice
}) => {
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
        {!razorpayLoaded ? "Loading Payment..." : isProcessing ? "Processing..." : `Pay ${formatPrice(totalPrice)}`}
      </Button>
    </div>
  );
};

export default PaymentActions;
