
import React from 'react';
import { Link } from 'react-router-dom';
import { FractalButton } from '@/components/FractalButton';

const ConsultationCTA: React.FC = () => {
  return (
    <section className="py-16 bg-peacefulBlue text-white">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="max-w-3xl text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Schedule a Consultation</h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl">
            Take the first step toward finding clarity and support in your relationship journey. Our initial consultation helps us understand your needs and create a personalized support plan.
          </p>
          <FractalButton asChild fractalType="cta" className="text-lg">
            <Link to="/book-consultation">Book Your Consultation Today</Link>
          </FractalButton>
        </div>
      </div>
    </section>
  );
};

export default ConsultationCTA;

