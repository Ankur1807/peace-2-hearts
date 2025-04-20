
import React from 'react';
import ServiceCheckbox from './ServiceCheckbox';

interface ServiceOptionProps {
  id: string;
  title: string;
  description?: string;
  isSelected: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: () => void;  // Added onClick prop to support existing usage
  price?: number;
}

const ServiceOption: React.FC<ServiceOptionProps> = ({ 
  id, 
  title, 
  description, 
  isSelected, 
  onChange,
  onClick,
  price 
}) => {
  // Use a separate handler to avoid creating a new function on every render
  const handleChange = React.useCallback((checked: boolean) => {
    if (onChange) {
      onChange(checked);
    }
    // If onClick is provided and the checkbox is being checked, call onClick
    if (onClick && checked) {
      onClick();
    }
  }, [onChange, onClick]);

  // Log to debug selection issues
  console.log(`Service ${id} isChecked:`, isSelected);

  return (
    <ServiceCheckbox
      id={id}
      label={title}
      description={description}
      isSelected={isSelected}
      price={price}
      onChange={handleChange}
    />
  );
};

export default ServiceOption;
