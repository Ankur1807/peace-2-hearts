
import React from 'react';
import { SEO } from '@/components/SEO';

const ShippingDelivery: React.FC = () => {
  return (
    <>
      <SEO 
        title="Shipping & Delivery | Peace2Hearts"
        description="Information about our shipping and delivery policies at Peace2Hearts."
        keywords="shipping policy, delivery information, order processing"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center">Shipping & Delivery</h1>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <p className="text-gray-500 text-center">Shipping and delivery information will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingDelivery;
