
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/pricing/fetchPricing';
import { AlertCircle } from 'lucide-react';

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
        <div className="mt-3 flex items-center gap-2 border border-amber-300 bg-amber-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-600">
            Pricing information is currently unavailable. Please contact support for assistance.
          </p>
        </div>
      )}
    </div>
  );
};

export default FormActions;
