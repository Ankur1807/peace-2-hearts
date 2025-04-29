
import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';

const ServicesOverview: React.FC = () => {
  return (
    <div className="py-8">
      <h2 className="section-title text-3xl mb-8 text-center">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/services/mental-health">
          <ServiceCard
            title="Mental Health Support"
            description="Professional therapy to help you navigate complex emotions and relationship challenges."
            icon="mentalHealth"
          />
        </Link>
        
        <Link to="/services/legal-support">
          <ServiceCard
            title="Legal Support"
            description="Expert legal guidance for all relationship and family law matters."
            icon="legalSupport"
          />
        </Link>
        
        <Link to="/services/therapy">
          <ServiceCard
            title="Relationship Therapy"
            description="Work through conflicts and build stronger connections with specialized therapy."
            icon="relationshipTherapy"
          />
        </Link>
        
        <Link to="/services/divorce">
          <ServiceCard
            title="Divorce Support"
            description="Comprehensive guidance through the emotional and legal aspects of divorce."
            icon="divorceSupport"
          />
        </Link>
      </div>
    </div>
  );
};

export default ServicesOverview;
