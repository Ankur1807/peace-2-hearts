
import React from 'react';
import { HeartPulse, Gavel } from 'lucide-react';
import ServiceCard from './ServiceCard';

const ServicesOverview: React.FC = () => {
  const mentalHealthOptions = [
    {
      title: "Mental Health Counselling",
      description: "Structured therapy sessions to rebuild trust and resolve conflicts in relationships."
    },
    {
      title: "Family Therapy",
      description: "Strengthening family bonds by addressing conflicts and fostering understanding."
    },
    {
      title: "Premarital Counselling",
      description: "Preparing couples for a strong and fulfilling marriage through guided discussions and planning."
    },
    {
      title: "Couples Counselling",
      description: "Professional guidance to strengthen communication and mutual understanding."
    },
    {
      title: "Sexual Health Counselling",
      description: "Specialized support for addressing intimacy concerns and enhancing relationship satisfaction."
    }
  ];

  const legalOptions = [
    {
      title: "Pre-marriage Legal Consultation",
      description: "Guidance on rights, agreements, and legal aspects to ensure a secure foundation before marriage."
    },
    {
      title: "Mediation Services",
      description: "Facilitating peaceful resolutions to legal disputes through guided, collaborative dialogue."
    },
    {
      title: "Divorce Consultation",
      description: "Gain expert insights into the legal aspects of divorce to make informed decisions."
    },
    {
      title: "Child Custody Consultation",
      description: "Support for understanding and advocating in custody decisions for the best outcomes for children."
    },
    {
      title: "Maintenance Consultation",
      description: "Advice on alimony, financial support, and equitable agreements for separated or divorced partners."
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-12 mb-16">
      <ServiceCard
        icon={HeartPulse}
        title="Mental Health Services"
        description="Our mental health services provide emotional support and guidance to individuals and couples navigating relationship challenges, whether you're working to strengthen your relationship or heal from a breakup."
        options={mentalHealthOptions}
        linkPath="/services/mental-health"
        linkText="Learn More About Mental Health Services"
      />
      
      <ServiceCard
        icon={Gavel}
        title="Legal Support"
        description="Our legal experts provide guidance on all aspects of relationship law, helping you understand your rights and navigate legal processes with confidence."
        options={legalOptions}
        linkPath="/services/legal-support"
        linkText="Learn More About Legal Services"
      />
    </div>
  );
};

export default ServicesOverview;
