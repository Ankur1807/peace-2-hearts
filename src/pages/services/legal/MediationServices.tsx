
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const MediationServices = () => {
  return (
    <SubServiceLayout
      title="Mediation Services"
      description="Facilitating peaceful resolutions to legal disputes through guided, collaborative dialogue."
      image="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
      serviceType="legal-support"
      serviceName="mediation"
      benefits={[
        "Avoid lengthy, costly court proceedings",
        "Maintain control over the outcome of disputes",
        "Preserve relationships and reduce emotional stress",
        "Create customized solutions that work for all parties",
        "Complete the process more quickly than through litigation",
        "Confidential process that protects your privacy"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Couples wanting to resolve disputes without going to court" },
          { text: "Families looking to settle calmly and cooperatively" },
          { text: "Those seeking a structured but empathetic conversation" },
          { text: "Anyone needing help to reach fair terms without escalation" }
        ]}
        howItWorks={[
          { text: "Explain the conflict you're dealing with" },
          { text: "Meet with a trained legal mediator" },
          { text: "Join structured sessions that balance both sides" },
          { text: "Work toward peaceful, actionable solutions" }
        ]}
        mandalaColor="bg-indigo-50"
        whoCanBenefitClassName="bg-gradient-2"
        howItWorksClassName="bg-gradient-5"
        useNewLayout={true}
      />
    </SubServiceLayout>
  );
};

export default MediationServices;
