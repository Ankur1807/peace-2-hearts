
import React from 'react';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { getPackageName } from '@/utils/consultation/packageUtils';
import OrderAmount from './OrderAmount';
import ServiceDuration from './ServiceDuration';
import { useEffectivePrice } from '@/hooks/consultation/payment/useEffectivePrice';

type OrderSummaryProps = {
  consultationType: string;
  selectedServices?: string[];
  pricing?: Map<string, number>;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  consultationType, 
  selectedServices = [],
  pricing
}) => {
  const getConsultationLabel = () => {
    const packageName = selectedServices.length > 0 
      ? getPackageName(selectedServices) 
      : null;
    
    return packageName || 
      (selectedServices.length > 0 
        ? getConsultationTypeLabel(selectedServices[0]) 
        : 'Consultation');
  };

  const getEffectivePrice = useEffectivePrice({
    selectedServices,
    pricing
  });

  const consultationLabel = getConsultationLabel();
  const effectivePrice = getEffectivePrice();

  React.useEffect(() => {
    console.log("OrderSummary rendered with:", {
      consultationType,
      selectedServices,
      effectivePrice,
      consultationLabel,
      pricingAvailable: pricing ? Object.fromEntries(pricing) : 'none'
    });
  }, [consultationType, selectedServices, effectivePrice, consultationLabel, pricing]);

  if (!effectivePrice || !selectedServices.length) {
    return (
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-800">Please select a service to see pricing details.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2">
          <OrderAmount 
            effectivePrice={effectivePrice}
            consultationLabel={consultationLabel}
          />
          <ServiceDuration selectedServices={selectedServices} />
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{effectivePrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
