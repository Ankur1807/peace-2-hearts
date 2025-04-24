
import React from 'react';
import ServiceCategorySelector from '../ServiceCategorySelector';
import ServiceSelectionOptions from '../ServiceSelectionOptions';
import { motion } from 'framer-motion';

interface ServiceSectionProps {
  serviceCategory: string;
  setServiceCategory: (category: string) => void;
  selectedServices: string[];
  handleServiceSelection: (serviceId: string, checked: boolean) => void;
  handlePackageSelection: (packageId: string) => void;
  pricing?: Map<string, number>;
}

const ServiceSection: React.FC<ServiceSectionProps> = ({
  serviceCategory,
  setServiceCategory,
  selectedServices,
  handleServiceSelection,
  handlePackageSelection,
  pricing
}) => {
  // Debug to verify pricing data is being passed correctly
  React.useEffect(() => {
    console.log('ServiceSection rendering with pricing:', {
      pricingAvailable: !!pricing,
      serviceCategory,
      selectedServices,
      pricingSize: pricing ? pricing.size : 0
    });
    
    if (pricing && pricing.size > 0) {
      // Log a few sample prices for debugging
      const sampleServices = ['mental-health-counselling', 'family-therapy', 'divorce'];
      sampleServices.forEach(id => {
        console.log(`Price for ${id}: ${pricing.get(id) || 'not available'}`);
      });
    }
  }, [pricing, serviceCategory, selectedServices]);
  
  return (
    <div className="space-y-8">
      <ServiceCategorySelector
        serviceCategory={serviceCategory}
        setServiceCategory={setServiceCategory}
      />
      
      {serviceCategory && (
        <motion.div 
          key={serviceCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <ServiceSelectionOptions 
            serviceCategory={serviceCategory}
            selectedServices={selectedServices}
            handleServiceSelection={handleServiceSelection}
            handlePackageSelection={handlePackageSelection}
            pricing={pricing}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ServiceSection;
