
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MentalHealthServices from './service-selection/MentalHealthServices';
import LegalServices from './service-selection/LegalServices';

type ServiceSelectionStepProps = {
  consultationType: string;
  setConsultationType: (value: string) => void;
  onNextStep: () => void;
};

const ServiceSelectionStep = ({ 
  consultationType,
  setConsultationType,
  onNextStep
}: ServiceSelectionStepProps) => {
  const [serviceCategory, setServiceCategory] = React.useState("mental-health");
  
  // Check if we should switch to legal services tab based on the pre-selected service
  useEffect(() => {
    // If a legal service is selected, switch to the legal tab
    if (consultationType && (
      consultationType.includes('legal') || 
      consultationType === 'mediation' || 
      consultationType === 'divorce' ||
      consultationType === 'custody' ||
      consultationType === 'maintenance'
    )) {
      setServiceCategory("legal");
    }
  }, [consultationType]);
  
  // Function to handle clicking the entire box
  const handleBoxClick = (value: string) => {
    console.log("Service option clicked:", value);
    setConsultationType(value);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-lora font-semibold mb-6">Select Consultation Type</h2>
      
      <Tabs defaultValue="mental-health" value={serviceCategory} onValueChange={setServiceCategory} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mental-health">Mental Health Services</TabsTrigger>
          <TabsTrigger value="legal">Legal Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mental-health" className="pt-4">
          <MentalHealthServices 
            consultationType={consultationType}
            handleBoxClick={handleBoxClick}
          />
        </TabsContent>
        
        <TabsContent value="legal" className="pt-4">
          <LegalServices 
            consultationType={consultationType}
            handleBoxClick={handleBoxClick}
          />
        </TabsContent>
      </Tabs>
      
      <div className="pt-6 flex justify-end">
        <Button 
          type="button" 
          onClick={onNextStep}
          disabled={!consultationType}
          className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;
