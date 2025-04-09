
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Heart, Users, Shield, Sparkles } from 'lucide-react';
import { SEO } from '@/components/SEO';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const AboutUs = () => {
  return (
    <>
      <GoogleAnalytics />
      <SEO 
        title="About Us"
        description="Learn about Peace2Hearts and our mission to provide compassionate mental health support and expert legal guidance for relationship challenges."
        keywords="relationship counseling team, mental health experts, legal consultants, relationship wellness, about Peace2Hearts"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 wave-pattern">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6">About Peace2Hearts</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We provide compassionate mental health support and expert legal guidance to help individuals navigate relationship challenges.
            </p>
          </div>
        </div>
      </section>
      
      {/* About Peace2Hearts Description */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-peacefulBlue/5 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-lora font-semibold mb-4 text-gray-800">About Peace2Hearts</h2>
              <p className="text-gray-600 mb-4">
                Peace2Hearts is India's first and only portal dedicated to relationships, marriages, and divorce. We aim to be a one-stop destination for everything related to love life and marriages in India.
              </p>
              <p className="text-gray-600 mb-4">
                With over 10 lakh dowry-related deaths per year (NCRB data), marriages are breaking apart at an increasing pace in India. Our mission is to provide guidance, legal and psychological assistance, and the right information needed to navigate love life and marriage smoothly.
              </p>
              <p className="text-gray-600">
                Founded by Ankur Bhardwaj, Peace2Hearts works with experienced therapists and legal professionals to offer comprehensive support for every stage of relationships—from new love to post-divorce recovery.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-lora font-semibold mb-4 text-gray-800">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                At Peace2Hearts, our mission is to provide holistic support to individuals navigating relationship challenges, combining expert mental health guidance and legal counsel to help people find peace and clarity, whether that means healing their relationships or moving forward on their own.
              </p>
              
              <h2 className="text-3xl font-lora font-semibold mb-4 text-gray-800 mt-8">Our Vision</h2>
              <p className="text-gray-600">
                We envision a world where relationship transitions are approached with compassion, dignity, and expert guidance, minimizing emotional trauma and legal complications. We strive to be the trusted partner that helps individuals and families navigate these challenges with confidence and emerge stronger.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-peacefulBlue/10 p-6 rounded-xl">
                <Heart className="h-10 w-10 text-peacefulBlue mb-4" />
                <h3 className="text-xl font-lora font-semibold mb-2 text-gray-800">Compassion</h3>
                <p className="text-gray-600">We approach every client with empathy and understanding, recognizing the emotional complexity of relationship challenges.</p>
              </div>
              
              <div className="bg-warmPeach/10 p-6 rounded-xl">
                <Shield className="h-10 w-10 text-peacefulBlue mb-4" />
                <h3 className="text-xl font-lora font-semibold mb-2 text-gray-800">Integrity</h3>
                <p className="text-gray-600">We uphold the highest ethical standards in all our interactions, prioritizing honesty and transparency.</p>
              </div>
              
              <div className="bg-warmPeach/10 p-6 rounded-xl">
                <Sparkles className="h-10 w-10 text-peacefulBlue mb-4" />
                <h3 className="text-xl font-lora font-semibold mb-2 text-gray-800">Excellence</h3>
                <p className="text-gray-600">We are committed to providing exceptional service through continuous learning and professional development.</p>
              </div>
              
              <div className="bg-peacefulBlue/10 p-6 rounded-xl">
                <Users className="h-10 w-10 text-peacefulBlue mb-4" />
                <h3 className="text-xl font-lora font-semibold mb-2 text-gray-800">Collaboration</h3>
                <p className="text-gray-600">We believe in a multidisciplinary approach, integrating mental health and legal expertise for comprehensive support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default AboutUs;
