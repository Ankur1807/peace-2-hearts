
import React from 'react';
import { Users, MessageSquare, Calendar } from 'lucide-react';

interface ApproachCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ApproachCard: React.FC<ApproachCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
      <div className="bg-peacefulBlue/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const OurApproach: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mt-16">
      <h2 className="section-title">Our Approach</h2>
      <p className="text-gray-600 mb-8">
        At Peace2Hearts, we believe in a holistic approach that addresses both the emotional and legal aspects of relationship challenges. Our team works collaboratively to provide comprehensive support tailored to your unique situation.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <ApproachCard 
          icon={<Users className="h-7 w-7 text-peacefulBlue" />} 
          title="Client-Centered" 
          description="We tailor our services to your unique needs, ensuring personalized support at every step."
        />
        
        <ApproachCard 
          icon={<MessageSquare className="h-7 w-7 text-peacefulBlue" />} 
          title="Collaborative" 
          description="Our mental health and legal teams work together to provide comprehensive, integrated support."
        />
        
        <ApproachCard 
          icon={<Calendar className="h-7 w-7 text-peacefulBlue" />} 
          title="Flexible" 
          description="We offer various service packages and scheduling options to accommodate your needs."
        />
      </div>
    </div>
  );
};

export default OurApproach;
