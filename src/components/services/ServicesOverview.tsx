
import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import { Brain, Scale, Heart, UserRound, Users, FileSearch, Gavel } from 'lucide-react';

const ServicesOverview: React.FC = () => {
  return (
    <div className="py-8">
      <h2 className="section-title text-3xl mb-8 text-center">Our Services</h2>
      
      {/* Mental Health Services */}
      <h3 className="text-2xl mb-6 font-lora text-gray-800">Mental Health Support</h3>
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
      <h3 className="text-2xl mb-6 font-lora text-gray-800">Legal Support</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
