
import React, { useState } from 'react';
import OrderSummary from './OrderSummary';
import PaymentMethods from './PaymentMethods';
import PaymentActions from './PaymentActions';
import PaymentTerms from './PaymentTerms';
import PaymentLoader from './PaymentLoader';
import { usePaymentValidation } from '@/hooks/consultation/usePaymentValidation';

interface PaymentStepProps {
  consultationType: string;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  totalPrice: number;
  discountAmount?: number;
  originalPrice?: number;
  appliedDiscountCode?: string | null;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ 
  consultationType, 
  onPrevStep, 
  onNextStep,
  onSubmit,
  isProcessing,
  totalPrice,
  discountAmount = 0,
  originalPrice,
  appliedDiscountCode
}) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { razorpayLoaded } = usePaymentValidation();
  const [loadError, setLoadError] = useState<string | null>(null);
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Complete Your Payment</h2>
      
      <OrderSummary 
        consultationType={consultationType} 
        totalPrice={totalPrice}
        discountAmount={discountAmount}
        originalPrice={originalPrice}
        appliedDiscountCode={appliedDiscountCode}
      />
      
      {!razorpayLoaded && (
        <PaymentLoader 
          onRazorpayLoad={(loaded) => {}}
          onLoadError={setLoadError}
          loadError={loadError}
        />
      )}
      
      <PaymentMethods />
      
      <PaymentTerms acceptTerms={acceptTerms} setAcceptTerms={setAcceptTerms} />
      
      <PaymentActions
        onPrevStep={onPrevStep}
        isProcessing={isProcessing}
        acceptTerms={acceptTerms}
        razorpayLoaded={razorpayLoaded}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default PaymentStep;
