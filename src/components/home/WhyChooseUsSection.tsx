
import React from 'react';
import { Heart, ShieldCheck, CheckCircle } from 'lucide-react';

const WhyChooseUsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-gray-800 mb-4">Why Choose Peace2Hearts</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We've built a service that we wish existed when we needed help - 
            combining professional guidance with human warmth and accessibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Compassionate Approach */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-peacefulBlue/10 mb-4">
                <Heart className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Compassionate Approach</h3>
              <p className="text-gray-600">
                Every consultation is handled with dignity, respect, and deep understanding of how vulnerable relationship challenges can feel.
              </p>
            </div>
          </div>

          {/* Verified Experts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-peacefulBlue/10 mb-4">
                <ShieldCheck className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Verified Experts</h3>
              <p className="text-gray-600">
                Our consultants are rigorously vetted professionals with specialized experience in relationship dynamics and family law.
              </p>
            </div>
          </div>

          {/* Integrated Support */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-peacefulBlue/10 mb-4">
                <CheckCircle className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Integrated Support</h3>
              <p className="text-gray-600">
                Our unique approach combines emotional and legal support to address the full spectrum of relationship challenges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
