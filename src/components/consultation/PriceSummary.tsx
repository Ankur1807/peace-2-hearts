
import React from 'react';
import { formatPrice } from '@/utils/pricing/priceFormatter';
import { getPackageName } from '@/utils/consultation/packageUtils';
import { AlertCircle } from 'lucide-react';

interface PriceSummaryProps {
  services: string[];
  pricing?: Map<string, number>;
  totalPrice: number;
  currency?: string;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({ 
  services, 
  totalPrice,
  currency = 'INR'
}) => {
  const packageName = getPackageName(services);

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium text-lg mb-3">Price Summary</h3>
      
      {totalPrice === 0 && (
        <div className="mb-3 flex items-center gap-2 bg-amber-50 p-3 rounded-md border border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-600">
            Price information is currently unavailable.
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center pt-3 font-semibold">
        <span>Total</span>
        <span className="text-lg">
          {totalPrice > 0 ? formatPrice(totalPrice, currency) : "Price not available"}
        </span>
      </div>
    </div>
  );
};

export default PriceSummary;
