
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { fetchAllServicePrices, fetchAllPackagePrices, ServicePrice, PackagePrice } from '@/utils/pricingUtils';

interface ServiceSelectionOptionsProps {
  serviceCategory: string;
  selectedServices: string[];
  handleServiceSelection: (serviceId: string, checked: boolean) => void;
  handlePackageSelection: (packageId: string) => void;
}

const ServiceSelectionOptions: React.FC<ServiceSelectionOptionsProps> = ({
  serviceCategory,
  selectedServices,
  handleServiceSelection,
  handlePackageSelection
}) => {
  const [servicePrices, setServicePrices] = useState<ServicePrice[]>([]);
  const [packagePrices, setPackagePrices] = useState<PackagePrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const [services, packages] = await Promise.all([
          fetchAllServicePrices(),
          fetchAllPackagePrices()
        ]);
        
        setServicePrices(services);
        setPackagePrices(packages);
      } catch (error) {
        console.error('Error fetching pricing data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrices();
  }, []);

  // Filter services by category
  const filteredServices = servicePrices.filter(service => 
    service.category === serviceCategory && service.scenario === 'regular'
  );

  // Find services without prices
  const mentalHealthServices = [
    { id: 'mental-health-counselling', name: 'Mental Health Counselling', price: 1500 },
    { id: 'family-therapy', name: 'Family Therapy', price: 2000 },
    { id: 'premarital-counselling', name: 'Premarital Counselling', price: 1800 },
    { id: 'couples-counselling', name: 'Couples Counselling', price: 2500 },
    { id: 'sexual-health-counselling', name: 'Sexual Health Counselling', price: 2200 }
  ];

  const legalServices = [
    { id: 'pre-marriage-legal', name: 'Pre-Marriage Legal Consultation', price: 2500 },
    { id: 'mediation', name: 'Mediation Services', price: 3000 },
    { id: 'divorce', name: 'Divorce Consultation', price: 3500 },
    { id: 'custody', name: 'Child Custody Consultation', price: 3000 },
    { id: 'maintenance', name: 'Maintenance Consultation', price: 2800 },
    { id: 'general-legal', name: 'General Legal Consultation', price: 2000 }
  ];

  // Merge services with pricing data or use fallback prices
  const servicesWithPrices = serviceCategory === 'mental-health'
    ? mentalHealthServices.map(service => {
        const pricingData = filteredServices.find(p => p.service_id === service.id);
        return {
          ...service,
          price: pricingData?.price || service.price,
          currency: pricingData?.currency || 'INR'
        };
      })
    : legalServices.map(service => {
        const pricingData = filteredServices.find(p => p.service_id === service.id);
        return {
          ...service,
          price: pricingData?.price || service.price,
          currency: pricingData?.currency || 'INR'
        };
      });

  const holisticPackages = packagePrices.length > 0
    ? packagePrices.map(pkg => ({
        id: pkg.package_id,
        label: pkg.package_name,
        description: `${pkg.services.length} services (${pkg.currency} ${pkg.price})`,
        services: pkg.services
      }))
    : [
        { 
          id: 'divorce-prevention', 
          label: 'Divorce Prevention Package', 
          description: '4 sessions (2 therapy + 1 mediation + 1 legal) - ₹7,500',
          services: ['couples-counselling', 'mental-health-counselling', 'mediation', 'general-legal']
        },
        { 
          id: 'pre-marriage-clarity', 
          label: 'Pre-Marriage Clarity Package', 
          description: '3 sessions (1 legal + 2 mental health) - ₹5,500',
          services: ['pre-marriage-legal', 'premarital-counselling', 'mental-health-counselling'] 
        }
      ];

  if (loading) {
    return <div className="text-center p-4">Loading available services...</div>;
  }

  return (
    <div className="space-y-6">
      <Label className="text-base font-medium">
        {serviceCategory === 'holistic' 
          ? 'Select Package or Individual Services (up to 4)'
          : `Select ${serviceCategory === 'mental-health' ? 'Mental Health' : 'Legal Support'} Service`
        }
      </Label>
      
      {serviceCategory === 'holistic' ? (
        <div className="space-y-6">
          <RadioGroup defaultValue="custom" className="space-y-3">
            <div className="space-y-4">
              {holisticPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className="flex items-start space-x-2"
                >
                  <RadioGroupItem 
                    value={pkg.id} 
                    id={pkg.id}
                    checked={JSON.stringify(selectedServices) === JSON.stringify(pkg.services)}
                    onClick={() => handlePackageSelection(pkg.id)}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={pkg.id} className="font-medium text-base">{pkg.label}</Label>
                    <p className="text-sm text-muted-foreground">
                      {pkg.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex items-start space-x-2">
                <RadioGroupItem 
                  value="custom" 
                  id="custom"
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="custom" className="font-medium text-base">Custom Selection</Label>
                  <p className="text-sm text-muted-foreground">
                    Select individual services below (up to 4)
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
          
          <Card className="p-4 grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3 text-sm">Mental Health Services</h3>
              <div className="space-y-3">
                {mentalHealthServices.map((service) => {
                  const pricingData = filteredServices.find(p => p.service_id === service.id);
                  const price = pricingData?.price || service.price;
                  const currency = pricingData?.currency || 'INR';
                  
                  return (
                    <div key={service.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`holistic-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => 
                          handleServiceSelection(service.id, checked === true)
                        }
                        className="mt-1"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={`holistic-${service.id}`}>{service.name}</Label>
                        <p className="text-xs text-muted-foreground">{currency} {price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-sm">Legal Services</h3>
              <div className="space-y-3">
                {legalServices.map((service) => {
                  const pricingData = filteredServices.find(p => p.service_id === service.id);
                  const price = pricingData?.price || service.price;
                  const currency = pricingData?.currency || 'INR';
                  
                  return (
                    <div key={service.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`holistic-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => 
                          handleServiceSelection(service.id, checked === true)
                        }
                        className="mt-1"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={`holistic-${service.id}`}>{service.name}</Label>
                        <p className="text-xs text-muted-foreground">{currency} {price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-3">
          {servicesWithPrices.map((service) => (
            <div key={service.id} className="flex items-start space-x-2">
              <Checkbox 
                id={`service-${service.id}`}
                checked={selectedServices.includes(service.id)}
                onCheckedChange={(checked) => 
                  handleServiceSelection(service.id, checked === true)
                }
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor={`service-${service.id}`}>{service.name}</Label>
                <p className="text-xs text-muted-foreground">{service.currency} {service.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSelectionOptions;
