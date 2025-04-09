
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
  return (
    <div className="pt-6">
      <Button 
        type="submit" 
        className="w-full bg-peacefulBlue hover:bg-peacefulBlue/90"
        disabled={!isFormValid || isProcessing || totalPrice <= 0}
        onClick={onSubmit}
      >
        {isProcessing ? "Processing..." : `Proceed to Payment (${formatPrice(totalPrice)})`}
      </Button>
    </div>
  );
};

export default FormActions;
