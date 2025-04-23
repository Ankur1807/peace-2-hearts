
import { MandalaButton } from '@/components/MandalaButton';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-peacefulBlue to-softGreen text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Take a Small Step Toward Clarity and Support</h2>
          <p className="text-lg mb-8 text-white/90">Legal or emotional, we'll walk you through it—gently, honestly, and at your pace.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <MandalaButton
              variant="primary"
              mandalaType="simple"
              href="/book-consultation"
              className="text-lg"
            >
              Get Support Now
            </MandalaButton>
            <MandalaButton
              variant="primary"
              mandalaType="simple"
              href="/contact"
              className="text-lg"
            >
              Contact Us
            </MandalaButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

