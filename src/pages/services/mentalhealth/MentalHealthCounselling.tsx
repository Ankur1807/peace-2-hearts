
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const MentalHealthCounselling = () => {
  return (
    <SubServiceLayout
      title="Mental Health Counselling"
      description="Structured therapy sessions to help you process emotions, build resilience, and overcome relationship-related mental health challenges."
      image="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="mental-health"
      serviceName="counselling"
      benefits={[
        "Professional support for anxiety, depression, and stress related to relationships",
        "Personalized strategies to build emotional resilience",
        "Tools to manage difficult emotions during relationship transitions",
        "Safe space to process grief, loss, and heartbreak",
        "Guidance for rebuilding self-esteem and confidence",
        "Techniques to establish healthy boundaries in relationships"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Individuals facing emotional overwhelm, anxiety, or prolonged sadness" },
          { text: "People feeling stuck in toxic patterns or self-doubt" },
          { text: "Those navigating grief, betrayal, or a loss of direction" },
          { text: "Anyone seeking emotional clarity and inner peace" }
        ]}
        howItWorks={[
          { text: "Share your current emotional struggles with us" },
          { text: "Get matched with a counselor suited to your needs" },
          { text: "Start safe, confidential sessions on your own terms" },
          { text: "Move at your pace — no pressure, no judgment" }
        ]}
        mandalaColor="bg-peacefulBlue/5"
        whoCanBenefitClassName="bg-gradient-4"
        howItWorksClassName="bg-gradient-1"
        useNewLayout={true}
      />
    </SubServiceLayout>
  );
};

export default MentalHealthCounselling;
