
import { Link } from 'react-router-dom';
import { MandalaButton } from '@/components/MandalaButton';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-peacefulBlue to-softGreen text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Take a Small Step Toward Clarity and Support</h2>
          <p className="text-lg mb-8 text-white/90">Legal or emotional, we'll walk you through it—gently, honestly, and at your pace.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/book-consultation" className="w-full sm:w-auto">
              <MandalaButton
                variant="primary"
                mandalaType="simple"
                className="text-2xl px-16 py-8 rounded-full font-bold"
              >
                Get Support Now
              </MandalaButton>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <MandalaButton
                variant="primary"
                mandalaType="simple"
                className="text-2xl px-16 py-8 rounded-full font-bold"
              >
                Contact Us
              </MandalaButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
