
import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { MandalaButton } from './MandalaButton';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb';

interface SubServiceLayoutProps {
  title: string;
  description: string;
  image: string;
  serviceType: 'mental-health' | 'legal-support';
  serviceName: string;
  benefits: string[];
  children?: ReactNode;
}

const SubServiceLayout = ({ 
  title, 
  description, 
  image, 
  serviceType, 
  serviceName, 
  benefits, 
  children 
}: SubServiceLayoutProps) => {
  const serviceTypeLabel = serviceType === 'mental-health' ? 'Mental Health Services' : 'Legal Services';
  
  const bookingUrl = `/book-consultation?service=${serviceType}&subservice=${serviceName}`;
  
  return (
    <>
      <Navigation />
      
      <main>
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/services">Services</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to={`/services/${serviceType}`}>{serviceTypeLabel}</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{title}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <section className="py-12 md:py-16 wave-pattern">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-6">
                <Link to={`/services/${serviceType}`} className="flex items-center text-peacefulBlue hover:underline mb-2">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to {serviceTypeLabel}
                </Link>
                <h1 className="section-title text-3xl md:text-4xl">{title}</h1>
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
        
        <section className="py-12 bg-softGray">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-2xl mb-8 text-center">Key Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                      <span className="text-peacefulBlue text-sm">✓</span>
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {children}
        
        <section className="py-12 bg-peacefulBlue/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="section-title text-2xl mb-4">Ready to Take the First Step?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Our professional team is here to support you through every step of your journey.
            </p>
            <Link to={bookingUrl}>
              <MandalaButton
                variant="primary"
                mandalaType="simple"
                className="text-2xl font-bold bg-white text-peacefulBlue hover:bg-white/90 rounded-full px-14 py-7 shadow-lg"
              >
                Book Your Consultation Now
                <ArrowRight className="ml-2 h-6 w-6" />
              </MandalaButton>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default SubServiceLayout;
