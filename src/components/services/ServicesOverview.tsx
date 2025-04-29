
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Scale, ArrowRight } from 'lucide-react';
import SiteCard from "@/components/SiteCard";
import { Button } from '@/components/ui/button';

const ServicesOverview: React.FC = () => {
  return (
    <div className="py-8">
      {/* Top level service cards - Mental Health and Legal side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <SiteCard>
          <div className="mb-6 flex items-center">
            <div className="p-4 rounded-full bg-vibrantPurple/15 mr-4 flex items-center justify-center">
              <Brain className="h-10 w-10 text-vibrantPurple" />
            </div>
            <h3 className="text-2xl font-lora font-semibold text-gray-800">Mental Health Support</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our caring therapists help you work through emotional pain, relationship stress, and past trauma—so you can heal and move forward with confidence.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
              Mental Health Counselling - Support for anxiety, depression, and stress related to relationships.
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
              Couples Counselling - Rebuilding communication and trust in your relationship.
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
              Family Therapy - Strengthening bonds and resolving conflicts among family members.
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
              Sexual Health Counselling - Addressing intimacy concerns with professional guidance.
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
              Premarital Counselling - Building a strong foundation before marriage.
            </li>
          </ul>
          <Button asChild variant="link" className="text-vibrantPurple hover:text-vibrantPurple/90 p-0 gap-1 font-medium">
            <Link to="/services/mental-health">
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </SiteCard>
        
        <SiteCard className="bg-gradient-to-br from-white to-peacefulBlue/10">
          <div className="mb-6 flex items-center">
            <div className="p-4 rounded-full bg-peacefulBlue/15 mr-4 flex items-center justify-center">
              <Scale className="h-10 w-10 text-peacefulBlue" />
            </div>
            <h3 className="text-2xl font-lora font-semibold text-gray-800">Legal Support</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our legal experts guide you through the complexities of family law—whether it's pre-marital agreements, divorce, or custody—always with compassion and clarity.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
              Pre-marriage Legal Consultation - Understanding rights and agreements before marriage.
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
              Mediation Services - Facilitating agreements without court intervention.
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
              Divorce Consultation - Expert guidance through separation and divorce processes.
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
              Child Custody Consultation - Protecting children's interests during family transitions.
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
              Maintenance Consultation - Advice on financial support arrangements.
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
              General Legal Consultation - Answers to common family law questions.
            </li>
          </ul>
          <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
            <Link to="/services/legal-support">
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </SiteCard>
      </div>
      
      {/* Holistic Solutions section will be handled by HolisticSolutions component */}
    </div>
  );
};

export default ServicesOverview;
