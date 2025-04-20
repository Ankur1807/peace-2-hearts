
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

  // Check if we have a single service selection and update the price to use
  const [effectivePrice, setEffectivePrice] = React.useState<number>(totalPrice);
  
  React.useEffect(() => {
    let newPrice = totalPrice;
    
    // If we have a single service selected
    if (selectedServices.length === 1 && pricing) {
      const serviceId = selectedServices[0];
      
      // Check if it's a direct package ID
      if (serviceId === 'divorce-prevention' || serviceId === 'pre-marriage-clarity') {
        const packagePrice = pricing.get(serviceId);
        if (packagePrice && packagePrice > 0) {
          console.log(`Using direct package price for ${serviceId}: ${packagePrice}`);
          newPrice = packagePrice;
        }
      } 
      // Check if it's a regular service
      else if (pricing.has(serviceId)) {
        const servicePrice = pricing.get(serviceId);
        if (servicePrice && servicePrice > 0) {
          console.log(`Using service price for ${serviceId}: ${servicePrice}`);
          newPrice = servicePrice;
        }
      }
    }
    
    // Check if services match a package
    const packageName = getPackageName(selectedServices);
    if (packageName && pricing) {
      const packageId = packageName === "Divorce Prevention Package" 
        ? 'divorce-prevention' 
        : 'pre-marriage-clarity';
      const packagePrice = pricing.get(packageId);
      if (packagePrice && packagePrice > 0) {
        console.log(`Using package price for ${packageName}: ${packagePrice}`);
        newPrice = packagePrice;
      }
    }
    
    if (newPrice !== effectivePrice) {
      console.log(`Updating effective price from ${effectivePrice} to ${newPrice}`);
      setEffectivePrice(newPrice);
    }
  }, [selectedServices, pricing, totalPrice, effectivePrice]);

  // For debugging
  React.useEffect(() => {
    if (selectedServices && selectedServices.length > 0) {
      const serviceId = selectedServices[0];
      const servicePrice = pricing?.get(serviceId);
      console.log(`Selected service: ${serviceId}, price from map: ${servicePrice || 'not found'}`);
      
      // Check if it's a package ID directly
      if (serviceId === 'divorce-prevention' || serviceId === 'pre-marriage-clarity') {
        const packagePrice = pricing?.get(serviceId) || 0;
        console.log(`Direct package selection: ${serviceId}, price: ${packagePrice}`);
      } else {
        // Check if the services match a package
        const packageName = getPackageName(selectedServices);
        if (packageName) {
          const packageId = packageName === "Divorce Prevention Package" 
            ? 'divorce-prevention' 
            : 'pre-marriage-clarity';
          console.log(`Package from services: ${packageName}, id: ${packageId}, price: ${pricing?.get(packageId) || 'not found'}`);
        }
      }
    }
    
    console.log(`PaymentStep component with totalPrice: ${totalPrice}, effectivePrice: ${effectivePrice}`);
    if (pricing) {
      console.log('Available pricing:', Object.fromEntries(pricing));
    }
  }, [totalPrice, pricing, selectedServices, effectivePrice]);

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
        totalPrice={effectivePrice}
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
        totalPrice={effectivePrice}
        selectedServices={selectedServices}
        pricing={pricing}
        isProcessing={isProcessing}
        acceptTerms={acceptTerms}
        razorpayLoaded={razorpayLoaded}
      />

      {effectivePrice <= 0 && (
        <PaymentErrorMessage message="Unable to calculate price. Please try selecting your services again or contact support." />
      )}
      
      {!razorpayLoaded && !loadError && (
        <PaymentErrorMessage message="Payment gateway is loading. Please wait..." />
      )}
    </div>
  );
};

export default PaymentStep;
