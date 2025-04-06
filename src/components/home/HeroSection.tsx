
import { Link } from 'react-router-dom';
import { FractalButton } from '@/components/FractalButton';

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center wave-pattern py-16">
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6 leading-tight text-center lg:text-6xl">Helping you find peace, with or without love</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-center">India's first integrated platform offering comprehensive solutions to relationship challenges through mental health support and legal expertise.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FractalButton asChild fractalType="primary" pulseEffect={true} className="hero-btn rounded-full px-6 py-3">
              <Link to="/book-consultation">Book a Consultation</Link>
            </FractalButton>
            <FractalButton asChild fractalType="outline" className="rounded-full px-6 py-3 border-peacefulBlue text-peacefulBlue">
              <Link to="/services">Explore Our Services</Link>
            </FractalButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
