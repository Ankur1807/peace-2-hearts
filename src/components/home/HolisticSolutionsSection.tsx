
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gem } from 'lucide-react';
import { FractalButton } from '@/components/FractalButton';

const HolisticSolutionsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-gray-800 mb-4">Our Holistic Solutions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Specially designed packages that combine mental health support and legal guidance
            for comprehensive care during critical relationship transitions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Pre-Marriage Clarity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full offering-card">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-vibrantPurple/15 mr-4">
                  <Sparkles className="h-8 w-8 text-vibrantPurple" />
                </div>
                <h3 className="text-xl font-lora font-semibold text-gray-800">Pre-Marriage Clarity</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Start your marriage journey with confidence by addressing emotional compatibility, communication patterns, 
                and legal considerations before tying the knot.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                  <span className="text-gray-700">Psychological and emotional readiness assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                  <span className="text-gray-700">Communication and conflict resolution skills</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                  <span className="text-gray-700">Financial compatibility planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                  <span className="text-gray-700">Pre-nuptial agreement consultation</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto p-8 pt-0">
              <FractalButton asChild fractalType="primary" className="w-full">
                <Link to="/services/holistic/pre-marriage-clarity">
                  Learn More
                </Link>
              </FractalButton>
            </div>
          </div>
          
          {/* Divorce Prevention */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full offering-card">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-peacefulBlue/15 mr-4">
                  <Gem className="h-8 w-8 text-peacefulBlue" />
                </div>
                <h3 className="text-xl font-lora font-semibold text-gray-800">Divorce Prevention</h3>
              </div>
              <p className="text-gray-600 mb-6">
                For couples on the brink, our integrated approach helps you evaluate whether the relationship 
                can be rebuilt or if a respectful separation is the healthier path.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  <span className="text-gray-700">Crisis intervention counseling</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  <span className="text-gray-700">Relationship repair assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  <span className="text-gray-700">Legal implications overview</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  <span className="text-gray-700">Separation planning (if needed)</span>
                </li>
              </ul>
            </div>
            <div className="mt-auto p-8 pt-0">
              <FractalButton asChild fractalType="secondary" className="w-full">
                <Link to="/services/holistic/divorce-prevention">
                  Learn More
                </Link>
              </FractalButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HolisticSolutionsSection;
