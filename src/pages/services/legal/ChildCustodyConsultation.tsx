
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const ChildCustodyConsultation = () => {
  return (
    <SubServiceLayout
      title="Child Custody Consultation"
      description="Expert guidance on custody arrangements that prioritize your child's wellbeing while protecting your parental rights."
      image="https://images.unsplash.com/photo-1576765608622-067973a79f53?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1153&q=80"
      serviceType="legal-support"
      serviceName="custody"
      benefits={[
        "Child-centered approach that prioritizes their wellbeing",
        "Clear understanding of custody types and parenting arrangements",
        "Strategies for negotiating arrangements without court conflict",
        "Development of sustainable co-parenting frameworks",
        "Protection of your parental rights during custody disputes",
        "Guidance on addressing custody modifications when needed"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Parents navigating separation or divorce with children" },
          { text: "Those facing challenges in existing custody arrangements" },
          { text: "Anyone needing to establish formal custody agreements" },
          { text: "Parents concerned about the impact of separation on children" }
        ]}
        howItWorks={[
          { text: "Discuss your family dynamics and custody concerns" },
          { text: "Meet with a family law expert specializing in custody" },
          { text: "Explore options that prioritize your child's best interests" },
          { text: "Develop a strategy for establishing appropriate arrangements" }
        ]}
        mandalaColor="bg-green-50"
        whoCanBenefitClassName="bg-gradient-3"
        howItWorksClassName="bg-gradient-2"
        useNewLayout={true}
      />
    </SubServiceLayout>
  );
};

export default ChildCustodyConsultation;
