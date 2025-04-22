
import React, { memo, useCallback } from 'react';
import ServiceCheckbox from './ServiceCheckbox';

interface ServiceOptionProps {
  id: string;
  title: string;
  description?: string;
  isSelected: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: () => void;
  price?: number;
}

// Use React.memo to prevent unnecessary re-renders of this component
const ServiceOption: React.FC<ServiceOptionProps> = memo(({ 
  id, 
  title, 
  description, 
  isSelected, 
  onChange,
  onClick,
  price 
}) => {
  // Use useCallback to avoid creating new functions on every render
  const handleChange = useCallback((checked: boolean) => {
    if (onChange) {
      // Use setTimeout to prevent focus-induced scrolling
      setTimeout(() => {
        onChange(checked);
      }, 0);
    }
    
    // If onClick is provided and the checkbox is being checked, call onClick
    if (onClick && checked) {
      setTimeout(() => {
        onClick();
      }, 0);
    }
  }, [onChange, onClick]);

  return (
    <ServiceCheckbox
      key={id}
      id={id}
      label={title}
      description={description}
      isSelected={isSelected}
      price={price}
      onChange={handleChange}
    />
  );
});

// Add display name for React DevTools
ServiceOption.displayName = "ServiceOption";

export default ServiceOption;
