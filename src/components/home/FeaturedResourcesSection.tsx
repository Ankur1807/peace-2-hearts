
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FeaturedResourcesSection = () => {
  const resources = [
    {
      title: "Signs Your Relationship Needs Professional Help",
      category: "Mental Health",
      image: "https://images.unsplash.com/photo-1484069560501-87d72b0c3669?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      link: "/resources"
    },
    {
      title: "What to Expect in Your First Counseling Session",
      category: "Guidance",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      link: "/resources"
    },
    {
      title: "Understanding Divorce Laws in India",
      category: "Legal",
      image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      link: "/resources"
    }
  ];
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-lora font-bold text-gray-800 mb-4">Resources & Insights</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Expert-written guides to help you navigate relationship complexities and make informed decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <Link to={resource.link} key={index} className="group">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full border border-gray-100 transform transition duration-300 hover:-translate-y-1 hover:shadow-md offering-card">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={resource.image} 
                    alt={resource.title} 
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="text-sm font-medium text-peacefulBlue">{resource.category}</span>
                  <h3 className="text-lg font-lora font-semibold text-gray-800 mt-2">{resource.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/resources">
              View All Resources
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResourcesSection;
