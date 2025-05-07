
import React from 'react';
import { formatPrice } from '@/utils/pricing';
import { getFallbackPrice } from '@/utils/pricing/fallbackPrices';

interface PackagePriceDisplayProps {
  packageName: string;
  packagePrice?: number;
  serviceId: string;
  currency?: string;
}

const PackagePriceDisplay = ({ 
  packageName, 
  packagePrice, 
  serviceId,
  currency = 'INR' 
}: PackagePriceDisplayProps) => {
  // Determine price based on priority: provided packagePrice > serviceId lookup > undefined
  const displayPrice = packagePrice !== undefined 
    ? packagePrice 
    : getFallbackPrice(serviceId);
  
  if (!displayPrice && !packagePrice && serviceId) {
    console.warn(`No price found for package ${packageName} with serviceId ${serviceId}`);
  }
  
  return (
    <div className="mb-3 py-2">
      <div className="flex justify-between items-center text-gray-700">
        <span>{packageName}</span>
        <span>{displayPrice !== undefined ? formatPrice(displayPrice, currency) : 'Price unavailable'}</span>
      </div>
    </div>
  );
};

export default PackagePriceDisplay;
