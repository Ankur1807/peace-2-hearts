
import React from 'react';
import { formatPrice } from '@/utils/pricing/fetchPricing';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';

interface PriceSummaryProps {
  services: string[];
  pricing: Map<string, number>;
  totalPrice: number;
  currency?: string;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({ 
  services, 
  pricing, 
  totalPrice,
  currency = 'INR'
}) => {
  // Helper function to check if selected services match a package
  const getPackageName = () => {
    // Divorce Prevention Package services
    const divorcePrevention = [
      'couples-counselling',
      'mental-health-counselling',
      'mediation',
      'general-legal'
    ];
    
    // Pre-Marriage Clarity Package services
    const preMarriageClarity = [
      'pre-marriage-legal',
      'premarital-counselling',
      'mental-health-counselling'
    ];

    // Check if selected services match a package
    if (services.length === divorcePrevention.length && 
        divorcePrevention.every(s => services.includes(s))) {
      return "Divorce Prevention Package";
    }
    
    if (services.length === preMarriageClarity.length && 
        preMarriageClarity.every(s => services.includes(s))) {
      return "Pre-Marriage Clarity Package";
    }
    
    return null;
  };

  const packageName = getPackageName();

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium text-lg mb-3">Price Summary</h3>
      
      {packageName ? (
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="font-medium">{packageName}</span>
          <span className="font-semibold">{formatPrice(totalPrice, currency)}</span>
        </div>
      ) : (
        <div className="space-y-2">
          {services.map(serviceId => (
            <div key={serviceId} className="flex justify-between items-center py-1 border-b border-gray-200">
              <span>{getConsultationTypeLabel(serviceId)}</span>
              <span>{formatPrice(pricing.get(serviceId), currency)}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center pt-3 font-semibold">
        <span>Total</span>
        <span className="text-lg">{formatPrice(totalPrice, currency)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
