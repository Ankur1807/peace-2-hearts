
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
  
  // Function to handle service category change
  const handleCategoryChange = (category: string) => {
    console.log("Changing service category to:", category);
    setServiceCategory(category);
  };
  
  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Choose Your Service Category</h3>
        <ServiceCategorySelector 
          serviceCategory={serviceCategory}
          setServiceCategory={handleCategoryChange}
        />
      </div>
      
      <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm">
        <ServiceSelectionOptions 
          serviceCategory={serviceCategory}
          selectedServices={selectedServices}
          handleServiceSelection={handleServiceSelection}
          handlePackageSelection={handlePackageSelection}
          pricing={pricing}
        />
      </div>
    </div>
  );
};

export default ServiceSection;
