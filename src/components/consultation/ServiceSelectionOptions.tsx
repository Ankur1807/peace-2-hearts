
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  { id: 'sexual-health-counselling', label: 'Sexual Health Counselling', description: 'Specialized support for addressing intimacy concerns and enhancing relationship satisfaction.' },
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

// Modified to use memoization to prevent unnecessary re-renders
const ServiceSelectionOptions: React.FC<ServiceSelectionOptionsProps> = React.memo(({
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
          onValueChange={(value) => handlePackageSelection(value)}
          className="space-y-4"
          value={selectedServices.length > 0 ? selectedServices[0] : undefined}
        >
          {holisticPackages.map(pkg => {
            // Show package price if available
            const price = pricing?.get(pkg.id);
            
            return (
              <div key={pkg.id} className="flex items-start space-x-2">
                <RadioGroupItem value={pkg.id} id={pkg.id} />
                <Label htmlFor={pkg.id} className="flex flex-col">
                  <span className="font-medium">
                    {pkg.label}{price ? ` - ₹${price.toLocaleString('en-IN')}` : ''}
                  </span>
                  <span className="text-sm text-gray-500">{pkg.description}</span>
                </Label>
              </div>
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
    
  // Modified to use RadioGroup instead of checkboxes for single selection
  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium text-gray-800">Service Types</Label>
      <RadioGroup 
        onValueChange={(value) => handleServiceSelection(value, true)}
        className="space-y-4"
        value={selectedServices.length > 0 ? selectedServices[0] : undefined}
      >
        {servicesToDisplay.map(service => {
          // Get price from the pricing map if available
          const price = pricing?.get(service.id);
          
          return (
            <div key={service.id} className="flex items-start space-x-2">
              <RadioGroupItem value={service.id} id={service.id} />
              <Label htmlFor={service.id} className="flex flex-col">
                <span className="font-medium">
                  {service.label}{price ? ` - ₹${price.toLocaleString('en-IN')}` : ''}
                </span>
                {service.description && (
                  <span className="text-sm text-gray-500">{service.description}</span>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      
      {selectedServices.length === 0 && (
        <p className="text-sm text-muted-foreground mt-2">Please select a service</p>
      )}
    </div>
  );
});

// Add display name for React DevTools
ServiceSelectionOptions.displayName = "ServiceSelectionOptions";

export default ServiceSelectionOptions;
