
import React from 'react';
import { SEO } from '@/components/SEO';

const Resources: React.FC = () => {
  return (
    <>
      <SEO 
        title="Resources | Peace2Hearts"
        description="Access helpful resources, guides, and articles about relationships, mental health, and legal matters."
        keywords="relationship resources, self-help guides, mental health articles, legal resources"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center">Resources</h1>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <p className="text-gray-500 text-center">Resource materials will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resources;
