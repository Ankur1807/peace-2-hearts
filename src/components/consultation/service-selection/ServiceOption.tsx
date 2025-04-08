
import React from 'react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type ServiceOptionProps = {
  id: string;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
};

const ServiceOption: React.FC<ServiceOptionProps> = ({
  id,
  title,
  description,
  isSelected,
  onClick
}) => {
  // Prevent default event behavior and ensure that the onClick handler is properly called
  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  }, [onClick]);

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${isSelected ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
      onClick={handleClick}
      role="button"
      aria-pressed={isSelected}
    >
      <div className="flex items-start space-x-3">
        <RadioGroupItem 
          value={id} 
          id={id} 
          className="mt-1" 
          checked={isSelected}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="grid gap-1.5">
          <Label htmlFor={id} className="text-lg font-medium cursor-pointer">{title}</Label>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceOption;
