
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const SexualHealthCounselling = () => {
  return (
    <SubServiceLayout
      title="Sexual Health Counselling"
      description="Specialized support for addressing intimacy concerns and enhancing relationship satisfaction."
      image="https://images.unsplash.com/photo-1560183721-fa5e04c20db3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="mental-health"
      serviceName="sexual-health-counselling"
      benefits={[
        "Improved communication about intimacy needs and boundaries",
        "Strategies to address physical and emotional intimacy challenges",
        "Guidance on rebuilding intimacy after relationship difficulties",
        "Support for sexual health concerns affecting relationship satisfaction",
        "Tools for enhancing connection and pleasure in your relationship",
        "Safe space to discuss sensitive topics with professional guidance"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Individuals struggling with shame, performance anxiety, or identity conflict" },
          { text: "Couples facing disconnect or unspoken issues in intimacy" },
          { text: "People recovering from past sexual trauma or conditioning" },
          { text: "Anyone seeking safe, non-judgmental clarity around their sexual health" }
        ]}
        howItWorks={[
          { text: "Share your concerns confidentially" },
          { text: "Speak to a therapist trained in sexual health" },
          { text: "Explore beliefs, fears, and experiences" },
          { text: "Move toward confidence, comfort, and connection" }
        ]}
        mandalaColor="bg-pink-50"
        whoCanBenefitClassName="bg-gradient-3"
        howItWorksClassName="bg-gradient-6"
        useNewLayout={true}
      />
    </SubServiceLayout>
  );
};

export default SexualHealthCounselling;
