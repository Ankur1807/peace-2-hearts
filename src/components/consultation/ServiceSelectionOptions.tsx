
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice } from '@/utils/pricing';
import { getFallbackPrice } from '@/utils/pricing/fallbackPrices';

interface ServiceOption {
  id: string;
  supabaseId: string;
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

// Using full Supabase IDs for all services
const mentalHealthServices: ServiceOption[] = [
  { id: 'mental-health-counselling', supabaseId: 'P2H-MH-mental-health-counselling', label: 'Mental Health Counselling', description: 'Speak with a therapist about anxiety, depression, or stress related to relationships.' },
  { id: 'family-therapy', supabaseId: 'P2H-MH-family-therapy', label: 'Family Therapy', description: 'Strengthen family bonds by addressing conflicts and fostering understanding.' },
  { id: 'couples-counselling', supabaseId: 'P2H-MH-couples-counselling', label: 'Couples Counselling', description: 'Professional guidance to strengthen communication and mutual understanding.' },
  { id: 'sexual-health-counselling', supabaseId: 'P2H-MH-sexual-health-counselling', label: 'Sexual Health Counselling', description: 'Specialized support for addressing intimacy concerns and enhancing relationship satisfaction.' },
  { id: 'test-service', supabaseId: 'P2H-MH-test-service', label: 'Test Service', description: 'For testing payment gateway functionality.' }
];

const legalServices: ServiceOption[] = [
  { id: 'pre-marriage-legal', supabaseId: 'P2H-L-pre-marriage-legal-consultation', label: 'Pre-marriage Legal Consultation', description: 'Guidance on rights, agreements, and legal aspects before marriage.' },
  { id: 'mediation', supabaseId: 'P2H-L-mediation-services', label: 'Mediation Services', description: 'Facilitating peaceful resolutions to legal disputes through collaborative dialogue.' },
  { id: 'divorce', supabaseId: 'P2H-L-divorce-consultation', label: 'Divorce Consultation', description: 'Expert insights into legal aspects of divorce to make informed decisions.' },
  { id: 'custody', supabaseId: 'P2H-L-child-custody-consultation', label: 'Child Custody Consultation', description: 'Support for understanding and advocating in custody decisions for children.' },
  { id: 'maintenance', supabaseId: 'P2H-L-maintenance-consultation', label: 'Maintenance Consultation', description: 'Advice on alimony, financial support, and agreements for separated partners.' },
  { id: 'general-legal', supabaseId: 'P2H-L-general-legal-consultation', label: 'General Legal Consultation', description: 'Broad legal insights tailored to your unique relationship challenges.' }
];

const holisticPackages: HolisticPackage[] = [
  { 
    id: 'divorce-prevention', 
    supabaseId: 'P2H-H-divorce-prevention-package',
    label: 'Divorce Prevention Package', 
    description: '2 therapy + 1 mediation + 1 legal',
    services: ['couples-counselling', 'mental-health-counselling', 'mediation', 'general-legal']
  },
  { 
    id: 'pre-marriage-clarity', 
    supabaseId: 'P2H-H-pre-marriage-clarity-solutions',
    label: 'Pre-Marriage Clarity Package', 
    description: '1 legal + 2 mental health',
    services: ['pre-marriage-legal', 'premarital-counselling-individual', 'mental-health-counselling'] 
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
      // Log some specific prices for debugging
      pricing.forEach((price, id) => {
        console.log(`Price for ${id}: ${price}`);
      });
    }
  }, [pricing]);

  // Helper function to get price directly from supabaseId
  const getServicePrice = (clientId: string, supabaseId: string): number | undefined => {
    // First try to get from pricing map if available
    if (pricing?.has(supabaseId)) {
      return pricing.get(supabaseId);
    }
    
    // If no price in map, use the fallback with Supabase ID
    return getFallbackPrice(supabaseId);
  };

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
            // Get package price directly using supabaseId
            const price = getServicePrice(pkg.id, pkg.supabaseId);
            
            return (
              <div key={pkg.id} className="flex items-start space-x-2">
                <RadioGroupItem value={pkg.id} id={pkg.id} />
                <Label htmlFor={pkg.id} className="flex flex-col">
                  <span className="font-medium">
                    {pkg.label}{price !== undefined ? ` - ${formatPrice(price)}` : ''}
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
  
  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium text-gray-800">Service Types</Label>
      <RadioGroup 
        onValueChange={(value) => handleServiceSelection(value, true)}
        className="space-y-4"
        value={selectedServices.length > 0 ? selectedServices[0] : undefined}
      >
        {servicesToDisplay.map(service => {
          // Get service price directly using supabaseId
          const price = getServicePrice(service.id, service.supabaseId);
          
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
