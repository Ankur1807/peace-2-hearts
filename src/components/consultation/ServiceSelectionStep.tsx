
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
  // Function to handle clicking the entire box
  const handleBoxClick = (value: string) => {
    setConsultationType(value);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-lora font-semibold mb-6">Select Consultation Type</h2>
      
      <RadioGroup value={consultationType} onValueChange={setConsultationType} className="space-y-4">
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'mental-health' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
          onClick={() => handleBoxClick('mental-health')}
        >
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="mental-health" id="mental-health" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="mental-health" className="text-lg font-medium cursor-pointer">Mental Health Support</Label>
              <p className="text-gray-600">Speak with a therapist about anxiety, depression, or stress related to relationships.</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'legal' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
          onClick={() => handleBoxClick('legal')}
        >
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="legal" id="legal" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="legal" className="text-lg font-medium cursor-pointer">Legal Consultation</Label>
              <p className="text-gray-600">Discuss divorce proceedings, custody arrangements, or other legal matters.</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'therapy' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
          onClick={() => handleBoxClick('therapy')}
        >
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="therapy" id="therapy" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="therapy" className="text-lg font-medium cursor-pointer">Relationship Therapy</Label>
              <p className="text-gray-600">Work with a therapist to improve communication and resolve relationship issues.</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'combined' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
          onClick={() => handleBoxClick('combined')}
        >
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="combined" id="combined" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="combined" className="text-lg font-medium cursor-pointer">Combined Support</Label>
              <p className="text-gray-600">Access both legal and mental health support for comprehensive guidance.</p>
            </div>
          </div>
        </div>
      </RadioGroup>
      
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
