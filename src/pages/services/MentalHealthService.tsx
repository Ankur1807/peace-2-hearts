
import React from 'react';
import ServiceLayout from "@/components/ServiceLayout";
import { cn } from "@/lib/utils";
import SiteCard from "@/components/SiteCard";

const MentalHealthService: React.FC = () => {
  const mentalHealthSubServices = [
    {
      id: "mental-health-counselling",
      title: "Mental Health Counselling",
      description: "Structured therapy sessions to rebuild trust and resolve conflicts in relationships.",
      path: "/services/mental-health/counselling"
    },
    {
      id: "family-therapy",
      title: "Family Therapy",
      description: "Strengthening family bonds by addressing conflicts and fostering understanding.",
      path: "/services/mental-health/family-therapy"
    },
    {
      id: "couples-counselling",
      title: "Couples Counselling",
      description: "Professional guidance to strengthen communication and mutual understanding.",
      path: "/services/mental-health/couples-counselling"
    },
    {
      id: "sexual-health-counselling",
      title: "Sexual Health Counselling",
      description: "Specialized support for addressing intimacy concerns and enhancing relationship satisfaction.",
      path: "/services/mental-health/sexual-health-counselling"
    }
  ];

  const forWhom = [
    "Individuals experiencing anxiety or depression related to relationship issues",
    "Those struggling with stress from ongoing relationship conflicts",
    "People healing from relationship trauma or emotional abuse",
    "Anyone going through a major relationship transition like divorce or separation",
    "Partners seeking to improve their mental wellbeing while in a relationship",
    "Those rebuilding their identity and confidence after a breakup"
  ];

  const howItWorks = [
    "Schedule an initial consultation to discuss your needs and concerns",
    "Get matched with a licensed mental health professional specializing in relationship issues",
    "Develop a personalized treatment plan tailored to your specific situation",
    "Engage in regular therapy sessions to address your mental health needs"
  ];

  // Function to get gradient class based on index for cards
  const getGradientClass = (index: number) => {
    const gradientClasses = [
      'bg-gradient-1',
      'bg-gradient-2',
      'bg-gradient-3', 
      'bg-gradient-5',
      'bg-gradient-6',
      'bg-gradient-4'
    ];
    return gradientClasses[index % gradientClasses.length];
  };

  return (
    <ServiceLayout
      title="Mental Health Support"
      description="Our mental health services provide specialized support for individuals navigating relationship challenges, including anxiety, depression, stress, and trauma related to difficult relationships."
      image="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="mental-health"
      forWhom={forWhom}
      howItWorks={howItWorks}
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Our Offerings Section - Moved to top */}
          <div className="mb-16">
            <h3 className="text-2xl font-lora font-semibold text-gray-800 mb-6 text-center">Our Offerings</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {mentalHealthSubServices.map((service, index) => (
                <div 
                  key={service.id}
                  className={cn(
                    "p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300",
                    "transform hover:-translate-y-1 cursor-pointer relative overflow-hidden offering-card",
                    getGradientClass(index)
                  )}
                  onClick={() => window.location.href = service.path}
                >
                  <div className="ripple-container">
                    <div className="ripple-effect"></div>
                  </div>
                  <h4 className="font-medium text-gray-800 text-xl mb-2 text-center">{service.title}</h4>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Key Benefits Section */}
          <div className="mb-16">
            <h2 className="section-title text-3xl mb-8 text-center">Key Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Specialized support from professionals trained in relationship psychology",
                "Safe space to process difficult emotions and develop coping strategies",
                "Personalized treatment plans tailored to your specific situation",
                "Practical tools to improve communication and set healthy boundaries",
                "Ongoing support to build resilience and strengthen emotional wellbeing",
                "Integrated approach addressing both emotional and practical concerns"
              ].map((benefit, index) => (
                <div key={index} className={cn(
                  "p-5 rounded-xl shadow-sm border border-gray-100 flex items-start text-center benefit-card", 
                  getGradientClass(index)
                )}>
                  <p className="text-gray-700 mx-auto">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Who is this for? and How It Works sections side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <SiteCard className="flex flex-col h-full">
              <h2 className="section-title text-2xl md:text-3xl mb-6 text-center">Who is this for?</h2>
              <ul className="space-y-4 text-center">
                {[
                  "Individuals experiencing emotional distress related to relationships",
                  "Those navigating difficult life transitions or relationship changes",
                  "People dealing with anxiety, depression, or trauma from relationships",
                  "Anyone seeking to improve their emotional wellbeing and resilience"
                ].map((item, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <div className="max-w-md text-center">
                      <p className="text-gray-700">{item}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </SiteCard>
            
            <SiteCard className="bg-gradient-to-br from-white to-blue-50 flex flex-col h-full">
              <h2 className="section-title text-2xl md:text-3xl mb-6 text-center">How It Works</h2>
              <ul className="space-y-4 text-center">
                {[
                  "Schedule a consultation to discuss your specific needs",
                  "Get matched with the right mental health professional",
                  "Engage in personalized therapy sessions focused on your goals",
                  "Develop practical tools and strategies for emotional wellness"
                ].map((item, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <div className="max-w-md text-center">
                      <p className="text-gray-700">{item}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </SiteCard>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
};

export default MentalHealthService;
