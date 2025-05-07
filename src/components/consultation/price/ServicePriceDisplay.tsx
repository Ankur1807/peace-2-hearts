
import React from 'react';
import { formatPrice } from '@/utils/pricing';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { getFallbackPrice } from '@/utils/pricing/fallbackPrices';

interface ServicePriceDisplayProps {
  serviceId: string;
  servicePrice?: number;
  currency?: string;
}

const ServicePriceDisplay = ({ 
  serviceId, 
  servicePrice, 
  currency = 'INR' 
}: ServicePriceDisplayProps) => {
  const serviceName = getConsultationTypeLabel(serviceId);
  
  // Prioritize provided servicePrice, then fall back to getFallbackPrice
  const displayPrice = servicePrice !== undefined 
    ? servicePrice 
    : getFallbackPrice(serviceId);
  
  return (
    <div className="mb-3 py-2">
      <div className="flex justify-between items-center text-gray-700">
        <span>{serviceName || "Consultation"}</span>
        <span>{displayPrice !== undefined ? formatPrice(displayPrice, currency) : 'Price unavailable'}</span>
      </div>
    </div>
  );
};

export default ServicePriceDisplay;
