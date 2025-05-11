
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
  totalPrice?: number;
};

// Map from legacy client IDs to Supabase-aligned IDs
const legacyToSupabaseIdMap: Record<string, string> = {
  'divorce-prevention': 'P2H-H-divorce-prevention-package',
  'pre-marriage-clarity': 'P2H-H-pre-marriage-clarity-solutions',
  'mental-health-counselling': 'P2H-MH-mental-health-counselling',
  'family-therapy': 'P2H-MH-family-therapy',
  'couples-counselling': 'P2H-MH-couples-counselling',
  'sexual-health-counselling': 'P2H-MH-sexual-health-counselling',
  'test-service': 'P2H-MH-test-service',
  'mediation': 'P2H-L-mediation-services',
  'divorce': 'P2H-L-divorce-consultation',
  'custody': 'P2H-L-child-custody-consultation',
  'maintenance': 'P2H-L-maintenance-consultation',
  'general-legal': 'P2H-L-general-legal-consultation'
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  consultationType, 
  selectedServices = [],
  pricing,
  totalPrice
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

  // Debug log for pricing information
  React.useEffect(() => {
    console.log("OrderSummary rendered with:", {
      consultationType,
      selectedServices,
      effectivePrice: effectivePrice(),
      totalPrice,
      consultationLabel,
      pricingAvailable: pricing ? Object.fromEntries(pricing) : 'none'
    });
  }, [consultationType, selectedServices, effectivePrice, totalPrice, consultationLabel, pricing]);

  if (!effectivePrice() || !selectedServices.length) {
    return (
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-800">Please select a service to see pricing details.</p>
      </div>
    );
  }

  // Special display for test service
  const isTestService = selectedServices.includes('test-service');
  
  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2">
          <OrderAmount 
            effectivePrice={effectivePrice()}
            consultationLabel={isTestService ? 'Test service for payment system validation' : consultationLabel}
          />
          {!isTestService && <ServiceDuration selectedServices={selectedServices} />}
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{effectivePrice()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
