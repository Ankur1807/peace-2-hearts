import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, HeartPulse, Gavel, Users, MessageSquare, Book, Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
const Services = () => {
  return <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 wave-pattern">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6">Our Services</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Comprehensive support for your relationship journey, combining mental health expertise and legal guidance.
            </p>
          </div>
        </div>
      </section>
      
      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="service-card">
              <div className="mb-6">
                <div className="p-3 rounded-full bg-peacefulBlue/10 inline-block mb-4">
                  <HeartPulse className="h-8 w-8 text-peacefulBlue" />
                </div>
                <h2 className="text-3xl font-lora font-semibold text-gray-800">Mental Health Services</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Our mental health services provide emotional support and guidance to individuals and couples navigating relationship challenges, whether you're working to strengthen your relationship or heal from a breakup.
              </p>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Individual Therapy</h3>
                  <p className="text-gray-600">
                    One-on-one sessions with our experienced therapists to help you process emotions, build coping strategies, and develop personal resilience.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Relationship Counseling</h3>
                  <p className="text-gray-600">
                    Guided sessions for couples to improve communication, resolve conflicts, and strengthen your relationship foundation.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Trauma Recovery</h3>
                  <p className="text-gray-600">
                    Specialized support for individuals dealing with relationship trauma, including infidelity, abuse, or difficult breakups.
                  </p>
                </div>
              </div>
              
              <Button asChild className="bg-peacefulBlue hover:bg-peacefulBlue/90 text-white">
                <Link to="/services/mental-health">Learn More About Mental Health Services</Link>
              </Button>
            </div>
            
            <div className="service-card">
              <div className="mb-6">
                <div className="p-3 rounded-full bg-peacefulBlue/10 inline-block mb-4">
                  <Gavel className="h-8 w-8 text-peacefulBlue" />
                </div>
                <h2 className="text-3xl font-lora font-semibold text-gray-800">Legal Support</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Our legal experts provide guidance on all aspects of relationship law, helping you understand your rights and navigate legal processes with confidence.
              </p>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Pre-marital Legal Advice</h3>
                  <p className="text-gray-600">
                    Consultations on prenuptial agreements, asset protection, and legal considerations before marriage.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Divorce Guidance</h3>
                  <p className="text-gray-600">
                    Comprehensive support through the divorce process, including property division, financial settlements, and legal documentation.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Custody Support</h3>
                  <p className="text-gray-600">
                    Expert guidance on child custody arrangements, parenting plans, and legal advocacy for your children's best interests.
                  </p>
                </div>
              </div>
              
              <Button asChild className="bg-peacefulBlue hover:bg-peacefulBlue/90 text-white">
                <Link to="/services/legal-support" className="mx-0 px-[24px] my-[48px]">Learn More About Legal Services</Link>
              </Button>
            </div>
          </div>
          
          <div className="text-center max-w-3xl mx-auto mt-16">
            <h2 className="section-title">Our Approach</h2>
            <p className="text-gray-600 mb-8">
              At Peace2Hearts, we believe in a holistic approach that addresses both the emotional and legal aspects of relationship challenges. Our team works collaboratively to provide comprehensive support tailored to your unique situation.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="bg-peacefulBlue/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-peacefulBlue" />
                </div>
                <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Client-Centered</h3>
                <p className="text-gray-600">We tailor our services to your unique needs, ensuring personalized support at every step.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="bg-peacefulBlue/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-7 w-7 text-peacefulBlue" />
                </div>
                <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Collaborative</h3>
                <p className="text-gray-600">Our mental health and legal teams work together to provide comprehensive, integrated support.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="bg-peacefulBlue/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-7 w-7 text-peacefulBlue" />
                </div>
                <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Flexible</h3>
                <p className="text-gray-600">We offer various service packages and scheduling options to accommodate your needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Consultation Section */}
      <section className="py-16 bg-peacefulBlue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Schedule a Consultation</h2>
            <p className="text-lg mb-8 text-white/90">
              Take the first step toward finding clarity and support in your relationship journey. Our initial consultation helps us understand your needs and create a personalized support plan.
            </p>
            <Button asChild className="bg-white text-peacefulBlue hover:bg-white/90 rounded-full px-6 py-3">
              <Link to="/book">Book Your Consultation Today</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </>;
};
export default Services;