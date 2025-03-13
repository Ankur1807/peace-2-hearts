
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Mock data for news articles
const newsData = [
  {
    id: 1,
    title: "Supreme Court Simplifies Mutual Divorce Process in India",
    excerpt: "In a landmark judgment, the Supreme Court has reduced the waiting period for mutual consent divorce, making the process more accessible.",
    category: "Legal Updates",
    date: "October 15, 2023",
    author: "Legal Team",
    image: "bg-peacefulBlue/20",
    featured: true,
    url: "/news/divorce-process-simplified"
  },
  {
    id: 2,
    title: "Study Reveals Rising Divorce Rates Among Young Urban Couples",
    excerpt: "Recent research indicates a significant increase in divorce rates among couples aged 25-35 in metropolitan cities across India.",
    category: "Research",
    date: "September 28, 2023",
    author: "Research Department",
    image: "bg-warmPeach/20",
    featured: true,
    url: "/news/rising-divorce-rates"
  },
  {
    id: 3,
    title: "New Mental Health Initiative for Couples Launched in Delhi",
    excerpt: "A government-backed program aims to provide free counseling services to couples experiencing relationship difficulties.",
    category: "Mental Health",
    date: "September 10, 2023",
    author: "Health Correspondent",
    image: "bg-peacefulBlue/10",
    featured: false,
    url: "/news/mental-health-initiative"
  },
  {
    id: 4,
    title: "Celebrity Divorce Highlights Importance of Prenuptial Agreements",
    excerpt: "Recent high-profile separation brings attention to the legal protections offered by prenuptial agreements in India.",
    category: "Legal Insights",
    date: "August 22, 2023",
    author: "Entertainment Desk",
    image: "bg-warmPeach/10",
    featured: false,
    url: "/news/prenuptial-agreements"
  },
  {
    id: 5,
    title: "Dating App Usage Surges Post-Pandemic in India",
    excerpt: "Market research shows a 45% increase in dating app downloads across major Indian cities following the COVID-19 pandemic.",
    category: "Relationships",
    date: "August 15, 2023",
    author: "Technology Reporter",
    image: "bg-peacefulBlue/20",
    featured: false,
    url: "/news/dating-app-surge"
  },
  {
    id: 6,
    title: "Court Grants Alimony to Husband in Landmark Case",
    excerpt: "In a progressive judgment, the High Court awarded maintenance to a husband, setting a precedent for gender-neutral alimony laws.",
    category: "Legal Updates",
    date: "July 30, 2023",
    author: "Legal Team",
    image: "bg-warmPeach/20",
    featured: false,
    url: "/news/alimony-landmark-case"
  },
  {
    id: 7,
    title: "New Support Group for Divorced Parents Launches Nationwide",
    excerpt: "A non-profit initiative provides emotional and practical support for parents navigating life after divorce.",
    category: "Support",
    date: "July 12, 2023",
    author: "Community Affairs",
    image: "bg-peacefulBlue/10",
    featured: false,
    url: "/news/support-group-divorced-parents"
  },
  {
    id: 8,
    title: "Study Links Communication Patterns to Marriage Longevity",
    excerpt: "Research from leading universities identifies specific communication styles that contribute to successful long-term marriages.",
    category: "Research",
    date: "June 28, 2023",
    author: "Research Department",
    image: "bg-warmPeach/10",
    featured: false,
    url: "/news/communication-marriage-longevity"
  }
];

const News = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const categories = [
    { value: "all", label: "All News" },
    { value: "legal-updates", label: "Legal Updates" },
    { value: "research", label: "Research" },
    { value: "mental-health", label: "Mental Health" },
    { value: "relationships", label: "Relationships" },
    { value: "support", label: "Support" }
  ];
  
  const filteredNews = newsData.filter(news => {
    const matchesSearch = 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeTab === "all" || 
      news.category.toLowerCase().replace(" ", "-") === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  const featuredNews = newsData.filter(news => news.featured);
  
  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 wave-pattern">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6">Latest News</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              India's first dedicated news portal covering relationships, marriage, and divorce. Stay informed about the latest developments and trends.
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-12 bg-softGray">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-lora font-semibold mb-8 text-gray-800">Featured Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredNews.map((news) => (
                <div key={news.id} className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg group">
                  <div className={`h-64 ${news.image}`}></div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-medium bg-peacefulBlue/10 text-peacefulBlue rounded-full py-1 px-2">
                        {news.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {news.date}
                      </div>
                    </div>
                    <h3 className="text-2xl font-lora font-semibold text-gray-800 mb-2 group-hover:text-peacefulBlue transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{news.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        {news.author}
                      </div>
                      <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
                        <Link to={news.url}>
                          Read Full Story <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Search and Filter */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-auto flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search news..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-peacefulBlue/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="bg-gray-100 p-1 overflow-x-auto flex gap-1 w-full justify-start md:justify-center">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.value} 
                      value={category.value}
                      className="text-sm whitespace-nowrap px-3 py-1 data-[state=active]:bg-peacefulBlue data-[state=active]:text-white"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
      
      {/* News Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredNews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((news) => (
                <div key={news.id} className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group">
                  <div className={`h-48 ${news.image}`}></div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-medium bg-peacefulBlue/10 text-peacefulBlue rounded-full py-1 px-2">
                        {news.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {news.date}
                      </div>
                    </div>
                    <h3 className="text-xl font-lora font-semibold text-gray-800 mb-2 group-hover:text-peacefulBlue transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{news.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        {news.author}
                      </div>
                      <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
                        <Link to={news.url}>
                          Read More <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-2">No news found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
              <Button onClick={() => {setSearchQuery(""); setActiveTab("all");}}>
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
            <h2 className="text-3xl font-lora font-semibold mb-4 text-gray-800">Stay Updated</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter and be the first to receive the latest news and insights about relationships, marriage, and divorce in India.
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

export default News;
