
import React from 'react';
import { SEO } from '@/components/SEO';

const News: React.FC = () => {
  return (
    <>
      <SEO 
        title="News | Peace2Hearts"
        description="Stay updated with the latest news and announcements from Peace2Hearts."
        keywords="relationship news, mental health updates, legal advice, relationship counseling news"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center">News & Updates</h1>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <p className="text-gray-500 text-center">No news articles available at this time.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default News;
