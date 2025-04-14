
import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { Button } from './ui/button';
import { FractalButton } from './FractalButton';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ServiceLayoutProps {
  title: string;
  description: string;
  forWhom: string[];
  howItWorks: string[];
  image: string;
  children?: ReactNode;
  serviceType?: string; // Add this prop to allow passing the service type
}

const ServiceLayout = ({ title, description, forWhom, howItWorks, image, children, serviceType }: ServiceLayoutProps) => {
  // Create the booking URL with service type parameter if available
  const bookingUrl = serviceType 
    ? `/book-consultation?service=${serviceType}` 
    : '/book-consultation';
    
  return (
    <>
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 wave-pattern">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-6">
                <h1 className="section-title text-4xl md:text-5xl">{title}</h1>
                <p className="text-gray-600 text-lg">{description}</p>
                <div className="pt-4">
                  <Link to={bookingUrl}>
                    <FractalButton className="hero-btn rounded-full px-6 py-3" fractalType="primary">
                      Book a Consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </FractalButton>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={image} 
                  alt={title} 
                  className="rounded-xl shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* For Whom Section */}
        <section className="py-16 bg-softGray">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-3xl mb-8 text-center">Who Can Benefit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {forWhom.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-peacefulBlue/20 text-peacefulBlue mb-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-3xl mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-peacefulBlue text-white text-xl font-semibold mb-4">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(100%_-_1rem)] w-full h-0.5 bg-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Additional Content */}
        {children}
        
        {/* CTA Section */}
        <section className="py-16 bg-peacefulBlue/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="section-title text-3xl mb-4">Ready to Take the First Step?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Our professional team is here to support you through every step of your journey.
            </p>
            <Link to={bookingUrl}>
              <FractalButton className="hero-btn rounded-full px-6 py-3" fractalType="primary" pulseEffect={true}>
                Book Your Consultation Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </FractalButton>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ServiceLayout;
