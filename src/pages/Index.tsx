
import { ArrowRight, Heart, Gavel, HeartPulse, Book, MessageSquare, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FractalButton } from '@/components/FractalButton';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SideWaves from '@/components/SideWaves';
import WaveBackground from '@/components/WaveBackground';
import { SEO } from '@/components/SEO';
import { OrganizationSchema } from '@/components/StructuredData';

const HomePage = () => {
  // Organization social media links for schema
  const socialLinks = [
    "https://facebook.com/peace2hearts",
    "https://twitter.com/peace2hearts",
    "https://instagram.com/peace2hearts",
    "https://linkedin.com/company/peace2hearts"
  ];

  return (
    <>
      <SEO 
        title="Relationship Wellness & Divorce Prevention" 
        description="Expert prevention-focused mental health and legal support for relationships. Our unique approach helps couples strengthen bonds and navigate challenges before they lead to divorce." 
        keywords="divorce prevention, relationship counseling, marriage guidance, couples therapy, family law, relationship challenges, proactive relationship care, India, Delhi"
        canonicalUrl="/"
        language="en"
      />
      <OrganizationSchema sameAs={socialLinks} />
      <Navigation />
      <SideWaves />
      <WaveBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center wave-pattern py-16">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6 leading-tight text-center lg:text-6xl">Preventing divorce, preserving relationships</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-center">India's first integrated platform offering preventive solutions to relationship challenges through proactive mental health support and legal expertise.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FractalButton asChild fractalType="primary" pulseEffect={true} className="hero-btn rounded-full px-6 py-3">
                <Link to="/book-consultation">Prevent Relationship Breakdown</Link>
              </FractalButton>
              <FractalButton asChild fractalType="outline" className="rounded-full px-6 py-3 border-peacefulBlue text-peacefulBlue">
                <Link to="/services">Explore Preventive Services</Link>
              </FractalButton>
            </div>
          </div>
        </div>
      </section>
      
      {/* Prevention Focus Section - NEW */}
      <section className="py-16 bg-warmPeach/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Why Prevention Matters</h2>
            <p className="text-gray-600">Our prevention-first approach helps couples address issues before they lead to separation or divorce.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-peacefulBlue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Early Intervention</h3>
              <p className="text-gray-600">Addressing relationship issues early prevents them from becoming insurmountable problems that lead to divorce.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-peacefulBlue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Relationship Strengthening</h3>
              <p className="text-gray-600">Building communication skills and emotional bonds creates resilience against future challenges.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-peacefulBlue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Proactive Support</h3>
              <p className="text-gray-600">Our dual approach of mental health and legal guidance creates a complete safety net for your relationship.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-softGray">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Our Prevention-Focused Services</h2>
            <p className="text-gray-600">We provide comprehensive support to help prevent relationship breakdown and divorce.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="service-card">
              <div className="mb-6 flex items-center">
                <div className="p-3 rounded-full bg-peacefulBlue/10 mr-4">
                  <HeartPulse className="h-8 w-8 text-peacefulBlue" />
                </div>
                <h3 className="text-2xl font-lora font-semibold text-gray-800">Mental Health Support</h3>
              </div>
              <p className="text-gray-600 mb-4">Our preventive approach helps couples identify and address emotional challenges before they threaten your relationship's foundation.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Early intervention therapy
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Preventive relationship counseling
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Communication skills building
                </li>
              </ul>
              <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
                <Link to="/services/mental-health">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="service-card">
              <div className="mb-6 flex items-center">
                <div className="p-3 rounded-full bg-peacefulBlue/10 mr-4">
                  <Gavel className="h-8 w-8 text-peacefulBlue" />
                </div>
                <h3 className="text-2xl font-lora font-semibold text-gray-800">Preventive Legal Support</h3>
              </div>
              <p className="text-gray-600 mb-4">Our legal experts help you understand rights and responsibilities, creating clarity that prevents misunderstandings that often lead to divorce.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Preventive legal planning
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Relationship agreements
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Conflict resolution guidance
                </li>
              </ul>
              <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
                <Link to="/services/legal-support">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Why Expert Guidance Matters</h2>
            <p className="text-gray-600">Relationship challenges can be complex – our dual approach ensures both your emotional and legal needs are addressed.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-peacefulBlue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Compassionate Care</h3>
              <p className="text-gray-600">Our team approaches every client with empathy, understanding the emotional complexities of relationship challenges.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-peacefulBlue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Expert Knowledge</h3>
              <p className="text-gray-600">Our professionals bring years of experience in both mental health and legal fields to provide comprehensive support.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-peacefulBlue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Tailored Approach</h3>
              <p className="text-gray-600">Every relationship situation is unique, which is why we customize our approach to address your specific needs.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Resources */}
      <section className="py-16 bg-softGray">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Divorce Prevention Resources</h2>
            <p className="text-gray-600">Explore our collection of articles, guides, and tools to help strengthen your relationship and prevent divorce.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group">
              <div className="h-48 bg-peacefulBlue/20"></div>
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-medium bg-peacefulBlue/10 text-peacefulBlue rounded-full py-1 px-2">Prevention</span>
                </div>
                <h3 className="text-xl font-lora font-semibold text-gray-800 mb-2 group-hover:text-peacefulBlue transition-colors">5 Warning Signs Your Relationship Needs Attention Before It's Too Late</h3>
                <p className="text-gray-600 mb-4">Learn to identify early indicators of relationship distress and take preventive action before considering divorce.</p>
                <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
                  <Link to="/resources/relationship-warning-signs">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group">
              <div className="h-48 bg-warmPeach/20"></div>
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-medium bg-peacefulBlue/10 text-peacefulBlue rounded-full py-1 px-2">Legal Prevention</span>
                </div>
                <h3 className="text-xl font-lora font-semibold text-gray-800 mb-2 group-hover:text-peacefulBlue transition-colors">Preventive Legal Agreements That Strengthen Marriages</h3>
                <p className="text-gray-600 mb-4">How clear legal frameworks can actually prevent misunderstandings and conflicts that often lead to divorce.</p>
                <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
                  <Link to="/resources/preventive-legal-agreements">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group">
              <div className="h-48 bg-peacefulBlue/10"></div>
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-medium bg-peacefulBlue/10 text-peacefulBlue rounded-full py-1 px-2">Communication</span>
                </div>
                <h3 className="text-xl font-lora font-semibold text-gray-800 mb-2 group-hover:text-peacefulBlue transition-colors">Communication Techniques That Prevent Divorce</h3>
                <p className="text-gray-600 mb-4">Master these proven communication strategies to resolve conflicts and strengthen your bond before problems escalate.</p>
                <Button asChild variant="link" className="text-peacefulBlue hover:text-peacefulBlue/90 p-0 gap-1 font-medium">
                  <Link to="/resources/preventive-communication">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline" className="rounded-full px-6 py-3 border-peacefulBlue text-peacefulBlue hover:bg-peacefulBlue/5">
              <Link to="/resources">View All Prevention Resources</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 peach-pattern">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Prevention Success Stories</h2>
            <p className="text-gray-600">Read about how Peace2Hearts has helped couples prevent divorce and strengthen their relationships.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="testimonial-card">
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-yellow-400">★</span>)}
              </div>
              <p className="text-gray-600 mb-4 italic">"We were heading toward divorce when we found Peace2Hearts. Their preventive approach helped us identify the root causes of our issues and rebuild our relationship stronger than ever."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Priya & Rahul</h4>
                  <p className="text-sm text-gray-500">Prevention Success</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-yellow-400">★</span>)}
              </div>
              <p className="text-gray-600 mb-4 italic">"The early intervention therapy at Peace2Hearts helped us address communication issues before they became serious. Their prevention-focused approach saved our marriage."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Michael & David</h4>
                  <p className="text-sm text-gray-500">Relationship Strengthening</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-yellow-400">★</span>)}
              </div>
              <p className="text-gray-600 mb-4 italic">"The preventive legal guidance helped us establish clear expectations and agreements. This clarity removed tensions that were pushing us toward separation."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Aisha & Vikram</h4>
                  <p className="text-sm text-gray-500">Prevention Client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-peacefulBlue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Prevent Divorce, Preserve Your Relationship</h2>
            <p className="text-lg mb-8 text-white/90">Take proactive steps today with our prevention-focused team of mental health and legal experts.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FractalButton asChild fractalType="primary" pulseEffect={true} className="bg-white text-peacefulBlue hover:bg-white/90 rounded-full px-6 py-3">
                <Link to="/book-consultation">Schedule Prevention Session</Link>
              </FractalButton>
              <FractalButton asChild fractalType="outline" className="border-white text-peacefulBlue hover:bg-white/10 rounded-full px-6 py-3">
                <Link to="/contact">Learn About Prevention</Link>
              </FractalButton>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default HomePage;
