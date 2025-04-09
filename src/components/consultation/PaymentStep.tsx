
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { formatCardNumber, formatExpiryDate } from '@/utils/formatUtils';
import { formatPrice } from '@/utils/pricing/fetchPricing';

type PaymentStepProps = {
  consultationType: string;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  totalPrice: number;
};

const PaymentStep = ({
  consultationType,
  onNextStep,
  onPrevStep,
  onSubmit,
  isProcessing,
  totalPrice
}: PaymentStepProps) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else if (typeof window !== 'undefined' && (window as any).Razorpay) {
      setRazorpayLoaded(true);
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-lora font-semibold mb-6">Payment Information</h2>
      
      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>{consultationType.includes(',') ? 'Multiple Services' : getConsultationTypeLabel(consultationType)}</span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>
            <div className="text-sm text-gray-600">60-minute consultation</div>
          </div>
        </div>
        
        <div className="border-t border-b py-4 mb-6">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
      
      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevStep}>
          Back
        </Button>
        <Button 
          type="submit" 
          className="bg-peacefulBlue hover:bg-peacefulBlue/90"
          disabled={isProcessing || !acceptTerms || !razorpayLoaded}
        >
          {isProcessing ? "Processing..." : `Pay ${formatPrice(totalPrice)}`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
