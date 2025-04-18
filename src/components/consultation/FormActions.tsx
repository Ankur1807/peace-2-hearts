
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isFormValid: boolean;
  isProcessing: boolean;
  totalPrice: number;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isFormValid, 
  isProcessing,
  totalPrice
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
      <div>
        <p className="text-sm text-gray-500">
          By proceeding, you agree to our <a href="/terms" className="text-peacefulBlue hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-peacefulBlue hover:underline">Privacy Policy</a>.
        </p>
      </div>
      <Button 
        type="submit" 
        className="bg-peacefulBlue hover:bg-peacefulBlue/90 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
        disabled={!isFormValid || isProcessing}
      >
        <div className="flex items-center gap-2">
          <span>
            {isProcessing ? 'Processing...' : totalPrice > 0 ? 'Proceed to Payment' : 'Book Consultation'}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </div>
      </Button>
    </div>
  );
};

export default FormActions;
