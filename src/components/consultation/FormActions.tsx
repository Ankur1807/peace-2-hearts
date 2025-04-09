
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/pricing/fetchPricing';

interface FormActionsProps {
  isFormValid: boolean;
  isProcessing: boolean;
  totalPrice: number;
  onSubmit?: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isFormValid, 
  isProcessing, 
  totalPrice, 
  onSubmit 
}) => {
  const buttonText = isProcessing 
    ? "Processing..." 
    : totalPrice > 0 
      ? `Proceed to Payment (${formatPrice(totalPrice)})`
      : "Proceed to Booking";

  const isDisabled = !isFormValid || isProcessing;

  return (
    <div className="pt-6">
      <Button 
        type="submit" 
        className="w-full bg-peacefulBlue hover:bg-peacefulBlue/90"
        disabled={isDisabled}
        onClick={onSubmit}
      >
        {buttonText}
      </Button>
      {totalPrice === 0 && isFormValid && (
        <p className="text-sm text-amber-600 mt-2 text-center">
          Note: Pricing information may be unavailable. You can still proceed with booking.
        </p>
      )}
    </div>
  );
};

export default FormActions;
