
import React from 'react';
import OrderSummary from './OrderSummary';
import PaymentActions from './PaymentActions';
import PaymentTerms from './PaymentTerms';
import RazorpayCard from './RazorpayCard';
import PaymentLoader from './PaymentLoader';

interface PaymentStepProps {
  consultationType: string;
  selectedServices?: string[];
  totalPrice: number;
  isProcessing: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  consultationType,
  selectedServices = [],
  totalPrice,
  isProcessing,
  onPrevStep,
  onSubmit
}) => {
  if (isProcessing) {
    return <PaymentLoader />;
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
      />
      
      <RazorpayCard />
      
      <PaymentTerms />
      
      <PaymentActions
        onPrevious={onPrevStep}
        onSubmit={onSubmit}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default PaymentStep;
