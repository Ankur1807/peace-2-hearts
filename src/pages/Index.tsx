
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SideWaves from '@/components/SideWaves';
import WaveBackground from '@/components/WaveBackground';
import { SEO } from '@/components/SEO';
import { OrganizationSchema } from '@/components/StructuredData';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import HolisticSolutionsSection from '@/components/home/HolisticSolutionsSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import CTASection from '@/components/home/CTASection';

const HomePage = () => {
  // Organization social media links for schema
  const socialLinks = [
    "https://facebook.com/peace2hearts",
    "https://twitter.com/peace2hearts",
    "https://instagram.com/peace2hearts",
    "https://linkedin.com/company/peace2hearts"
  ];

  return (
    <>
      <SEO 
        title="Supporting You Before, During & After Marriage" 
        description="Focused on saving Indian marriages, we offer divorce prevention, psychological support, and legal help to manage complex relationship challenges." 
        keywords="relationship counseling, divorce support, mental health, legal consultation, couples therapy, family law, relationship challenges, India, Delhi"
        canonicalUrl="/"
        language="en"
      />
      <OrganizationSchema sameAs={socialLinks} />
      <Navigation />
      <SideWaves />
      <WaveBackground />
      
      <HeroSection />
      <ServicesSection />
      <HolisticSolutionsSection />
      <WhyChooseUsSection />
      <CTASection />
      
      <Footer />
    </>
  );
};

export default HomePage;
