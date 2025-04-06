
import { ArrowRight, HeartPulse, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  return (
    <section className="py-16 bg-softGray">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">Our Services</h2>
          <p className="text-gray-600">We provide comprehensive support to help you navigate life's relationship challenges.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="service-card">
            <div className="mb-6 flex items-center">
              <div className="p-3 rounded-full bg-peacefulBlue/10 mr-4">
                <HeartPulse className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-2xl font-lora font-semibold text-gray-800">Mental Health Support</h3>
            </div>
            <p className="text-gray-600 mb-4">Our experienced therapists provide compassionate support to help you navigate emotional challenges, heal from past traumas, and build healthier relationships.</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                Individual therapy sessions
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                Relationship counseling
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                Trauma recovery support
              </li>
            </ul>
            <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
              <Link to="/services/mental-health">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="service-card">
            <div className="mb-6 flex items-center">
              <div className="p-3 rounded-full bg-peacefulBlue/10 mr-4">
                <Gavel className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-2xl font-lora font-semibold text-gray-800">Legal Support</h3>
            </div>
            <p className="text-gray-600 mb-4">Our legal experts provide guidance on all aspects of relationship law, from pre-marital agreements to divorce proceedings and custody arrangements.</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                Pre-marital legal advice
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                Divorce consultation and guidance
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                Child custody support
              </li>
            </ul>
            <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
              <Link to="/services/legal-support">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
