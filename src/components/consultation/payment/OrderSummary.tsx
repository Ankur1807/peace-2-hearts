
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

  const consultationLabel = getConsultationLabel();
  const effectivePrice = getEffectivePrice();

  React.useEffect(() => {
    console.log("OrderSummary rendered with:", {
      consultationType,
      selectedServices,
      totalPrice,
      effectivePrice,
      consultationLabel,
      pricingAvailable: pricing ? Object.fromEntries(pricing) : 'none',
      hasValidPrice: effectivePrice > 0
    });
  }, [consultationType, selectedServices, totalPrice, effectivePrice, consultationLabel, pricing]);

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
              <span>{effectivePrice > 0 ? `₹${effectivePrice}` : "Price not available"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
