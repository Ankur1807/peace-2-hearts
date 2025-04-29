
import React from 'react';
import { PackageCheck } from 'lucide-react';
import HolisticPackage from './HolisticPackage';

const HolisticSolutions: React.FC = () => {
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
          title="Divorce Prevention Solutions"
          description="A comprehensive approach to resolving relationship challenges before they lead to separation, combining therapy and legal mediation."
          features={[
            "Ideal for couples experiencing serious conflicts",
            "Perfect for relationships affected by trust issues",
            "Beneficial for those contemplating separation"
          ]}
          linkPath="/services/holistic/divorce-prevention"
          linkText="Learn More"
          iconColor="bg-vibrantPurple/15"
          dotColor="text-vibrantPurple"
        />
        
        <HolisticPackage
          icon={PackageCheck}
          title="Pre-Marriage Clarity Solutions"
          description="Start your marriage journey with confidence by addressing both emotional readiness and legal considerations."
          features={[
            "Perfect for engaged couples planning their future",
            "Helpful for those with complex asset situations",
            "Beneficial for couples with blended family considerations"
          ]}
          linkPath="/services/holistic/pre-marriage-clarity"
          linkText="Learn More"
          iconColor="bg-peacefulBlue/15"
          dotColor="text-peacefulBlue"
        />
      </div>
    </div>
  );
};

export default HolisticSolutions;
