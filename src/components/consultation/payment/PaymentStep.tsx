
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

  // Determine the actual price to use based on selected services
  const [actualPrice, setActualPrice] = React.useState<number>(totalPrice);
  
  React.useEffect(() => {
    // Special case for test service - highest priority
    if (selectedServices.includes('test-service')) {
      console.log('PaymentStep: Test service selected, setting fixed price of 11');
      if (actualPrice !== 11) {
        setActualPrice(11);
      }
      return;
    }

    let finalPrice = totalPrice;

    // If we have a single service selected and a pricing map
    if (selectedServices.length === 1 && pricing) {
      const serviceId = selectedServices[0];
      
      // Check if it's a package ID directly
      if ((serviceId === 'divorce-prevention' || serviceId === 'pre-marriage-clarity') && pricing.has(serviceId)) {
        finalPrice = pricing.get(serviceId) || finalPrice;
        console.log(`PaymentStep: Using package price for ${serviceId}: ${finalPrice}`);
      } 
      // Check if it's a regular service
      else if (pricing.has(serviceId)) {
        finalPrice = pricing.get(serviceId) || finalPrice;
        console.log(`PaymentStep: Using service price for ${serviceId}: ${finalPrice}`);
      }
    }
    
    // Check if services match a package
    const packageName = getPackageName(selectedServices);
    if (packageName && pricing && !selectedServices.includes('test-service')) {
      const packageId = packageName === "Divorce Prevention Package" 
        ? 'divorce-prevention' 
        : 'pre-marriage-clarity';
      
      if (pricing.has(packageId)) {
        finalPrice = pricing.get(packageId) || finalPrice;
        console.log(`PaymentStep: Using package price for ${packageName} (${packageId}): ${finalPrice}`);
      }
    }
    
    // Only update if the price has actually changed
    if (finalPrice !== actualPrice) {
      console.log(`PaymentStep: Updating actual price from ${actualPrice} to ${finalPrice}`);
      setActualPrice(finalPrice);
    }
  }, [selectedServices, pricing, totalPrice, actualPrice]);

  // For debugging
  React.useEffect(() => {
    console.log(`PaymentStep - totalPrice: ${totalPrice}, actualPrice: ${actualPrice}`);
    console.log(`PaymentStep - Selected services: ${selectedServices.join(', ')}`);
    console.log(`PaymentStep - Is test service: ${selectedServices.includes('test-service')}`);
    
    if (pricing) {
      console.log('PaymentStep - Available pricing:', Object.fromEntries(pricing));
    }
  }, [totalPrice, actualPrice, selectedServices, pricing]);

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

      {actualPrice <= 0 && (
        <PaymentErrorMessage message="Unable to calculate price. Please try selecting your services again or contact support." />
      )}
      
      {!razorpayLoaded && !loadError && (
        <PaymentErrorMessage message="Payment gateway is loading. Please wait..." />
      )}
    </div>
  );
};

export default PaymentStep;
