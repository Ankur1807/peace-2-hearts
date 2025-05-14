import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteCard from "@/components/SiteCard";
const FeaturedResourcesSection = () => {
  // Define new resources data
  const featuredResources = [{
    id: 'mental-health-matrimonial',
    category: 'Mental Health',
    title: 'How Mental Health and Matrimonial Disputes Are Interconnected',
    summary: 'Learn how unresolved mental health issues can fuel relationship conflict — and how emotional wellness and legal stability go hand in hand.',
    gradient: 'bg-peacefulBlue/20',
    isComingSoon: true
  }, {
    id: 'our-story',
    category: 'Our Story',
    title: 'Why Peace2Hearts Exists: Rethinking Relationship Support in India',
    summary: 'A behind-the-scenes look at our mission to integrate mental health and legal support — and why this platform was built to make a difference.',
    gradient: 'bg-vibrantPurple/20',
    isComingSoon: true
  }, {
    id: 'legal-insights',
    category: 'Legal Insights',
    title: 'A Step-by-Step Guide to Mutual Divorce in India',
    summary: 'A practical guide to navigating a mutual divorce in India — from eligibility and process to protecting your rights at every stage.',
    gradient: 'bg-brightOrange/20',
    isComingSoon: true
  }];
  return <section className="py-16 bg-softGray">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">Featured Resources</h2>
          <p className="text-gray-600">Explore our collection of articles, guides, and tools to help you navigate relationship challenges.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {featuredResources.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
        </div>
        
        <div className="mt-12 text-center">
          
        </div>
      </div>
    </section>;
};
interface ResourceCardProps {
  resource: {
    id: string;
    category: string;
    title: string;
    summary: string;
    gradient: string;
    isComingSoon: boolean;
  };
}
const ResourceCard = ({
  resource
}: ResourceCardProps) => {
  const {
    category,
    title,
    summary,
    gradient,
    isComingSoon
  } = resource;
  return <SiteCard className="flex flex-col h-full hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className={cn("h-48", gradient)}></div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3">
          <span className="text-xs font-medium bg-peacefulBlue/10 text-peacefulBlue rounded-full py-1 px-2">
            {category}
          </span>
        </div>
        <h3 className="text-xl font-lora font-semibold text-gray-800 mb-2 group-hover:text-peacefulBlue transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 flex-grow">{summary}</p>
        
        {isComingSoon ? <div className="flex items-center gap-1 text-gray-400">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Coming Soon</span>
          </div> : <Link to={`/resources/${resource.id}`} className="flex items-center gap-1 text-peacefulBlue hover:text-peacefulBlue/90 font-medium">
            <span>Read More</span>
            <BookOpen className="h-4 w-4" />
          </Link>}
      </div>
    </SiteCard>;
};
export default FeaturedResourcesSection;