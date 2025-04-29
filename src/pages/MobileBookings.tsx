
import React from 'react';
import { SEO } from '@/components/SEO';

const MobileBookings: React.FC = () => {
  return (
    <>
      <SEO 
        title="Mobile Bookings | Peace2Hearts"
        description="Book consultations on the go with our mobile booking service at Peace2Hearts."
        keywords="mobile booking, appointment scheduling, consultation booking"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center">Mobile Bookings</h1>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <p className="text-gray-500 text-center">Mobile booking features will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileBookings;
