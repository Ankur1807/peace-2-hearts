
import { Link } from 'react-router-dom';
import { FractalButton } from '@/components/FractalButton';

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center wave-pattern py-16">
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6 leading-tight text-center lg:text-6xl">Helping you find peace, with or without love</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-center">Peace2Hearts is India's first dedicated space offering divorce prevention, emotional support, and legal clarity—because relationships deserve more than silence or struggle.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FractalButton asChild fractalType="primary" pulseEffect={true} className="text-lg font-bold hero-btn rounded-full px-8 py-4">
              <Link to="/book-consultation">Speak to an Expert</Link>
            </FractalButton>
            <FractalButton asChild fractalType="outline" className="text-lg font-bold rounded-full px-8 py-4 border-peacefulBlue text-peacefulBlue">
              <Link to="/services">Start Exploring Support Options</Link>
            </FractalButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
