
import React from 'react';
import { Link } from 'react-router-dom';
import { FractalButton } from '@/components/FractalButton';

const ConsultationCTA: React.FC = () => {
  return (
    <section className="py-16 bg-peacefulBlue text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Schedule a Consultation</h2>
          <p className="text-lg mb-8 text-white/90">
            Take the first step toward finding clarity and support in your relationship journey. Our initial consultation helps us understand your needs and create a personalized support plan.
          </p>
          <div className="inline-block sm:w-auto w-full">
            <FractalButton asChild fractalType="cta" className="text-lg">
              <Link to="/book-consultation" className="inline-block w-full">Book Your Consultation Today</Link>
            </FractalButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationCTA;
