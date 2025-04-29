
import React from 'react';
import { MandalaButton } from '@/components/MandalaButton';

const ConsultationCTA: React.FC = () => {
  return (
    <section className="py-16 bg-sky-500 text-white">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="max-w-3xl text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Schedule a Consultation</h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl">
            Take the first step toward finding clarity and support in your relationship journey. Our initial consultation helps us understand your needs and create a personalized support plan.
          </p>
          <div className="w-full sm:w-auto">
            <MandalaButton
              variant="cta"
              mandalaType="lotus"
              href="/book-consultation"
              className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-400 hover:from-purple-700 hover:to-teal-500"
            >
              Book Your Consultation Today
            </MandalaButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationCTA;
