
import { ArrowRight, PackageCheck, Heart, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HolisticSolutionsSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title gradient-text">Holistic Solutions</h2>
          <p className="text-gray-600">Comprehensive care packages combining mental health support and legal guidance for your specific relationship journey.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <div className="mb-6 flex items-center">
              <div className="p-4 rounded-full bg-vibrantPurple/15 mr-4">
                <PackageCheck className="h-8 w-8 text-vibrantPurple" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800">Divorce Prevention Package</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              A comprehensive approach to resolving relationship challenges before they lead to separation, combining therapy and legal mediation.
            </p>
            
            <div className="mb-6 space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Heart className="h-5 w-5 text-vibrantPurple" />
                </div>
                <div className="ml-3">
                  <p className="text-gray-700 font-medium">2 Therapy Sessions</p>
                  <p className="text-gray-600 text-sm">Address emotional challenges and improve communication</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Gavel className="h-5 w-5 text-peacefulBlue" />
                </div>
                <div className="ml-3">
                  <p className="text-gray-700 font-medium">1 Mediation Session</p>
                  <p className="text-gray-600 text-sm">Resolve conflicts with professional guidance</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Gavel className="h-5 w-5 text-peacefulBlue" />
                </div>
                <div className="ml-3">
                  <p className="text-gray-700 font-medium">1 Legal Consultation</p>
                  <p className="text-gray-600 text-sm">Understand your legal rights and options</p>
                </div>
              </div>
            </div>
            
            <Button asChild variant="link" className="text-vibrantPurple hover:text-vibrantPurple/90 p-0 gap-1 font-medium">
              <Link to="/services/holistic/divorce-prevention">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <div className="mb-6 flex items-center">
              <div className="p-4 rounded-full bg-peacefulBlue/15 mr-4">
                <PackageCheck className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800">Pre-Marriage Clarity Package</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Start your marriage journey with confidence by addressing both emotional readiness and legal considerations.
            </p>
            
            <div className="mb-6 space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Gavel className="h-5 w-5 text-peacefulBlue" />
                </div>
                <div className="ml-3">
                  <p className="text-gray-700 font-medium">1 Legal Consultation</p>
                  <p className="text-gray-600 text-sm">Understand marriage laws and financial implications</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Heart className="h-5 w-5 text-vibrantPurple" />
                </div>
                <div className="ml-3">
                  <p className="text-gray-700 font-medium">2 Mental Health Sessions</p>
                  <p className="text-gray-600 text-sm">Explore relationship expectations and communication styles</p>
                </div>
              </div>
            </div>
            
            <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
              <Link to="/services/holistic/pre-marriage-clarity">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HolisticSolutionsSection;
