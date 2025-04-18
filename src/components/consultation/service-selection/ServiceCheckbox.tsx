
import React, { useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ServiceCheckboxProps {
  id: string;
  label: string;
  description?: string;
  isSelected: boolean;
  price?: number;
  onChange: (checked: boolean) => void;
}

const ServiceCheckbox: React.FC<ServiceCheckboxProps> = ({
  id,
  label,
  description,
  isSelected,
  price,
  onChange
}) => {
  // Handle click on the entire component
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(!isSelected);
  }, [isSelected, onChange]);

  // Handle checkbox change directly
  const handleCheckboxChange = useCallback((checked: boolean | "indeterminate") => {
    if (typeof checked === 'boolean') {
      onChange(checked);
    }
  }, [onChange]);

  // Format price display if available
  const priceDisplay = price ? ` - ₹${price.toLocaleString('en-IN')}` : '';

  return (
    <div 
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all duration-200",
        isSelected 
          ? "border-peacefulBlue bg-gradient-to-r from-peacefulBlue/5 to-peacefulBlue/10 shadow-md" 
          : "border-gray-200 hover:border-peacefulBlue/30 hover:bg-gray-50"
      )}
      onClick={handleContainerClick}
      role="button"
      aria-pressed={isSelected}
    >
      <div className="flex items-start space-x-3">
        <Checkbox 
          id={id}
          className="mt-1 h-5 w-5 rounded-sm border-2 border-peacefulBlue"
          checked={isSelected} 
          onCheckedChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="grid gap-1.5">
          <label 
            htmlFor={id} 
            className="font-medium cursor-pointer text-gray-800 text-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {label}
            <span className="text-peacefulBlue font-medium ml-1">{priceDisplay}</span>
          </label>
          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCheckbox;
