
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice } from '@/utils/pricing';

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
  { id: 'couples-counselling', label: 'Couples Counselling', description: 'Professional guidance to strengthen communication and mutual understanding.' },
  { id: 'sexual-health-counselling', label: 'Sexual Health Counselling', description: 'Specialized support for addressing intimacy concerns and enhancing relationship satisfaction.' },
  { id: 'test-service', label: 'Test Service', description: 'For testing payment gateway functionality.' }
];

const legalServices: ServiceOption[] = [
  { id: 'mediation', label: 'Mediation Services', description: 'Facilitating peaceful resolutions to legal disputes through collaborative dialogue.' },
  { id: 'divorce', label: 'Divorce Consultation', description: 'Expert insights into legal aspects of divorce to make informed decisions.' },
  { id: 'custody', label: 'Child Custody Consultation', description: 'Support for understanding and advocating in custody decisions for children.' },
  { id: 'maintenance', label: 'Maintenance Consultation', description: 'Advice on alimony, financial support, and agreements for separated partners.' },
  { id: 'general-legal', label: 'General Legal Consultation', description: 'Broad legal insights tailored to your unique relationship challenges.' }
];

const holisticPackages: HolisticPackage[] = [
  { 
    id: 'divorce-prevention', 
    label: 'Divorce Prevention Solutions', 
    description: '2 therapy + 1 mediation + 1 legal',
    services: ['couples-counselling', 'mental-health-counselling', 'mediation', 'general-legal']
  },
  { 
    id: 'pre-marriage-clarity', 
    label: 'Pre-Marriage Clarity Solutions', 
    description: '1 legal + 2 mental health',
    services: ['general-legal', 'couples-counselling', 'mental-health-counselling'] 
  }
];

const ServiceSelectionOptions: React.FC<ServiceSelectionOptionsProps> = React.memo(({
  serviceCategory,
  selectedServices,
  handleServiceSelection,
  handlePackageSelection,
  pricing
}) => {
  // Debug pricing data when component renders
  React.useEffect(() => {
    console.log('ServiceSelectionOptions rendered with pricing:', pricing ? Object.fromEntries(pricing) : 'No pricing data');
    if (pricing) {
      console.log('Number of pricing items:', pricing.size);
      // Log available prices for packages
      if (pricing.has('divorce-prevention')) {
        console.log(`Price for divorce-prevention: ${pricing.get('divorce-prevention')}`);
      } else {
        console.warn('No price found for divorce-prevention package');
      }
      
      if (pricing.has('pre-marriage-clarity')) {
        console.log(`Price for pre-marriage-clarity: ${pricing.get('pre-marriage-clarity')}`);
      } else {
        console.warn('No price found for pre-marriage-clarity package');
      }
    }
  }, [pricing]);

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
                    {pkg.label}{price !== undefined ? ` - ${formatPrice(price)}` : ''}
                  </span>
                  <span className="text-sm text-gray-500">{pkg.description}</span>
                  {price === undefined && (
                    <span className="text-xs text-amber-600">Price unavailable</span>
                  )}
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
  
  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium text-gray-800">Service Types</Label>
      <RadioGroup 
        onValueChange={(value) => handleServiceSelection(value, true)}
        className="space-y-4"
        value={selectedServices.length > 0 ? selectedServices[0] : undefined}
      >
        {servicesToDisplay.map(service => {
          // Get price for this service
          const price = pricing?.get(service.id);
          
          return (
            <div key={service.id} className="flex items-start space-x-2">
              <RadioGroupItem value={service.id} id={service.id} />
              <Label htmlFor={service.id} className="flex flex-col">
                <span className="font-medium">
                  {service.label}{price !== undefined ? ` - ${formatPrice(price)}` : ''}
                </span>
                {service.description && (
                  <span className="text-sm text-gray-500">{service.description}</span>
                )}
                {price === undefined && (
                  <span className="text-xs text-amber-600">Price unavailable</span>
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

ServiceSelectionOptions.displayName = "ServiceSelectionOptions";

export default ServiceSelectionOptions;
