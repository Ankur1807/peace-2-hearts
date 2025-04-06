
import { ArrowRight, HeartPulse, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  return (
    <section className="py-16 bg-softGray">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title gradient-text">Care That Meets You Where You Are</h2>
          <p className="text-gray-600">Helping you find your footing when love feels uncertain, overwhelming, or just plain hard.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="service-card bg-gradient-to-br from-white to-softPink/10">
            <div className="mb-6 flex items-center">
              <div className="p-4 rounded-full bg-vibrantPurple/15 mr-4">
                <HeartPulse className="h-10 w-10 text-vibrantPurple" />
              </div>
              <h3 className="text-2xl font-lora font-semibold text-gray-800">Relationship Therapy & Support</h3>
            </div>
            <p className="text-gray-600 mb-4">Our caring therapists help you work through emotional pain, relationship stress, and past trauma—so you can heal and move forward with confidence.</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                Individual therapy sessions
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                Relationship counseling
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                Trauma recovery support
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                Therapy for anxiety and relationship stress
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                Tools for emotional healing and resilience
              </li>
            </ul>
            <Button asChild variant="link" className="text-vibrantPurple hover:text-vibrantPurple/90 p-0 gap-1 font-medium">
              <Link to="/services/mental-health">
                Explore Mental Health Support <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="service-card bg-gradient-to-br from-white to-peacefulBlue/10">
            <div className="mb-6 flex items-center">
              <div className="p-4 rounded-full bg-peacefulBlue/15 mr-4">
                <Gavel className="h-10 w-10 text-peacefulBlue" />
              </div>
              <h3 className="text-2xl font-lora font-semibold text-gray-800">Legal Clarity & Guidance</h3>
            </div>
            <p className="text-gray-600 mb-4">Our legal experts guide you through the complexities of family law—whether it's pre-marital agreements, divorce, or custody—always with compassion and clarity.</p>
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
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                Honest advice for marital agreements
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                Help with custody & co-parenting arrangements
              </li>
            </ul>
            <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
              <Link to="/services/legal-support">
                Explore Legal Help <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
