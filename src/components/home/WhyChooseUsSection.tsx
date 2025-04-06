
import { Heart, BookOpen, MessageSquare, Shield, Bell, Users } from 'lucide-react';

const WhyChooseUsSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">Why Expert Guidance Matters</h2>
          <p className="text-gray-600">Relationship challenges can be complex—our holistic approach ensures both your emotional and legal needs are addressed.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="bg-vibrantPurple/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-10 w-10 text-vibrantPurple" />
            </div>
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Compassionate Care</h3>
            <p className="text-gray-600">We approach every client with empathy, recognizing the emotional complexities of relationship struggles.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="bg-peacefulBlue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-10 w-10 text-peacefulBlue" />
            </div>
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Expert Knowledge</h3>
            <p className="text-gray-600">Our team brings deep expertise in both mental health and family law to offer well-rounded, practical support.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="bg-brightOrange/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-10 w-10 text-brightOrange" />
            </div>
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Tailored Approach</h3>
            <p className="text-gray-600">No two relationships are the same. We adapt our care to meet your unique needs, stage, and story.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="bg-vividPink/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-10 w-10 text-vividPink" />
            </div>
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">No-Strings-Attached Legal Help</h3>
            <p className="text-gray-600">Legal consultations without pressure—just honest advice, without the push to litigate.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="bg-softGreen/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Bell className="h-10 w-10 text-softGreen" />
            </div>
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Divorce Prevention Focus</h3>
            <p className="text-gray-600">We believe separation isn't always the only option. When there's a chance for repair, we'll help you explore it.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="bg-paleYellow/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-brightOrange" />
            </div>
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Empathetic, Trusted Team</h3>
            <p className="text-gray-600">From your first call to every session, expect warmth, care, and zero judgment.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
