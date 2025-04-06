
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FeaturedResourcesSection = () => {
  return (
    <section className="py-16 bg-softGray">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">Featured Resources</h2>
          <p className="text-gray-600">Explore our collection of articles, guides, and tools to help you navigate relationship challenges.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="h-48 bg-peacefulBlue/20"></div>
            <div className="p-6">
              <div className="mb-3">
                <span className="text-xs font-medium bg-peacefulBlue/10 text-peacefulBlue rounded-full py-1 px-2">Mental Health</span>
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-2 group-hover:text-peacefulBlue transition-colors">Coping with Breakups: A Guide to Emotional Healing</h3>
              <p className="text-gray-600 mb-4">Learn effective strategies to process grief, rebuild confidence, and move forward after a relationship ends.</p>
              <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
                <Link to="/resources/coping-with-breakups">
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="h-48 bg-warmPeach/20"></div>
            <div className="p-6">
              <div className="mb-3">
                <span className="text-xs font-medium bg-peacefulBlue/10 text-peacefulBlue rounded-full py-1 px-2">Legal Insights</span>
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-2 group-hover:text-peacefulBlue transition-colors">Understanding Divorce Laws: What You Need to Know</h3>
              <p className="text-gray-600 mb-4">A comprehensive guide to divorce proceedings, property division, and protecting your interests during separation.</p>
              <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
                <Link to="/resources/divorce-laws">
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="h-48 bg-peacefulBlue/10"></div>
            <div className="p-6">
              <div className="mb-3">
                <span className="text-xs font-medium bg-peacefulBlue/10 text-peacefulBlue rounded-full py-1 px-2">Self-Help</span>
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-2 group-hover:text-peacefulBlue transition-colors">Finding Yourself After Divorce: A Journey of Rediscovery</h3>
              <p className="text-gray-600 mb-4">Practical advice for rebuilding your identity, setting new goals, and embracing a fulfilling life after divorce.</p>
              <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
                <Link to="/resources/finding-yourself">
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="rounded-full px-6 py-3 border-peacefulBlue text-peacefulBlue hover:bg-peacefulBlue/5">
            <Link to="/resources">View All Resources</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResourcesSection;
