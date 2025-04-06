
import { Heart, Book, MessageSquare } from 'lucide-react';

const WhyChooseUsSection = () => {
  return (
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
  );
};

export default WhyChooseUsSection;
