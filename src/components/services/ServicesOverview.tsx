
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Scale, Heart, UserRound, Users, FileSearch, Gavel, ArrowRight } from 'lucide-react';
import SiteCard from "@/components/SiteCard";
import ServiceCard from './ServiceCard';
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
              Mental Health Counselling
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
              Couples Counselling
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
              Family Therapy
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
              Sexual Health Counselling
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
              Divorce Consultation
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
              Child Custody Consultation
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
              Maintenance Consultation
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
              General Legal Consultation
            </li>
          </ul>
          <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
            <Link to="/services/legal-support">
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </SiteCard>
      </div>
      
      {/* Display all services below */}
      <h2 className="section-title text-3xl mb-8 text-center">Our Individual Services</h2>
      
      {/* Mental Health Services */}
      <h3 className="text-2xl mb-6 font-lora text-gray-800">Mental Health Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ServiceCard
          title="Mental Health Counselling"
          description="Professional therapy to help you navigate complex emotions and relationship challenges."
          icon={Brain}
          options={[
            { title: "Individual Sessions", description: "One-on-one therapy with licensed professionals" },
            { title: "Personalized Support", description: "Tailored strategies for your specific needs" }
          ]}
          linkPath="/services/mentalhealth/mental-health-counselling"
          linkText="Learn More"
        />
        
        <ServiceCard
          title="Couples Counselling"
          description="Work through conflicts and build stronger connections with specialized therapy."
          icon={Users}
          options={[
            { title: "Relationship Improvement", description: "Rebuild trust and enhance communication" },
            { title: "Conflict Resolution", description: "Learn effective strategies for disagreements" }
          ]}
          linkPath="/services/mentalhealth/couples-counselling"
          linkText="Learn More"
        />
        
        <ServiceCard
          title="Family Therapy"
          description="Address and resolve family conflicts through professional guidance."
          icon={Heart}
          options={[
            { title: "Family Dynamics", description: "Understand and improve family relationships" },
            { title: "Parenting Support", description: "Develop effective parenting strategies" }
          ]}
          linkPath="/services/mentalhealth/family-therapy"
          linkText="Learn More"
        />
        
        <ServiceCard
          title="Sexual Health Counselling"
          description="Confidential support for intimate relationship concerns."
          icon={UserRound}
          options={[
            { title: "Intimate Issues", description: "Address concerns in a safe environment" },
            { title: "Relationship Intimacy", description: "Improve connection with your partner" }
          ]}
          linkPath="/services/mentalhealth/sexual-health-counselling"
          linkText="Learn More"
        />
      </div>
      
      {/* Legal Services */}
      <h3 className="text-2xl mb-6 font-lora text-gray-800">Legal Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <ServiceCard
          title="Divorce Consultation"
          description="Expert guidance through the legal aspects of divorce proceedings."
          icon={Scale}
          options={[
            { title: "Legal Process", description: "Navigate divorce proceedings with expert guidance" },
            { title: "Rights Assessment", description: "Understand your legal rights and options" }
          ]}
          linkPath="/services/legal/divorce-consultation"
          linkText="Learn More"
        />
        
        <ServiceCard
          title="Child Custody Consultation"
          description="Specialized advice on child custody matters and parental rights."
          icon={Gavel}
          options={[
            { title: "Custody Arrangements", description: "Understanding custody options and processes" },
            { title: "Child Welfare Focus", description: "Prioritizing the best interests of children" }
          ]}
          linkPath="/services/legal/child-custody-consultation"
          linkText="Learn More"
        />
        
        <ServiceCard
          title="Maintenance Consultation"
          description="Legal advice on alimony, child support, and financial matters."
          icon={FileSearch}
          options={[
            { title: "Financial Planning", description: "Assistance with support calculations" },
            { title: "Rights Protection", description: "Ensuring fair financial arrangements" }
          ]}
          linkPath="/services/legal/maintenance-consultation"
          linkText="Learn More"
        />
        
        <ServiceCard
          title="General Legal Consultation"
          description="Broad legal guidance for various family and relationship matters."
          icon={Scale}
          options={[
            { title: "Legal Advice", description: "Expert counsel on various legal matters" },
            { title: "Document Review", description: "Professional assessment of legal documents" }
          ]}
          linkPath="/services/legal/general-consultation"
          linkText="Learn More"
        />
      </div>
    </div>
  );
};

export default ServicesOverview;
