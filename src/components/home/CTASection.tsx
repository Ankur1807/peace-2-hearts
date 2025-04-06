
import { Link } from 'react-router-dom';
import { FractalButton } from '@/components/FractalButton';

const CTASection = () => {
  return (
    <section className="py-16 bg-peacefulBlue text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Ready to Take the First Step?</h2>
          <p className="text-lg mb-8 text-white/90">Our team of mental health and legal experts is here to support you through your relationship journey.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FractalButton asChild fractalType="primary" pulseEffect={true} className="bg-white text-peacefulBlue hover:bg-white/90 rounded-full px-6 py-3">
              <Link to="/book-consultation">Book a Consultation</Link>
            </FractalButton>
            <FractalButton asChild fractalType="outline" className="border-white text-peacefulBlue hover:bg-white/10 rounded-full px-6 py-3">
              <Link to="/contact">Contact Us</Link>
            </FractalButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
