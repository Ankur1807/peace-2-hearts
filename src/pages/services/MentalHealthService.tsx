
import React from 'react';
import ServiceLayout from "@/components/ServiceLayout";
import MentalHealthApproach from "@/components/services/mental-health/MentalHealthApproach";
import MentalHealthServicesList from "@/components/services/mental-health/MentalHealthServicesList";
import SubServicesList from "@/components/SubServicesList";

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
      id: "couples-counselling", // Make sure this ID matches what's in the selection options
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
          <MentalHealthApproach />
          <MentalHealthServicesList services={mentalHealthSubServices} />
          <SubServicesList subServices={mentalHealthSubServices} />
        </div>
      </section>
    </ServiceLayout>
  );
};

export default MentalHealthService;
