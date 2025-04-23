
import React from 'react';
import OrderSummary from './OrderSummary';
import PaymentActions from './PaymentActions';
import PaymentTerms from './PaymentTerms';
import RazorpayCard from './RazorpayCard';
import PaymentLoader from './PaymentLoader';
import PaymentHeader from './PaymentHeader';
import PaymentErrorMessage from './PaymentErrorMessage';
import { usePaymentHandler } from '@/hooks/payment/usePaymentHandler';
import { getPackageName } from '@/utils/consultation/packageUtils';
import Script from '@/components/Script';

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
  const [acceptTerms, setAcceptTerms] = React.useState<boolean>(false);
  
  const { razorpayLoaded, loadError } = usePaymentHandler({
    onRazorpayLoad: (loaded) => {
      console.log("Razorpay loaded state set to:", loaded);
    },
    onLoadError: (error) => {
      console.log("Load error set to:", error);
    }
  });

  // Special case for test service - always use fixed price
  const isTestService = selectedServices.includes('test-service');
  const TEST_SERVICE_PRICE = 11; // Fixed price for test service
  
  // Always use the test price for test service regardless of what's in the pricing map
  const actualPrice = isTestService ? TEST_SERVICE_PRICE : totalPrice;

  // For debugging
  React.useEffect(() => {
    console.log(`PaymentStep - isTestService: ${isTestService}`);
    console.log(`PaymentStep - fixed test price: ${TEST_SERVICE_PRICE}`);
    console.log(`PaymentStep - actualPrice: ${actualPrice}`);
    console.log(`PaymentStep - totalPrice: ${totalPrice}`);
    console.log(`PaymentStep - Selected services: ${selectedServices.join(', ')}`);
  }, [isTestService, actualPrice, totalPrice, selectedServices]);

  if (isProcessing) {
    return <PaymentLoader 
      onRazorpayLoad={(loaded) => console.log("Razorpay loaded:", loaded)} 
      onLoadError={(error) => console.log("Load error:", error)}
      loadError={loadError}
    />;
  }

  return (
    <div className="space-y-6">
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        id="razorpay-script"
        onLoad={() => console.log("Razorpay script loaded via Script component")}
      />
      
      <PaymentHeader />
      
      <OrderSummary 
        consultationType={consultationType} 
        totalPrice={actualPrice}
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
        totalPrice={actualPrice}
        selectedServices={selectedServices}
        pricing={pricing}
        isProcessing={isProcessing}
        acceptTerms={acceptTerms}
        razorpayLoaded={razorpayLoaded}
      />

      {!isTestService && actualPrice <= 0 && (
        <PaymentErrorMessage message="Unable to calculate price. Please try selecting your services again or contact support." />
      )}
      
      {!razorpayLoaded && !loadError && (
        <PaymentErrorMessage message="Payment gateway is loading. Please wait..." />
      )}
    </div>
  );
};

export default PaymentStep;
