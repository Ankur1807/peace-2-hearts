
import React, { useState } from 'react';
import OrderSummary from './OrderSummary';
import PaymentActions from './PaymentActions';
import PaymentTerms from './PaymentTerms';
import RazorpayCard from './RazorpayCard';
import PaymentLoader from './PaymentLoader';

interface PaymentStepProps {
  consultationType: string;
  selectedServices?: string[];
  totalPrice: number;
  pricing?: Map<string, number>;
  isProcessing: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  consultationType,
  selectedServices = [],
  totalPrice,
  pricing,
  isProcessing,
  onPrevStep,
  onSubmit
}) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  
  const handleRazorpayLoad = (loaded: boolean) => {
    setRazorpayLoaded(loaded);
    console.log("Razorpay loaded state set to:", loaded);
  };
  
  const handleLoadError = (error: string | null) => {
    setLoadError(error);
    console.log("Load error set to:", error);
  };

  // For debugging
  React.useEffect(() => {
    console.log(`PaymentStep component totalPrice: ${totalPrice}`);
    console.log(`PaymentStep pricing data:`, pricing ? Object.fromEntries(pricing) : 'No pricing data');
    
    // Check if we have package pricing
    if (selectedServices && selectedServices.length > 0) {
      const packageName = getPackageName(selectedServices);
      if (packageName) {
        const packageId = packageName === "Divorce Prevention Package" 
          ? 'divorce-prevention' 
          : 'pre-marriage-clarity';
        console.log(`PaymentStep package: ${packageName}, packageId: ${packageId}, price: ${pricing?.get(packageId) || 'not found'}`);
      }
    }
  }, [totalPrice, pricing, selectedServices]);

  if (isProcessing) {
    return <PaymentLoader 
      onRazorpayLoad={handleRazorpayLoad} 
      onLoadError={handleLoadError}
      loadError={loadError}
    />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">Complete Your Payment</h2>
        <p className="text-gray-600">
          You're almost done! Please review your order and complete the payment.
        </p>
      </div>
      
      <OrderSummary 
        consultationType={consultationType} 
        totalPrice={totalPrice}
        selectedServices={selectedServices}
        pricing={pricing}
      />
      
      <RazorpayCard />
      
      <PaymentTerms 
        acceptTerms={acceptTerms}
        setAcceptTerms={setAcceptTerms}
      />
      
      <PaymentActions
        onPrevStep={onPrevStep}
        onSubmit={onSubmit}
        totalPrice={totalPrice}
        isProcessing={isProcessing}
        acceptTerms={acceptTerms}
        razorpayLoaded={razorpayLoaded}
      />

      {totalPrice <= 0 && (
        <div className="text-center text-amber-600 text-sm mt-2">
          Unable to calculate price. Please try selecting your services again or contact support.
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
