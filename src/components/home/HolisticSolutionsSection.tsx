
import { ArrowRight, PackageCheck, Heart, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const pastelCard =
  "bg-gradient-to-br from-white to-softPink/10 shadow-md hover:shadow-lg transition-all duration-300";

const pastelIconBg = "bg-vibrantPurple/15";
const pastelLegalIconBg = "bg-peacefulBlue/15";

const HolisticSolutionsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="section-title gradient-text">Holistic Solutions</h2>
          <p className="text-gray-600">Comprehensive care packages combining mental health support and legal guidance for your specific relationship journey.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-12">
          <div className={`${pastelCard} rounded-xl p-10 flex flex-col h-full min-h-[450px]`}>
            <div className="mb-7 flex items-center">
              <div className={`${pastelIconBg} p-4 rounded-full mr-4 shadow`}>
                <PackageCheck className="h-8 w-8 text-vibrantPurple" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800">Divorce Prevention Package</h3>
            </div>
            
            <p className="text-gray-600 mb-5">
              A comprehensive approach to resolving relationship challenges before they lead to separation, combining therapy and legal mediation.
            </p>
            
            <div className="mb-8 space-y-4">
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
            
            <Button asChild variant="link" className="text-vibrantPurple hover:text-vibrantPurple/90 p-0 gap-1 font-medium mt-auto">
              <Link to="/services/holistic/divorce-prevention">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className={`${pastelCard} rounded-xl p-10 flex flex-col h-full min-h-[450px]`}>
            <div className="mb-7 flex items-center">
              <div className={`${pastelLegalIconBg} p-4 rounded-full mr-4 shadow`}>
                <PackageCheck className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800">Pre-Marriage Clarity Package</h3>
            </div>
            
            <p className="text-gray-600 mb-5">
              Start your marriage journey with confidence by addressing both emotional readiness and legal considerations.
            </p>
            
            <div className="mb-8 space-y-4">
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
            
            <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium mt-auto">
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

