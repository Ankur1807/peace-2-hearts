
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Scale, Heart } from 'lucide-react';
import { FractalButton } from '@/components/FractalButton';

const ServicesSection = () => {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-gray-800 mb-4">Care That Meets You Where You Are</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive range of services is designed to support you through all aspects of 
            relationships – from emotional well-being to legal clarity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mental Health Support */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-all flex flex-col h-full offering-card">
            <div className="p-4 rounded-full bg-vibrantPurple/15 mb-6 self-center">
              <Brain className="h-10 w-10 text-vibrantPurple" />
            </div>
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4 text-center">Mental Health Support</h3>
            <p className="text-gray-600 mb-6">
              Our caring therapists help you work through emotional pain, relationship stress, and past trauma—so you 
              can heal and move forward with confidence.
            </p>
            <div className="mt-auto">
              <FractalButton asChild fractalType="primary" className="w-full">
                <Link to="/services/mental-health">
                  Learn More
                </Link>
              </FractalButton>
            </div>
          </div>
          
          {/* Legal Support */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-all flex flex-col h-full offering-card">
            <div className="p-4 rounded-full bg-peacefulBlue/15 mb-6 self-center">
              <Scale className="h-10 w-10 text-peacefulBlue" />
            </div>
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4 text-center">Legal Support</h3>
            <p className="text-gray-600 mb-6">
              Our legal experts guide you through the complexities of family law—whether it's pre-marital 
              agreements, divorce, or custody—always with compassion and clarity.
            </p>
            <div className="mt-auto">
              <FractalButton asChild fractalType="secondary" className="w-full">
                <Link to="/services/legal-support">
                  Learn More
                </Link>
              </FractalButton>
            </div>
          </div>
          
          {/* Holistic Packages */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-all flex flex-col h-full offering-card">
            <div className="p-4 rounded-full bg-gradient-to-r from-vibrantPurple to-peacefulBlue/70 mb-6 self-center">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4 text-center">Holistic Packages</h3>
            <p className="text-gray-600 mb-6">
              Comprehensive support packages that combine emotional and legal guidance 
              for couples and individuals at every stage of their relationship journey.
            </p>
            <div className="mt-auto">
              <FractalButton asChild fractalType="primary" className="w-full">
                <Link to="/services">
                  Explore Packages
                </Link>
              </FractalButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
