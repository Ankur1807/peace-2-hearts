
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Mock data for resources
const resourcesData = [
  {
    id: 1,
    title: "Coping with Breakups: A Guide to Emotional Healing",
    excerpt: "Learn effective strategies to process grief, rebuild confidence, and move forward after a relationship ends.",
    category: "Mental Health",
    image: "bg-peacefulBlue/20",
    url: "/resources/coping-with-breakups"
  },
  {
    id: 2,
    title: "Understanding Divorce Laws: What You Need to Know",
    excerpt: "A comprehensive guide to divorce proceedings, property division, and protecting your interests during separation.",
    category: "Legal Insights",
    image: "bg-warmPeach/20",
    url: "/resources/divorce-laws"
  },
  {
    id: 3,
    title: "Finding Yourself After Divorce: A Journey of Rediscovery",
    excerpt: "Practical advice for rebuilding your identity, setting new goals, and embracing a fulfilling life after divorce.",
    category: "Self-Help",
    image: "bg-peacefulBlue/10",
    url: "/resources/finding-yourself"
  },
  {
    id: 4,
    title: "Co-Parenting After Separation: Strategies for Success",
    excerpt: "Guidance on creating a healthy co-parenting relationship that prioritizes your children's wellbeing.",
    category: "Parenting",
    image: "bg-warmPeach/10",
    url: "/resources/co-parenting"
  },
  {
    id: 5,
    title: "Healing from Infidelity: Rebuilding Trust",
    excerpt: "Steps to process betrayal, rebuild trust, and decide whether to continue or end a relationship after infidelity.",
    category: "Mental Health",
    image: "bg-peacefulBlue/20",
    url: "/resources/healing-infidelity"
  },
  {
    id: 6,
    title: "Child Custody Rights: A Parent's Guide",
    excerpt: "Understanding different custody arrangements, legal terms, and how to advocate for your child's best interests.",
    category: "Legal Insights",
    image: "bg-warmPeach/20",
    url: "/resources/custody-rights"
  },
  {
    id: 7,
    title: "Healthy Communication in Relationships",
    excerpt: "Techniques for improving communication, resolving conflicts, and expressing needs effectively with your partner.",
    category: "Self-Help",
    image: "bg-peacefulBlue/10",
    url: "/resources/healthy-communication"
  },
  {
    id: 8,
    title: "Financial Planning Through Divorce",
    excerpt: "Guidance on managing finances, dividing assets, and creating financial stability during and after divorce.",
    category: "Legal Insights",
    image: "bg-warmPeach/10",
    url: "/resources/financial-planning"
  },
  {
    id: 9,
    title: "Recognizing Signs of Emotional Abuse",
    excerpt: "Learn to identify emotional abuse, understand its impact, and find resources for support and recovery.",
    category: "Mental Health",
    image: "bg-peacefulBlue/20",
    url: "/resources/emotional-abuse"
  }
];

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const categories = ["All", "Mental Health", "Legal Insights", "Self-Help", "Parenting"];
  
  const filteredResources = resourcesData.filter(resource => {
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 wave-pattern">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6">Resources & Blog</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our collection of articles, guides, and tools to help you navigate relationship challenges with confidence.
            </p>
          </div>
        </div>
      </section>
      
      {/* Search and Filter */}
      <section className="py-8 bg-softGray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-auto flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-peacefulBlue/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                      selectedCategory === category
                        ? "bg-peacefulBlue text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Resources Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredResources.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group">
                  <div className={`h-48 ${resource.image}`}></div>
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="text-xs font-medium bg-peacefulBlue/10 text-peacefulBlue rounded-full py-1 px-2">
                        {resource.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-lora font-semibold text-gray-800 mb-2 group-hover:text-peacefulBlue transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{resource.excerpt}</p>
                    <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
                      <Link to={resource.url}>
                        Read More <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
              <Button onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-warmPeach/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-lora font-semibold mb-4 text-gray-800">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Stay up-to-date with our latest resources, articles, and events. We'll deliver them straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 flex-1 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-peacefulBlue/50"
              />
              <Button className="bg-peacefulBlue hover:bg-peacefulBlue/90 text-white rounded-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Resources;
