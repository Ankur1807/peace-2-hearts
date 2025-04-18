
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, TagIcon, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice } from '@/utils/pricing/fetchPricing';

interface DiscountSectionProps {
  discountCode: string;
  setDiscountCode: (code: string) => void;
  validateAndApplyDiscount: () => Promise<boolean>;
  removeDiscount: () => void;
  isValidatingDiscount: boolean;
  appliedDiscountCode: string | null;
  discountAmount: number;
  originalPrice: number;
  totalPrice: number;
  selectedServices: string[];
}

const DiscountSection: React.FC<DiscountSectionProps> = ({
  discountCode,
  setDiscountCode,
  validateAndApplyDiscount,
  removeDiscount,
  isValidatingDiscount,
  appliedDiscountCode,
  discountAmount,
  originalPrice,
  totalPrice,
  selectedServices
}) => {
  // Don't show discount section if no services are selected
  if (selectedServices.length === 0) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndApplyDiscount();
  };

  return (
    <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm">
      <h3 className="flex items-center text-lg font-medium text-gray-800 mb-4">
        <TagIcon className="mr-2 h-5 w-5" />
        Discount Code
      </h3>

      {appliedDiscountCode ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-100">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
              <div>
                <div className="font-medium">{appliedDiscountCode}</div>
                <div className="text-sm text-green-600">
                  Discount applied: {formatPrice(discountAmount)}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={removeDiscount} 
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {discountAmount > 0 && (
            <div className="text-sm space-y-1 pt-2">
              <div className="flex justify-between">
                <span>Original price:</span>
                <span>{formatPrice(originalPrice)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
              <div className="flex justify-between font-medium pt-1 border-t border-gray-100">
                <span>Final price:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-grow">
              <Input
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.trim().toUpperCase())}
                className="w-full"
                disabled={isValidatingDiscount}
                autoComplete="off"
              />
            </div>
            <Button 
              type="submit" 
              disabled={!discountCode || isValidatingDiscount}
              className="bg-peacefulBlue hover:bg-peacefulBlue/90"
            >
              {isValidatingDiscount ? "Validating..." : "Apply"}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Enter a valid discount code to receive a discount on your consultation.
          </p>
        </form>
      )}
    </div>
  );
};

export default DiscountSection;
