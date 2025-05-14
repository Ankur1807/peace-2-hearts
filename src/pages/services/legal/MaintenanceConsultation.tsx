
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const MaintenanceConsultation = () => {
  return (
    <SubServiceLayout
      title="Maintenance Consultation"
      description="Advice on alimony, financial support, and equitable agreements for separated or divorced partners."
      image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="legal-support"
      serviceName="maintenance"
      benefits={[
        "Understanding your rights and obligations regarding maintenance",
        "Knowledge about factors that influence maintenance determinations",
        "Guidance on calculating appropriate maintenance amounts",
        "Strategies for negotiating fair maintenance agreements",
        "Information on modifying maintenance orders when circumstances change",
        "Support for addressing maintenance payment issues"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Spouses unsure about their financial rights after separation" },
          { text: "Individuals struggling to receive or provide post-divorce support" },
          { text: "Women left financially vulnerable after marital breakdown" },
          { text: "Anyone considering or contesting a maintenance order" }
        ]}
        howItWorks={[
          { text: "Brief us on your financial and marital situation" },
          { text: "Consult with a lawyer who understands spousal support law" },
          { text: "Learn what you're entitled to — and what's realistic" },
          { text: "Decide next steps with both clarity and caution" }
        ]}
        mandalaColor="bg-amber-50"
        whoCanBenefitClassName="bg-gradient-5"
        howItWorksClassName="bg-gradient-6"
        useNewLayout={true}
      />
    </SubServiceLayout>
  );
};

export default MaintenanceConsultation;
