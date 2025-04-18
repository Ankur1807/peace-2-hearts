
import React, { useState } from 'react';
import OrderSummary from './OrderSummary';
import PaymentTerms from './PaymentTerms';
import PaymentActions from './PaymentActions';
import PaymentLoader from './PaymentLoader';

type PaymentStepProps = {
  consultationType: string;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  totalPrice: number;
};

const PaymentStep: React.FC<PaymentStepProps> = ({
  consultationType,
  onNextStep,
  onPrevStep,
  onSubmit,
  isProcessing,
  totalPrice
}) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Log price information for debugging
  console.log("PaymentStep received totalPrice:", totalPrice);
  console.log("PaymentStep consultation type:", consultationType);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-lora font-semibold mb-6">Payment Information</h2>
      
      <PaymentLoader 
        onRazorpayLoad={setRazorpayLoaded} 
        onLoadError={setLoadError} 
        loadError={loadError}
      />
      
      <OrderSummary 
        consultationType={consultationType} 
        totalPrice={totalPrice}
      />
      
      <PaymentTerms 
        acceptTerms={acceptTerms}
        setAcceptTerms={setAcceptTerms}
      />
      
      <PaymentActions 
        onPrevStep={onPrevStep}
        isProcessing={isProcessing}
        acceptTerms={acceptTerms}
        razorpayLoaded={razorpayLoaded}
        totalPrice={totalPrice}
      />
      
      {!razorpayLoaded && !loadError && (
        <div className="text-center text-amber-600 text-sm mt-2">
          Payment gateway is loading. Please wait...
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
