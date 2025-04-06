
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
}

const mentalHealthServices: ServiceOption[] = [
  { id: 'mental-health-counselling', label: 'Mental Health Counselling' },
  { id: 'family-therapy', label: 'Family Therapy' },
  { id: 'premarital-counselling', label: 'Premarital Counselling' },
  { id: 'couples-counselling', label: 'Couples Counselling' },
  { id: 'sexual-health-counselling', label: 'Sexual Health Counselling' }
];

const legalServices: ServiceOption[] = [
  { id: 'pre-marriage-legal', label: 'Pre-marriage Legal Consultation' },
  { id: 'mediation', label: 'Mediation Services' },
  { id: 'divorce', label: 'Divorce Consultation' },
  { id: 'custody', label: 'Child Custody Consultation' },
  { id: 'maintenance', label: 'Maintenance Consultation' },
  { id: 'general-legal', label: 'General Legal Consultation' }
];

const holisticPackages: HolisticPackage[] = [
  { 
    id: 'divorce-prevention', 
    label: 'Divorce Prevention Package', 
    description: '4 sessions (2 therapy + 1 mediation + 1 legal)',
    services: ['couples-counselling', 'mental-health-counselling', 'mediation', 'general-legal']
  },
  { 
    id: 'pre-marriage-clarity', 
    label: 'Pre-Marriage Clarity Package', 
    description: '3 sessions (1 legal + 2 mental health)',
    services: ['pre-marriage-legal', 'premarital-counselling', 'mental-health-counselling'] 
  }
];

const ServiceSelectionOptions: React.FC<ServiceSelectionOptionsProps> = ({
  serviceCategory,
  selectedServices,
  handleServiceSelection,
  handlePackageSelection
}) => {
  // For holistic package selection
  if (serviceCategory === 'holistic') {
    return (
      <div className="space-y-3">
        <Label>Package Selection</Label>
        <RadioGroup 
          onValueChange={handlePackageSelection} 
          className="space-y-3"
        >
          {holisticPackages.map(pkg => (
            <div key={pkg.id} className="flex items-start space-x-2">
              <RadioGroupItem value={pkg.id} id={pkg.id} />
              <div className="grid gap-1">
                <label
                  htmlFor={pkg.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {pkg.label}
                </label>
                <p className="text-xs text-muted-foreground">{pkg.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  } 
  
  // For individual service selection (mental-health or legal)
  const servicesToDisplay = serviceCategory === 'mental-health' 
    ? mentalHealthServices 
    : legalServices;
    
  return (
    <div className="space-y-3">
      <Label>Service Types</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {servicesToDisplay.map(service => {
          const isChecked = selectedServices.includes(service.id);
          
          return (
            <div key={service.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={service.id}
                checked={isChecked}
                onChange={(e) => handleServiceSelection(service.id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 focus:ring-peacefulBlue"
              />
              <label
                htmlFor={service.id}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {service.label}
              </label>
            </div>
          );
        })}
      </div>
      
      {selectedServices.length === 0 && (
        <p className="text-sm text-muted-foreground">Please select at least one service</p>
      )}
    </div>
  );
};

export default ServiceSelectionOptions;
