
import { Heart, BookOpen, MessageSquare, Shield, Bell, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const WhyChooseUsSection = () => {
  const isMobile = useIsMobile();
  
  const features = [
    {
      icon: Heart,
      color: "vibrantPurple",
      title: "Compassionate Care",
      description: "We approach every client with empathy, recognizing the emotional complexities of relationship struggles."
    },
    {
      icon: BookOpen,
      color: "peacefulBlue",
      title: "Expert Knowledge",
      description: "Our team brings deep expertise in both mental health and family law to offer well-rounded, practical support."
    },
    {
      icon: MessageSquare,
      color: "brightOrange",
      title: "Tailored Approach",
      description: "No two relationships are the same. We adapt our care to meet your unique needs, stage, and story."
    },
    {
      icon: Shield,
      color: "vividPink",
      title: "No-Strings-Attached Legal Help",
      description: "Legal consultations without pressure—just honest advice, without the push to litigate."
    },
    {
      icon: Bell,
      color: "softGreen",
      title: "Divorce Prevention Focus",
      description: "We believe separation isn't always the only option. When there's a chance for repair, we'll help you explore it."
    },
    {
      icon: Users,
      color: "brightOrange",
      title: "Empathetic, Trusted Team",
      description: "From your first call to every session, expect warmth, care, and zero judgment."
    }
  ];

  const FeatureCard = ({ feature }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
      <div className={`bg-${feature.color}/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4`}>
        <feature.icon className={`h-10 w-10 text-${feature.color}`} />
      </div>
      <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </div>
  );

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
          <div className="grid md:grid-cols-3 gap-8">
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
