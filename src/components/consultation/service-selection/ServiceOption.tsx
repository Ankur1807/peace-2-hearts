
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
  // Use a memoized click handler to prevent propagation issues
  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  }, [onClick]);

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${isSelected ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <RadioGroupItem value={id} id={id} className="mt-1" checked={isSelected} />
        <div className="grid gap-1.5">
          <Label htmlFor={id} className="text-lg font-medium cursor-pointer">{title}</Label>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceOption;
