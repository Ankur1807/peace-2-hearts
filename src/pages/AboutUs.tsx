
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Heart, Users, Shield, Sparkles } from 'lucide-react';

const AboutUs = () => {
  return (
    <>
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
      
      {/* Story Section */}
      <section className="py-16 bg-softGray">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-lora font-semibold mb-6 text-gray-800 text-center">Our Story</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <p className="text-gray-600 mb-4">
                Peace2Hearts was founded in 2018 by Dr. Elena Rodriguez, a clinical psychologist, and Michael Chen, a family law attorney, who both witnessed the profound impact that relationship challenges had on their clients' mental health and legal well-being.
              </p>
              <p className="text-gray-600 mb-4">
                Through their respective practices, they observed a consistent pattern: clients navigating relationship difficulties needed both emotional support and legal guidance, yet these services were typically provided in isolation from each other.
              </p>
              <p className="text-gray-600 mb-4">
                Recognizing this gap, Elena and Michael envisioned a comprehensive approach that would address both the emotional and legal aspects of relationship transitions. They brought together a team of compassionate mental health professionals and experienced family law attorneys to create Peace2Hearts.
              </p>
              <p className="text-gray-600">
                Today, Peace2Hearts continues to grow, guided by the founding vision of providing holistic support to individuals and families during some of life's most challenging transitions. Our integrated approach has helped thousands of clients find clarity, healing, and a path forward—with or without their partners.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Our Expert Team</h2>
            <p className="text-gray-600">Meet the dedicated professionals who provide compassionate support and expert guidance.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-lora font-semibold text-gray-800">Dr. Elena Rodriguez</h3>
              <p className="text-peacefulBlue font-medium mb-2">Founder, Clinical Psychologist</p>
              <p className="text-gray-600 text-sm">Specializing in relationship trauma and emotional healing.</p>
            </div>
            
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-lora font-semibold text-gray-800">Michael Chen, Esq.</h3>
              <p className="text-peacefulBlue font-medium mb-2">Founder, Family Law Attorney</p>
              <p className="text-gray-600 text-sm">Expert in divorce proceedings and custody arrangements.</p>
            </div>
            
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-lora font-semibold text-gray-800">Dr. Sarah Johnson</h3>
              <p className="text-peacefulBlue font-medium mb-2">Relationship Therapist</p>
              <p className="text-gray-600 text-sm">Specializing in couples counseling and communication skills.</p>
            </div>
            
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-lora font-semibold text-gray-800">James Wilson, Esq.</h3>
              <p className="text-peacefulBlue font-medium mb-2">Family Law Attorney</p>
              <p className="text-gray-600 text-sm">Expert in mediation and collaborative divorce processes.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default AboutUs;
