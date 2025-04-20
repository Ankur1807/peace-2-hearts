
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface PaymentTermsProps {
  acceptTerms: boolean;
  setAcceptTerms: (checked: boolean) => void;
}

const PaymentTerms: React.FC<PaymentTermsProps> = ({ acceptTerms, setAcceptTerms }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="terms" 
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked === true)}
          className="mt-1"
          required
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{' '}
          <Link to="/terms" target="_blank" className="text-peacefulBlue hover:underline">
            Terms of Service
          </Link>
          ,{' '}
          <Link to="/privacy-policy" target="_blank" className="text-peacefulBlue hover:underline">
            Privacy Policy
          </Link>
          ,{' '}
          <Link to="/cancellation-refund" target="_blank" className="text-peacefulBlue hover:underline">
            Cancellation & Refund Policy
          </Link>
          , and{' '}
          <Link to="/shipping-delivery" target="_blank" className="text-peacefulBlue hover:underline">
            Shipping & Delivery Policy
          </Link>
        </label>
      </div>
      
      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
        <Shield className="h-5 w-5 text-gray-500 mr-3" />
        <p className="text-sm text-gray-600">
          All payment information is encrypted and secure. Your card details are never stored on our servers.
        </p>
      </div>
    </div>
  );
};

export default PaymentTerms;
