
import React from 'react';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { getPackageName } from '@/utils/consultation/packageUtils';
import OrderAmount from './OrderAmount';
import ServiceDuration from './ServiceDuration';
import { useEffectivePrice } from '@/hooks/consultation/payment/useEffectivePrice';

type OrderSummaryProps = {
  consultationType: string;
  totalPrice: number;
  selectedServices?: string[];
  pricing?: Map<string, number>;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  consultationType, 
  totalPrice, 
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
    pricing,
    totalPrice
  });

  const packageName = selectedServices.length > 0 
    ? getPackageName(selectedServices) 
    : null;
  
  const consultationLabel = getConsultationLabel();
  const effectivePrice = getEffectivePrice();

  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="space-y-2">
          <OrderAmount 
            effectivePrice={effectivePrice}
            consultationLabel={consultationLabel}
          />
          <ServiceDuration selectedServices={selectedServices} />
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
