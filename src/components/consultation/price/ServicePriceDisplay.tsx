
import React from 'react';
import { formatPrice } from '@/utils/pricing';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';

interface ServicePriceDisplayProps {
  serviceId: string;
  servicePrice: number;
  currency?: string;
}

const ServicePriceDisplay = ({ 
  serviceId, 
  servicePrice, 
  currency = 'INR' 
}: ServicePriceDisplayProps) => {
  // Get the display name for the service ID
  const serviceName = getConsultationTypeLabel(serviceId);
  
  return (
    <div className="mb-3 py-2">
      <div className="flex justify-between items-center text-gray-700">
        <span>{serviceName || "Consultation"}</span>
        <span>{formatPrice(servicePrice, currency)}</span>
      </div>
    </div>
  );
};

export default ServicePriceDisplay;
