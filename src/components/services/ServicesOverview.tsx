
import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import { Brain, Scale, Heart, CircleDashed } from 'lucide-react';

const ServicesOverview: React.FC = () => {
  return (
    <div className="py-8">
      <h2 className="section-title text-3xl mb-8 text-center">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ServiceCard
          title="Mental Health Support"
          description="Professional therapy to help you navigate complex emotions and relationship challenges."
          icon={Brain}
          options={[
            { title: "Emotional Support", description: "Navigate difficult emotions with professional guidance" },
            { title: "Therapy Sessions", description: "One-on-one sessions with licensed therapists" }
          ]}
          linkPath="/services/mental-health"
          linkText="Learn More"
        />
        
        <ServiceCard
          title="Legal Support"
          description="Expert legal guidance for all relationship and family law matters."
          icon={Scale}
          options={[
            { title: "Legal Consultation", description: "Expert advice on family and relationship law" },
            { title: "Document Preparation", description: "Professional assistance with legal paperwork" }
          ]}
          linkPath="/services/legal-support"
          linkText="Learn More"
        />
        
        <ServiceCard
          title="Relationship Therapy"
          description="Work through conflicts and build stronger connections with specialized therapy."
          icon={Heart}
          options={[
            { title: "Couples Counseling", description: "Rebuild trust and improve communication" },
            { title: "Conflict Resolution", description: "Learn effective strategies to handle disagreements" }
          ]}
          linkPath="/services/therapy"
          linkText="Learn More"
        />
        
        <ServiceCard
          title="Divorce Support"
          description="Comprehensive guidance through the emotional and legal aspects of divorce."
          icon={CircleDashed}
          options={[
            { title: "Divorce Planning", description: "Navigate the process with professional support" },
            { title: "Post-Divorce Adjustment", description: "Tools for healing and moving forward" }
          ]}
          linkPath="/services/divorce"
          linkText="Learn More"
        />
      </div>
    </div>
  );
};

export default ServicesOverview;
