import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { MandalaButton } from './MandalaButton';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MentalHealthHeroBanner from './services/mental-health/MentalHealthHeroBanner';
import LegalSupportHeroBanner from './services/legal-support/LegalSupportHeroBanner';
interface ServiceLayoutProps {
  title: string;
  description: string;
  forWhom: string[];
  howItWorks: string[];
  image: string;
  children?: ReactNode;
  serviceType?: string;
  customHeroBanner?: ReactNode;
}
const ServiceLayout = ({
  title,
  description,
  forWhom = [],
  howItWorks = [],
  image,
  children,
  serviceType,
  customHeroBanner
}: ServiceLayoutProps) => {
  const bookingUrl = serviceType ? `/book-consultation?service=${serviceType}` : '/book-consultation';
  const renderHeroBanner = () => {
    // If a custom banner is provided, use it
    if (customHeroBanner) {
      return customHeroBanner;
    }

    // Otherwise, use the default banner logic
    if (serviceType === 'mental-health') {
      return <MentalHealthHeroBanner className="h-full w-full min-h-[250px] sm:min-h-[350px] shadow-lg" />;
    } else if (serviceType === 'legal-support') {
      return <LegalSupportHeroBanner className="h-full w-full min-h-[250px] sm:min-h-[350px] shadow-lg" />;
    } else {
      // Fallback to the image
      return <img src={image} alt={title} className="rounded-xl shadow-lg w-full h-auto object-cover" />;
    }
  };
  return <>
      <Navigation />
      
      <main>
        <section className="py-12 md:py-24 wave-pattern">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
              <div className="w-full md:w-1/2 space-y-4 md:space-y-6 mb-6 md:mb-0">
                <h1 className="section-title text-3xl md:text-5xl">{title}</h1>
                <p className="text-gray-600 text-base md:text-lg">{description}</p>
                <div className="pt-2 md:pt-4">
                  <Link to={bookingUrl}>
                    <MandalaButton variant="primary" mandalaType="simple" className="rounded-full px-8 md:px-14 py-4 md:py-7 text-lg md:text-2xl font-bold">
                      Book a Consultation
                      <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                    </MandalaButton>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 min-h-[250px]">
                {renderHeroBanner()}
              </div>
            </div>
          </div>
        </section>
        
        
        
        
        
        {children}
        
        <section className="py-16 bg-gradient-to-r from-peacefulBlue to-softGreen text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">
                Schedule a Consultation
              </h2>
              <p className="text-lg mb-8 text-white/90">
                Take the first step toward finding clarity and support in your relationship journey. 
                Our initial consultation helps us understand your needs and create a personalized support plan.
              </p>
              <Link to={bookingUrl}>
                <MandalaButton variant="primary" mandalaType="simple" className="rounded-full px-14 py-7 text-2xl font-bold">
                  Book Your Consultation Today
                </MandalaButton>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>;
};
export default ServiceLayout;