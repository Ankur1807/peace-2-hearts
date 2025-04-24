
import React from 'react';
import PaymentStep from './payment/PaymentStep';
import { useEffectivePrice } from '@/hooks/consultation/payment/useEffectivePrice';

interface PaymentStepContainerProps {
  consultationType: string;
  selectedServices: string[];
  processPayment: () => void;
  setShowPaymentStep: (show: boolean) => void;
  handlePaymentSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  pricing: Map<string, number>;
  totalPrice: number;
}

const PaymentStepContainer: React.FC<PaymentStepContainerProps> = ({
  consultationType,
  selectedServices,
  processPayment,
  setShowPaymentStep,
  handlePaymentSubmit,
  isProcessing,
  pricing,
  totalPrice
}) => {
  const getEffectivePrice = useEffectivePrice({
    selectedServices,
    pricing,
    totalPrice
  });
  
  const effectivePrice = getEffectivePrice();
  
  React.useEffect(() => {
    console.log("PaymentStepContainer - Price Info:", {
      consultationType,
      selectedServices: selectedServices.join(','),
      effectivePrice,
      totalPrice,
      hasPricing: !!pricing,
      pricingData: pricing ? Object.fromEntries(pricing) : {}
    });
  }, [consultationType, selectedServices, effectivePrice, pricing, totalPrice]);
  
  return (
    <form onSubmit={(e) => {
      console.log("Payment form submitted");
      handlePaymentSubmit(e);
    }} className="space-y-6">
      <PaymentStep 
        consultationType={consultationType}
        selectedServices={selectedServices}
        onNextStep={processPayment}
        onPrevStep={() => setShowPaymentStep(false)}
        onSubmit={handlePaymentSubmit}
        isProcessing={isProcessing}
        totalPrice={effectivePrice}
        pricing={pricing}
      />
    </form>
  );
};

export default PaymentStepContainer;
