
import { Link } from 'react-router-dom';
import { MandalaButton } from '@/components/MandalaButton';

const HeroSection = () => {
  return (
    <section className="relative min-h-[650px] flex items-center wave-pattern pt-28 pb-16">
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6 leading-tight text-center lg:text-6xl">Helping you find peace, with or without love</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-center">Peace2Hearts is India's first dedicated space offering divorce prevention, emotional support, and legal clarity—because relationships deserve more than silence or struggle.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/book-consultation" className="w-full sm:w-auto">
              <MandalaButton 
                variant="primary" 
                mandalaType="complex"
                className="text-2xl px-16 py-8 rounded-full font-bold"
              >
                Speak to an Expert
              </MandalaButton>
            </Link>
            <Link to="/services" className="w-full sm:w-auto">
              <MandalaButton 
                variant="secondary" 
                mandalaType="simple"
                className="text-2xl px-16 py-8 rounded-full font-bold"
              >
                Start Exploring Support Options
              </MandalaButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
