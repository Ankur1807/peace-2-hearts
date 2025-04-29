
import React from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '@/components/SEO';

const ConsultantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <>
      <SEO 
        title="Consultant Profile | Peace2Hearts"
        description="Learn more about this consultant and their expertise at Peace2Hearts."
        keywords="consultant profile, relationship expert, therapist details, legal advisor"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center">Consultant Profile</h1>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <p className="text-gray-500 text-center">Details for consultant ID: {id} will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantDetail;
