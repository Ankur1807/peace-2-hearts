
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceSelectionOptions from '../ServiceSelectionOptions';

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
    <div className="space-y-6">
      <Tabs
        value={serviceCategory}
        onValueChange={setServiceCategory}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="holistic">Holistic Packages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mental-health">
          <ServiceSelectionOptions 
            serviceCategory="mental-health"
            selectedServices={selectedServices}
            handleServiceSelection={handleServiceSelection}
            handlePackageSelection={handlePackageSelection}
            pricing={pricing}
          />
        </TabsContent>
        
        <TabsContent value="legal">
          <ServiceSelectionOptions 
            serviceCategory="legal"
            selectedServices={selectedServices}
            handleServiceSelection={handleServiceSelection}
            handlePackageSelection={handlePackageSelection}
            pricing={pricing}
          />
        </TabsContent>
        
        <TabsContent value="holistic">
          <ServiceSelectionOptions 
            serviceCategory="holistic"
            selectedServices={selectedServices}
            handleServiceSelection={handleServiceSelection}
            handlePackageSelection={handlePackageSelection}
            pricing={pricing}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceSection;
