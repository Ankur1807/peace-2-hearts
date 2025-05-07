
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
  
  // Map from legacy client IDs to Supabase-aligned IDs
  const legacyToSupabaseIdMap = {
    'divorce-prevention': 'P2H-H-divorce-prevention-package',
    'pre-marriage-clarity': 'P2H-H-pre-marriage-clarity-solutions',
    'mental-health-counselling': 'P2H-MH-mental-health-counselling',
    'family-therapy': 'P2H-MH-family-therapy',
    'couples-counselling': 'P2H-MH-couples-counselling',
    'sexual-health-counselling': 'P2H-MH-sexual-health-counselling',
    'test-service': 'P2H-MH-test-service',
    'pre-marriage-legal': 'P2H-L-pre-marriage-legal-consultation',
    'mediation': 'P2H-L-mediation-services',
    'divorce': 'P2H-L-divorce-consultation',
    'custody': 'P2H-L-child-custody-consultation',
    'maintenance': 'P2H-L-maintenance-consultation',
    'general-legal': 'P2H-L-general-legal-consultation'
  };

  // Resolve the serviceId to its Supabase-aligned ID counterpart
  const resolvedId = legacyToSupabaseIdMap[serviceId] || serviceId;
  
  // Prioritize provided servicePrice, then fall back to getFallbackPrice with normalized ID
  const displayPrice = servicePrice !== undefined 
    ? servicePrice 
    : getFallbackPrice(resolvedId);
  
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
