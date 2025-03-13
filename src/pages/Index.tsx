import { ArrowRight, Heart, Gavel, HeartPulse, Book, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FractalButton } from '@/components/FractalButton';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SideWaves from '@/components/SideWaves';
import WaveBackground from '@/components/WaveBackground';

const HomePage = () => {
  return <>
      <Navigation />
      <SideWaves />
      <WaveBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center wave-pattern py-16">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-lora font-bold text-gray-800 mb-6 leading-tight">
              Helping you find peace, with or without love.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Expert mental health and legal support for individuals navigating relationship challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FractalButton asChild fractalType="primary" pulseEffect={true} className="hero-btn rounded-full px-6 py-3">
                <Link to="/book-consultation">Book a Consultation</Link>
              </FractalButton>
              <FractalButton asChild fractalType="outline" className="rounded-full px-6 py-3 border-peacefulBlue text-peacefulBlue">
                <Link to="/services">Explore Our Services</Link>
              </FractalButton>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-softGray">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Our Services</h2>
            <p className="text-gray-600">We provide comprehensive support to help you navigate life's relationship challenges.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="service-card">
              <div className="mb-6 flex items-center">
                <div className="p-3 rounded-full bg-peacefulBlue/10 mr-4">
                  <HeartPulse className="h-8 w-8 text-peacefulBlue" />
                </div>
                <h3 className="text-2xl font-lora font-semibold text-gray-800">Mental Health Support</h3>
              </div>
              <p className="text-gray-600 mb-4">Our experienced therapists provide compassionate support to help you navigate emotional challenges, heal from past traumas, and build healthier relationships.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Individual therapy sessions
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Relationship counseling
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Trauma recovery support
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
                <h3 className="text-2xl font-lora font-semibold text-gray-800">Legal Support</h3>
              </div>
              <p className="text-gray-600 mb-4">Our legal experts provide guidance on all aspects of relationship law, from pre-marital agreements to divorce proceedings and custody arrangements.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Pre-marital legal advice
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Divorce consultation and guidance
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                  Child custody support
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
      
      {/* Testimonials */}
      <section className="py-16 peach-pattern">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Client Stories</h2>
            <p className="text-gray-600">Read about how Peace2Hearts has helped others navigate their relationship challenges.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="testimonial-card">
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-yellow-400">★</span>)}
              </div>
              <p className="text-gray-600 mb-4 italic">"The combined legal and emotional support I received during my divorce was invaluable. Peace2Hearts guided me through every step of the process with compassion and expertise."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Sarah L.</h4>
                  <p className="text-sm text-gray-500">Divorce Client</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-yellow-400">★</span>)}
              </div>
              <p className="text-gray-600 mb-4 italic">"When my partner and I were struggling, the relationship counseling at Peace2Hearts helped us develop better communication skills and rebuild our trust. We're now stronger than ever."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Michael & David</h4>
                  <p className="text-sm text-gray-500">Relationship Counseling</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-yellow-400">★</span>)}
              </div>
              <p className="text-gray-600 mb-4 italic">"The custody guidance provided by Peace2Hearts was clear, practical, and centered on my child's wellbeing. Their approach helped reduce conflict and find solutions that worked for everyone."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-800">Jennifer R.</h4>
                  <p className="text-sm text-gray-500">Custody Client</p>
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
            <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Ready to Take the First Step?</h2>
            <p className="text-lg mb-8 text-white/90">Our team of mental health and legal experts is here to support you through your relationship journey.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FractalButton asChild fractalType="primary" pulseEffect={true} className="bg-white text-peacefulBlue hover:bg-white/90 rounded-full px-6 py-3">
                <Link to="/book-consultation">Book a Consultation</Link>
              </FractalButton>
              <FractalButton asChild fractalType="outline" className="border-white text-white hover:bg-white/10 rounded-full px-6 py-3">
                <Link to="/contact">Contact Us</Link>
              </FractalButton>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>;
};
export default HomePage;
