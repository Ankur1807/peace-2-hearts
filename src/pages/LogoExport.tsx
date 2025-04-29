
import React from 'react';
import { SEO } from '@/components/SEO';

const LogoExport: React.FC = () => {
  return (
    <>
      <SEO 
        title="Logo Export | Peace2Hearts"
        description="Download Peace2Hearts logo in various formats and sizes."
        keywords="logo download, brand assets, media kit"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center">Logo Export</h1>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <p className="text-gray-500 text-center">Logo export options will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoExport;
