
import React, { useEffect, useState } from 'react';
import { PackageCheck } from 'lucide-react';
import HolisticPackage from './HolisticPackage';
import { fetchPackagePricing } from '@/utils/pricing';

const HolisticSolutions: React.FC = () => {
  const [packagePrices, setPackagePrices] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPackagePrices = async () => {
      try {
        setIsLoading(true);
        const packageIds = ['divorce-prevention', 'pre-marriage-clarity'];
        const pricingMap = await fetchPackagePricing(packageIds);
        setPackagePrices(pricingMap);
        console.log('Holistic packages pricing loaded:', Object.fromEntries(pricingMap));
      } catch (error) {
        console.error('Failed to load package prices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPackagePrices();
  }, []);

  const getFormattedPrice = (packageId: string) => {
    const price = packagePrices.get(packageId);
    return price ? `₹${price.toLocaleString('en-IN')}` : '';
  };

  return (
    <div className="mt-16 mb-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="section-title text-3xl font-lora font-semibold text-gray-800">Holistic Solution Packages</h2>
        <p className="text-gray-600 mt-4">
          Our integrated packages combine mental health support and legal guidance to provide comprehensive care for your specific relationship journey.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <HolisticPackage
          icon={PackageCheck}
          title="Divorce Prevention Package"
          description="A comprehensive approach to resolving relationship challenges before they lead to separation, combining therapy and legal mediation."
          features={[
            "2 Therapy Sessions",
            "1 Mediation Session",
            "1 Legal Consultation"
          ]}
          linkPath="/services/holistic/divorce-prevention"
          linkText="Learn More"
          iconColor="bg-vibrantPurple/15"
          dotColor="text-vibrantPurple"
          price={getFormattedPrice('divorce-prevention')}
          isLoading={isLoading}
        />
        
        <HolisticPackage
          icon={PackageCheck}
          title="Pre-Marriage Clarity Package"
          description="Start your marriage journey with confidence by addressing both emotional readiness and legal considerations."
          features={[
            "1 Legal Consultation",
            "2 Mental Health Sessions"
          ]}
          linkPath="/services/holistic/pre-marriage-clarity"
          linkText="Learn More"
          iconColor="bg-peacefulBlue/15"
          dotColor="text-peacefulBlue"
          price={getFormattedPrice('pre-marriage-clarity')}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default HolisticSolutions;
