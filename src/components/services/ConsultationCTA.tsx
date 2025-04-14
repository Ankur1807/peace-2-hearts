
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ConsultationCTA: React.FC = () => {
  return (
    <section className="py-16 bg-peacefulBlue text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Schedule a Consultation</h2>
          <p className="text-lg mb-8 text-white/90">
            Take the first step toward finding clarity and support in your relationship journey. Our initial consultation helps us understand your needs and create a personalized support plan.
          </p>
          <Button asChild className="bg-white text-peacefulBlue hover:bg-white/90 rounded-full px-6 py-3">
            <Link to="/book-consultation">Book Your Consultation Today</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ConsultationCTA;
