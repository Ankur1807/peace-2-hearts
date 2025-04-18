
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import ServiceCheckbox from './service-selection/ServiceCheckbox';
import ServiceOption from './service-selection/ServiceOption';

interface ServiceOption {
  id: string;
  label: string;
  description?: string;
  services?: string[];
}

interface HolisticPackage extends ServiceOption {
  description: string;
  services: string[];
}

interface ServiceSelectionOptionsProps {
  serviceCategory: string;
  selectedServices: string[];
  handleServiceSelection: (serviceId: string, checked: boolean) => void;
  handlePackageSelection: (packageId: string) => void;
  pricing?: Map<string, number>; 
}

const mentalHealthServices: ServiceOption[] = [
  { id: 'mental-health-counselling', label: 'Mental Health Counselling', description: 'Speak with a therapist about anxiety, depression, or stress related to relationships.' },
  { id: 'family-therapy', label: 'Family Therapy', description: 'Strengthen family bonds by addressing conflicts and fostering understanding.' },
  { id: 'premarital-counselling-individual', label: 'Premarital Counselling - Individual', description: 'Prepare for a strong marriage through guided personal reflection.' },
  { id: 'premarital-counselling-couple', label: 'Premarital Counselling - Couple', description: 'Build a foundation for marriage together through guided discussions.' },
  { id: 'couples-counselling', label: 'Couples Counselling', description: 'Professional guidance to strengthen communication and mutual understanding.' },
  { id: 'sexual-health-counselling-individual', label: 'Sexual Health Counselling - Individual', description: 'Personal support for addressing intimacy concerns.' },
  { id: 'sexual-health-counselling-couple', label: 'Sexual Health Counselling - Couple', description: 'Specialized support for enhancing relationship satisfaction together.' },
  { id: 'test-service', label: 'Test Service (₹11)', description: 'For testing payment gateway functionality.' }
];

const legalServices: ServiceOption[] = [
  { id: 'pre-marriage-legal', label: 'Pre-marriage Legal Consultation', description: 'Guidance on rights, agreements, and legal aspects before marriage.' },
  { id: 'mediation', label: 'Mediation Services', description: 'Facilitating peaceful resolutions to legal disputes through collaborative dialogue.' },
  { id: 'divorce', label: 'Divorce Consultation', description: 'Expert insights into legal aspects of divorce to make informed decisions.' },
  { id: 'custody', label: 'Child Custody Consultation', description: 'Support for understanding and advocating in custody decisions for children.' },
  { id: 'maintenance', label: 'Maintenance Consultation', description: 'Advice on alimony, financial support, and agreements for separated partners.' },
  { id: 'general-legal', label: 'General Legal Consultation', description: 'Broad legal insights tailored to your unique relationship challenges.' }
];

const holisticPackages: HolisticPackage[] = [
  { 
    id: 'divorce-prevention', 
    label: 'Divorce Prevention Package', 
    description: '2 therapy + 1 mediation + 1 legal',
    services: ['couples-counselling', 'mental-health-counselling', 'mediation', 'general-legal']
  },
  { 
    id: 'pre-marriage-clarity', 
    label: 'Pre-Marriage Clarity Package', 
    description: '1 legal + 2 mental health',
    services: ['pre-marriage-legal', 'premarital-counselling-individual', 'mental-health-counselling'] 
  }
];

const ServiceSelectionOptions: React.FC<ServiceSelectionOptionsProps> = ({
  serviceCategory,
  selectedServices,
  handleServiceSelection,
  handlePackageSelection,
  pricing
}) => {
  console.log("ServiceSelectionOptions rendered with selectedServices:", selectedServices);
  console.log("ServiceSelectionOptions pricing:", Object.fromEntries(pricing || new Map()));
  
  // For holistic package selection
  if (serviceCategory === 'holistic') {
    return (
      <div className="space-y-4">
        <Label className="text-lg font-medium text-gray-800">Package Selection</Label>
        <RadioGroup 
          onValueChange={handlePackageSelection} 
          className="space-y-4"
        >
          {holisticPackages.map(pkg => {
            // Show package price if available
            const price = pricing?.get(pkg.id);
            const isSelected = pkg.services.every(service => selectedServices.includes(service)) &&
                              pkg.services.length === selectedServices.length;
            
            return (
              <ServiceOption
                key={pkg.id}
                id={pkg.id}
                title={pkg.label + (price ? ` - ₹${price.toLocaleString('en-IN')}` : '')}
                description={pkg.description}
                isSelected={isSelected}
                onClick={() => handlePackageSelection(pkg.id)}
              />
            );
          })}
        </RadioGroup>
      </div>
    );
  } 
  
  // For individual service selection (mental-health or legal)
  const servicesToDisplay = serviceCategory === 'mental-health' 
    ? mentalHealthServices 
    : legalServices;
    
  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium text-gray-800">Service Types</Label>
      <div className="grid grid-cols-1 gap-4">
        {servicesToDisplay.map(service => {
          const isChecked = selectedServices.includes(service.id);
          // Get price from the pricing map if available
          const price = pricing?.get(service.id);
          
          console.log(`Service ${service.id} isChecked:`, isChecked);
          
          return (
            <ServiceCheckbox
              key={service.id}
              id={service.id}
              label={service.label}
              description={service.description}
              isSelected={isChecked}
              price={price}
              onChange={(checked) => {
                console.log(`ServiceCheckbox ${service.id} onChange:`, checked);
                handleServiceSelection(service.id, checked);
              }}
            />
          );
        })}
      </div>
      
      {selectedServices.length === 0 && (
        <p className="text-sm text-muted-foreground mt-2">Please select at least one service</p>
      )}
    </div>
  );
};

export default ServiceSelectionOptions;
