
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
    if (totalPrice <= 0) return "Price Not Available";
    return `Pay ${formatPrice(totalPrice)}`;
  };

  // For debugging
  React.useEffect(() => {
    console.log(`PaymentActions rendered with totalPrice: ${totalPrice}, isProcessing: ${isProcessing}, acceptTerms: ${acceptTerms}, razorpayLoaded: ${razorpayLoaded}`);
  }, [totalPrice, isProcessing, acceptTerms, razorpayLoaded]);

  return (
    <div className="pt-6 flex justify-between">
      <Button type="button" variant="outline" onClick={onPrevStep}>
        Back
      </Button>
      <Button 
        type="submit" 
        className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        disabled={isProcessing || !acceptTerms || !razorpayLoaded || totalPrice <= 0}
        onClick={(e) => {
          console.log(`Payment button clicked with totalPrice: ${totalPrice}`);
          onSubmit(e);
        }}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};

export default PaymentActions;
