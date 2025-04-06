
import { Link } from 'react-router-dom';
import { FractalButton } from '@/components/FractalButton';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-peacefulBlue to-softGreen text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Take a Small Step Toward Clarity and Support</h2>
          <p className="text-lg mb-8 text-white/90">Legal or emotional, we'll walk you through it—gently, honestly, and at your pace.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FractalButton asChild fractalType="primary" pulseEffect={true} className="text-lg font-bold bg-white text-peacefulBlue hover:bg-white/90 rounded-full px-8 py-4">
              <Link to="/book-consultation">Get Support Now</Link>
            </FractalButton>
            <FractalButton asChild fractalType="outline" className="text-lg font-bold border-white hover:bg-white/10 rounded-full px-8 py-4">
              <Link to="/contact" className="text-white">Contact Us</Link>
            </FractalButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
