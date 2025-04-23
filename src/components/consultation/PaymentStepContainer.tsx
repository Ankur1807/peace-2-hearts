
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
  totalPrice: number;
  pricing: Map<string, number>;
}

const PaymentStepContainer: React.FC<PaymentStepContainerProps> = ({
  consultationType,
  selectedServices,
  processPayment,
  setShowPaymentStep,
  handlePaymentSubmit,
  isProcessing,
  totalPrice,
  pricing
}) => {
  // Get and calculate the effective price
  const getEffectivePrice = useEffectivePrice({
    selectedServices,
    pricing,
    totalPrice
  });
  
  const effectivePrice = getEffectivePrice();
  
  React.useEffect(() => {
    console.log("PaymentStepContainer - Rendering with:", {
      consultationType,
      selectedServices: selectedServices.join(','),
      totalPrice,
      effectivePrice,
      hasPricing: !!pricing
    });
  }, [consultationType, selectedServices, totalPrice, effectivePrice, pricing]);
  
  return (
    <form onSubmit={handlePaymentSubmit} className="space-y-6">
      <PaymentStep 
        consultationType={consultationType}
        selectedServices={selectedServices}
        onNextStep={processPayment}
        onPrevStep={() => setShowPaymentStep(false)}
        onSubmit={handlePaymentSubmit}
        isProcessing={isProcessing}
        totalPrice={effectivePrice > 0 ? effectivePrice : totalPrice} 
        pricing={pricing}
      />
    </form>
  );
};

export default PaymentStepContainer;
