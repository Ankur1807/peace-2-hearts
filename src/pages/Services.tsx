
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesOverview from '@/components/services/ServicesOverview';
import HolisticSolutions from '@/components/services/HolisticSolutions';
import OurApproach from '@/components/services/OurApproach';
import ConsultationCTA from '@/components/services/ConsultationCTA';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const Services = () => {
  return (
    <>
      <GoogleAnalytics />
      <Navigation />
      
      <ServicesHero />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ServicesOverview />
          <HolisticSolutions />
          <OurApproach />
        </div>
      </section>
      
      <ConsultationCTA />
      
      <Footer />
    </>
  );
};

export default Services;
