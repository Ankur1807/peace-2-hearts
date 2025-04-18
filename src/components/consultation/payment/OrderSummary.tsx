
import React from 'react';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { formatPrice } from '@/utils/pricing/fetchPricing';

type OrderSummaryProps = {
  consultationType: string;
  totalPrice: number;
  discountAmount?: number;
  originalPrice?: number;
  appliedDiscountCode?: string | null;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  consultationType, 
  totalPrice,
  discountAmount = 0,
  originalPrice,
  appliedDiscountCode 
}) => {
  // Get the appropriate label for the consultation type
  const consultationLabel = consultationType.includes(',') 
    ? 'Multiple Services' 
    : getConsultationTypeLabel(consultationType);

  const hasDiscount = appliedDiscountCode && discountAmount > 0;

  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>{consultationLabel}</span>
            {hasDiscount ? (
              <div className="text-right">
                <span className="line-through text-gray-400 text-sm mr-2">
                  {formatPrice(originalPrice || 0)}
                </span>
                <span className="font-medium">
                  {totalPrice > 0 ? formatPrice(totalPrice) : "Price not available"}
                </span>
              </div>
            ) : (
              <span className="font-medium">
                {totalPrice > 0 ? formatPrice(totalPrice) : "Price not available"}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">60-minute consultation</div>
        </div>

        {hasDiscount && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium mr-2">
                  {appliedDiscountCode}
                </span>
                <span className="text-green-700">Discount applied</span>
              </div>
              <span className="text-green-700">-{formatPrice(discountAmount)}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-b py-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{totalPrice > 0 ? formatPrice(totalPrice) : "Price not available"}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
