
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  // Function to handle clicking the entire box
  const handleBoxClick = (value: string) => {
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
          <RadioGroup value={consultationType} onValueChange={setConsultationType} className="space-y-4">
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'mental-health-counselling' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
              onClick={() => handleBoxClick('mental-health-counselling')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="mental-health-counselling" id="mental-health-counselling" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="mental-health-counselling" className="text-lg font-medium cursor-pointer">Mental Health Counselling</Label>
                  <p className="text-gray-600">Speak with a therapist about anxiety, depression, or stress related to relationships.</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'family-therapy' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
              onClick={() => handleBoxClick('family-therapy')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="family-therapy" id="family-therapy" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="family-therapy" className="text-lg font-medium cursor-pointer">Family Therapy</Label>
                  <p className="text-gray-600">Strengthen family bonds by addressing conflicts and fostering understanding.</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'premarital-counselling' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
              onClick={() => handleBoxClick('premarital-counselling')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="premarital-counselling" id="premarital-counselling" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="premarital-counselling" className="text-lg font-medium cursor-pointer">Premarital Counselling</Label>
                  <p className="text-gray-600">Prepare for a strong marriage through guided discussions and planning.</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'couples-counselling' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
              onClick={() => handleBoxClick('couples-counselling')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="couples-counselling" id="couples-counselling" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="couples-counselling" className="text-lg font-medium cursor-pointer">Couples Counselling</Label>
                  <p className="text-gray-600">Professional guidance to strengthen communication and mutual understanding.</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'sexual-health-counselling' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
              onClick={() => handleBoxClick('sexual-health-counselling')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="sexual-health-counselling" id="sexual-health-counselling" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="sexual-health-counselling" className="text-lg font-medium cursor-pointer">Sexual Health Counselling</Label>
                  <p className="text-gray-600">Specialized support for addressing intimacy concerns and enhancing relationship satisfaction.</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </TabsContent>
        
        <TabsContent value="legal" className="pt-4">
          <RadioGroup value={consultationType} onValueChange={setConsultationType} className="space-y-4">
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'pre-marriage-legal' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
              onClick={() => handleBoxClick('pre-marriage-legal')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="pre-marriage-legal" id="pre-marriage-legal" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="pre-marriage-legal" className="text-lg font-medium cursor-pointer">Pre-marriage Legal Consultation</Label>
                  <p className="text-gray-600">Guidance on rights, agreements, and legal aspects before marriage.</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'mediation' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
              onClick={() => handleBoxClick('mediation')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="mediation" id="mediation" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="mediation" className="text-lg font-medium cursor-pointer">Mediation Services</Label>
                  <p className="text-gray-600">Facilitating peaceful resolutions to legal disputes through collaborative dialogue.</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'divorce' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
              onClick={() => handleBoxClick('divorce')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="divorce" id="divorce" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="divorce" className="text-lg font-medium cursor-pointer">Divorce Consultation</Label>
                  <p className="text-gray-600">Expert insights into legal aspects of divorce to make informed decisions.</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'custody' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
              onClick={() => handleBoxClick('custody')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="custody" id="custody" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="custody" className="text-lg font-medium cursor-pointer">Child Custody Consultation</Label>
                  <p className="text-gray-600">Support for understanding and advocating in custody decisions for children.</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'maintenance' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
              onClick={() => handleBoxClick('maintenance')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="maintenance" id="maintenance" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="maintenance" className="text-lg font-medium cursor-pointer">Maintenance Consultation</Label>
                  <p className="text-gray-600">Advice on alimony, financial support, and agreements for separated partners.</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors ${consultationType === 'general-legal' ? 'border-peacefulBlue bg-peacefulBlue/5' : ''}`}
              onClick={() => handleBoxClick('general-legal')}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="general-legal" id="general-legal" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="general-legal" className="text-lg font-medium cursor-pointer">General Legal Consultation</Label>
                  <p className="text-gray-600">Broad legal insights tailored to your unique relationship challenges.</p>
                </div>
              </div>
            </div>
          </RadioGroup>
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
