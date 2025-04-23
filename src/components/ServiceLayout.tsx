
import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { FractalButton } from './FractalButton';
import { MandalaButton } from './MandalaButton';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ServiceLayoutProps {
  title: string;
  description: string;
  forWhom: string[];
  howItWorks: string[];
  image: string;
  children?: ReactNode;
  serviceType?: string;
}

const ServiceLayout = ({ 
  title, 
  description, 
  forWhom, 
  howItWorks, 
  image, 
  children, 
  serviceType 
}: ServiceLayoutProps) => {
  const bookingUrl = serviceType 
    ? `/book-consultation?service=${serviceType}` 
    : '/book-consultation';
    
  return (
    <>
      <Navigation />
      
      <main>
        <section className="py-16 md:py-24 wave-pattern">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-6">
                <h1 className="section-title text-4xl md:text-5xl">{title}</h1>
                <p className="text-gray-600 text-lg">{description}</p>
                <div className="pt-4">
                  <Link to={bookingUrl}>
                    <MandalaButton 
                      variant="primary"
                      mandalaType="simple"
                      className="rounded-full px-14 py-7 text-2xl font-bold"
                    >
                      Book a Consultation
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </MandalaButton>
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
                <MandalaButton
                  variant="primary"
                  mandalaType="simple"
                  className="rounded-full px-14 py-7 text-2xl font-bold"
                >
                  Book Your Consultation Today
                </MandalaButton>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ServiceLayout;
