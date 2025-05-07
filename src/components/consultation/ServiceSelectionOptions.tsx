
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice } from '@/utils/pricing';
import { getFallbackPrice } from '@/utils/pricing/fallbackPrices';

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

// Map client IDs to Supabase IDs for getFallbackPrice lookup
const clientToSupabaseIdMap: Record<string, string> = {
  'divorce-prevention': 'P2H-H-divorce-prevention-package',
  'pre-marriage-clarity': 'P2H-H-pre-marriage-clarity-solutions',
  'mental-health-counselling': 'P2H-MH-mental-health-counselling',
  'family-therapy': 'P2H-MH-family-therapy',
  'couples-counselling': 'P2H-MH-couples-counselling',
  'sexual-health-counselling': 'P2H-MH-sexual-health-counselling',
  'test-service': 'P2H-MH-test-service',
  'pre-marriage-legal': 'P2H-L-pre-marriage-legal-consultation',
  'mediation': 'P2H-L-mediation-services',
  'divorce': 'P2H-L-divorce-consultation',
  'custody': 'P2H-L-child-custody-consultation',
  'maintenance': 'P2H-L-maintenance-consultation',
  'general-legal': 'P2H-L-general-legal-consultation'
};

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

  // Helper function to get price, prioritizing pricing map (if Supabase-aligned) then fallback
  const getServicePrice = (clientId: string): number | undefined => {
    // First try to get from pricing map if available
    if (pricing?.has(clientId)) {
      return pricing.get(clientId);
    }
    
    // If no price in map, use the fallback with Supabase ID mapping
    const supabaseId = clientToSupabaseIdMap[clientId];
    if (supabaseId) {
      return getFallbackPrice(supabaseId);
    }
    
    return undefined;
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
            // Get package price using the helper function
            const price = getServicePrice(pkg.id);
            
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
          // Get service price using the helper function
          const price = getServicePrice(service.id);
          
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
