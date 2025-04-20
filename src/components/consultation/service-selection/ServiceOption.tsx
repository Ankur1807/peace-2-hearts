
import React from 'react';
import ServiceCheckbox from './ServiceCheckbox';

interface ServiceOptionProps {
  id: string;
  title: string;
  description?: string;
  isSelected: boolean;
  onChange: (checked: boolean) => void;
  price?: number;
}

const ServiceOption: React.FC<ServiceOptionProps> = ({ 
  id, 
  title, 
  description, 
  isSelected, 
  onChange,
  price 
}) => {
  // Use a separate handler to avoid creating a new function on every render
  const handleChange = React.useCallback((checked: boolean) => {
    onChange(checked);
  }, [onChange]);

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
