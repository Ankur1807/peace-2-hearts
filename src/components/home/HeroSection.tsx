
import { Link } from 'react-router-dom';
import { MandalaButton } from '@/components/MandalaButton';

const HeroSection = () => {
  return (
    <section className="relative min-h-[650px] flex items-center wave-pattern pt-28 pb-16">
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6 leading-tight text-center lg:text-6xl">
            Helping you find peace, with or without love
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-center">
            Bringing expert clarity to love, marriage, and separation — because every relationship deserves more than silence.
          </p>
          
          {/* Added SEO-rich paragraphs */}
          <div className="mb-8 space-y-3">
            <p className="text-md text-gray-600">
              Peace2Hearts offers relationship wellness and legal support for individuals, couples, and families seeking clarity and care.
            </p>
            <p className="text-md text-gray-600">
              Whether you're navigating emotional conflict or legal uncertainty, Peace2Hearts is built to support you with compassion and clarity.
            </p>
            <p className="text-md text-gray-600">
              Our platform connects you with verified mental health professionals and legal experts who understand the sensitive nature of relationships.
            </p>
            <p className="text-md text-gray-600">
              Start with a conversation. Find your next step with confidence.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/book-consultation" className="w-full sm:w-auto">
              <MandalaButton variant="primary" mandalaType="complex" className="text-3xl px-16 py-8 rounded-full font-bold">
                Speak to an Expert
              </MandalaButton>
            </Link>
            <Link to="/services" className="w-full sm:w-auto">
              <MandalaButton variant="secondary" mandalaType="simple" className="text-3xl px-16 py-8 rounded-full font-bold">
                Explore Support Options
              </MandalaButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
