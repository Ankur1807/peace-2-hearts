
import { Heart, BookOpen, MessageSquare, Shield, Bell, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const pastelClass = "bg-gradient-to-br from-white to-peacefulBlue/10 shadow-md"; // Match legal/therapy cards

const FeatureCard = ({ feature }) => (
  <div className={`${pastelClass} rounded-xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow flex flex-col justify-between h-full`}>
    <div className={`p-4 rounded-full bg-peacefulBlue/10 flex items-center justify-center mx-auto mb-4`}>
      <feature.icon className="h-10 w-10 text-vibrantPurple" />
    </div>
    <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">{feature.title}</h3>
    <p className="text-gray-600">{feature.description}</p>
  </div>
);

const WhyChooseUsSection = () => {
  const isMobile = useIsMobile();

  const features = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "We approach every client with empathy, recognizing the emotional complexities of relationship struggles."
    },
    {
      icon: BookOpen,
      title: "Expert Knowledge",
      description: "Our team brings deep expertise in both mental health and family law to offer well-rounded, practical support."
    },
    {
      icon: MessageSquare,
      title: "Tailored Approach",
      description: "No two relationships are the same. We adapt our care to meet your unique needs, stage, and story."
    },
    {
      icon: Shield,
      title: "No-Strings-Attached Legal Help",
      description: "Legal consultations without pressure—just honest advice, without the push to litigate."
    },
    {
      icon: Bell,
      title: "Divorce Prevention Focus",
      description: "We believe separation isn't always the only option. When there's a chance for repair, we'll help you explore it."
    },
    {
      icon: Users,
      title: "Empathetic, Trusted Team",
      description: "From your first call to every session, expect warmth, care, and zero judgment."
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">Why Expert Guidance Matters</h2>
          <p className="text-gray-600">Relationship challenges can be complex—our holistic approach ensures both your emotional and legal needs are addressed.</p>
        </div>
        
        {isMobile ? (
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {features.map((feature, index) => (
                  <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/1">
                    <FeatureCard feature={feature} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center gap-2 mt-4">
                <CarouselPrevious className="relative -left-0 top-0 translate-y-0 h-9 w-9" />
                <div className="text-sm text-gray-500">Swipe to see more</div>
                <CarouselNext className="relative -right-0 top-0 translate-y-0 h-9 w-9" />
              </div>
            </Carousel>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1 mt-2">
                {features.map((_, index) => (
                  <div 
                    key={index} 
                    className="h-1.5 w-1.5 rounded-full bg-gray-300"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {/* Increased gap between cards */}
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyChooseUsSection;

