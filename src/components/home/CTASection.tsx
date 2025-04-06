
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
            <FractalButton asChild fractalType="primary" pulseEffect={true} className="bg-white text-peacefulBlue hover:bg-white/90 rounded-full px-6 py-3">
              <Link to="/book-consultation">Get Support Now</Link>
            </FractalButton>
            <FractalButton asChild fractalType="outline" className="border-white text-white hover:bg-white/10 rounded-full px-6 py-3">
              <Link to="/contact">Contact Us</Link>
            </FractalButton>
          </div>
          
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
            <p className="text-white/90">134 N Block, Main Road, Mohan Nagar, Bhondsi, Gurgaon – 122102</p>
            <p className="text-white/80 text-sm mt-2">Just let us know in advance when you drop by — we'd love to have the kettle ready.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
