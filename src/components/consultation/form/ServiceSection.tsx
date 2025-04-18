
import React from 'react';
import ServiceCategorySelector from '../ServiceCategorySelector';
import ServiceSelectionOptions from '../ServiceSelectionOptions';

interface ServiceSectionProps {
  serviceCategory: string;
  setServiceCategory: (category: string) => void;
  selectedServices: string[];
  handleServiceSelection: (serviceId: string, checked: boolean) => void;
  handlePackageSelection: (packageId: string) => void;
  pricing: Map<string, number>;
}

const ServiceSection: React.FC<ServiceSectionProps> = ({
  serviceCategory,
  setServiceCategory,
  selectedServices,
  handleServiceSelection,
  handlePackageSelection,
  pricing
}) => {
  // Log pricing data for debugging
  console.log("ServiceSection received pricing data:", Object.fromEntries(pricing || new Map()));
  console.log("ServiceSection received selectedServices:", selectedServices);
  
  return (
    <div className="space-y-6">
      <ServiceCategorySelector 
        serviceCategory={serviceCategory}
        setServiceCategory={setServiceCategory}
      />
      
      <ServiceSelectionOptions 
        serviceCategory={serviceCategory}
        selectedServices={selectedServices}
        handleServiceSelection={handleServiceSelection}
        handlePackageSelection={handlePackageSelection}
        pricing={pricing}
      />
    </div>
  );
};

export default ServiceSection;
