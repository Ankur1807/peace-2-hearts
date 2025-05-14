
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const CouplesCounselling = () => {
  return (
    <SubServiceLayout
      title="Couples Counselling"
      description="Professional guidance to strengthen communication and mutual understanding between partners."
      image="https://images.unsplash.com/photo-1588385388187-c78773b5d867?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="mental-health"
      serviceName="couples-counselling"
      benefits={[
        "Enhanced communication skills to express needs and listen effectively",
        "Techniques to resolve conflicts in healthy, constructive ways",
        "Guidance on rebuilding trust after relationship challenges",
        "Tools for deepening emotional intimacy and connection",
        "Strategies for navigating major life transitions together",
        "Support for aligning on values and future goals"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Couples experiencing communication breakdowns or frequent conflicts" },
          { text: "Partners feeling disconnected or growing apart" },
          { text: "Relationships affected by trust issues or betrayal" },
          { text: "Couples facing major life transitions or decisions together" }
        ]}
        howItWorks={[
          { text: "Schedule a joint consultation to discuss your concerns" },
          { text: "Meet with a therapist specialized in relationship dynamics" },
          { text: "Identify unhelpful patterns and develop new skills together" },
          { text: "Practice techniques to strengthen your connection" }
        ]}
        mandalaColor="bg-blue-50"
        whoCanBenefitClassName="bg-gradient-5"
        howItWorksClassName="bg-gradient-2"
        useNewLayout={true}
      />
    </SubServiceLayout>
  );
};

export default CouplesCounselling;
