
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, HeartPulse, Gavel, Users, MessageSquare, Calendar, PackageCheck } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Services = () => {
  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 wave-pattern">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6">Our Services</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Comprehensive support for your relationship journey, combining mental health expertise and legal guidance with a focus on divorce prevention.
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
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Mental Health Counselling</h3>
                  <p className="text-gray-600">
                    Structured therapy sessions to rebuild trust and resolve conflicts in relationships.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Family Therapy</h3>
                  <p className="text-gray-600">
                    Strengthening family bonds by addressing conflicts and fostering understanding.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Premarital Counselling</h3>
                  <p className="text-gray-600">
                    Preparing couples for a strong and fulfilling marriage through guided discussions and planning.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Couples Counselling</h3>
                  <p className="text-gray-600">
                    Professional guidance to strengthen communication and mutual understanding.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Sexual Health Counselling</h3>
                  <p className="text-gray-600">
                    Specialized support for addressing intimacy concerns and enhancing relationship satisfaction.
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
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Pre-marriage Legal Consultation</h3>
                  <p className="text-gray-600">
                    Guidance on rights, agreements, and legal aspects to ensure a secure foundation before marriage.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Mediation Services</h3>
                  <p className="text-gray-600">
                    Facilitating peaceful resolutions to legal disputes through guided, collaborative dialogue.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Divorce Consultation</h3>
                  <p className="text-gray-600">
                    Gain expert insights into the legal aspects of divorce to make informed decisions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Child Custody Consultation</h3>
                  <p className="text-gray-600">
                    Support for understanding and advocating in custody decisions for the best outcomes for children.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">Maintenance Consultation</h3>
                  <p className="text-gray-600">
                    Advice on alimony, financial support, and equitable agreements for separated or divorced partners.
                  </p>
                </div>
              </div>
              
              <Button asChild className="bg-peacefulBlue hover:bg-peacefulBlue/90 text-white">
                <Link to="/services/legal-support">Learn More About Legal Services</Link>
              </Button>
            </div>
          </div>
          
          {/* Holistic Solutions Section */}
          <div className="mt-16 mb-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="section-title text-3xl font-lora font-semibold text-gray-800">Holistic Solution Packages</h2>
              <p className="text-gray-600 mt-4">
                Our integrated packages combine mental health support and legal guidance to provide comprehensive care for your specific relationship journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div className="mb-6 flex items-center">
                  <div className="p-3 rounded-full bg-vibrantPurple/15 mr-4">
                    <PackageCheck className="h-7 w-7 text-vibrantPurple" />
                  </div>
                  <h3 className="text-xl font-lora font-semibold text-gray-800">Divorce Prevention Package</h3>
                </div>
                
                <p className="text-gray-600 mb-4">
                  A comprehensive approach to resolving relationship challenges before they lead to separation, combining therapy and legal mediation.
                </p>
                
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                    2 Therapy Sessions
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                    1 Mediation Session
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-vibrantPurple"></span>
                    1 Legal Consultation
                  </li>
                </ul>
                
                <Button asChild className="bg-vibrantPurple hover:bg-vibrantPurple/90 text-white">
                  <Link to="/services/holistic/divorce-prevention">Learn More About This Package</Link>
                </Button>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div className="mb-6 flex items-center">
                  <div className="p-3 rounded-full bg-peacefulBlue/15 mr-4">
                    <PackageCheck className="h-7 w-7 text-peacefulBlue" />
                  </div>
                  <h3 className="text-xl font-lora font-semibold text-gray-800">Pre-Marriage Clarity Package</h3>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Start your marriage journey with confidence by addressing both emotional readiness and legal considerations.
                </p>
                
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                    1 Legal Consultation
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-peacefulBlue"></span>
                    2 Mental Health Sessions
                  </li>
                </ul>
                
                <Button asChild className="bg-peacefulBlue hover:bg-peacefulBlue/90 text-white">
                  <Link to="/services/holistic/pre-marriage-clarity">Learn More About This Package</Link>
                </Button>
              </div>
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
              <Link to="/book-consultation">Book Your Consultation Today</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Services;
