
import React from 'react';
import PaymentStep from './payment/PaymentStep';

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
}) => (
  <form onSubmit={handlePaymentSubmit} className="space-y-6">
    <PaymentStep 
      consultationType={consultationType}
      selectedServices={selectedServices}
      onNextStep={processPayment}
      onPrevStep={() => setShowPaymentStep(false)}
      onSubmit={handlePaymentSubmit}
      isProcessing={isProcessing}
      totalPrice={totalPrice}
      pricing={pricing}
    />
  </form>
);

export default PaymentStepContainer;
