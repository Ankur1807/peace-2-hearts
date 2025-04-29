
import React from 'react';
import { SEO } from '@/components/SEO';

const Consultants: React.FC = () => {
  return (
    <>
      <SEO 
        title="Our Consultants | Peace2Hearts"
        description="Meet our team of experienced mental health and legal consultants at Peace2Hearts."
        keywords="relationship consultants, therapists, legal advisors, marriage counselors"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center">Our Consultants</h1>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <p className="text-gray-500 text-center">Consultant profiles will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Consultants;
