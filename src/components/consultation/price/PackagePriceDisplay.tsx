
import React from 'react';
import { formatPrice } from '@/utils/pricing';

interface PackagePriceDisplayProps {
  packageName: string;
  packagePrice: number;
  currency?: string;
}

const PackagePriceDisplay = ({ 
  packageName, 
  packagePrice, 
  currency = 'INR' 
}: PackagePriceDisplayProps) => {
  return (
    <div className="mb-3 py-2">
      <div className="flex justify-between items-center text-gray-700">
        <span>{packageName}</span>
        <span>{formatPrice(packagePrice, currency)}</span>
      </div>
    </div>
  );
};

export default PackagePriceDisplay;
