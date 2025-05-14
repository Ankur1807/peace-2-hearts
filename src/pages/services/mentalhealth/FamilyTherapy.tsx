
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const FamilyTherapy = () => {
  return (
    <SubServiceLayout
      title="Family Therapy"
      description="Strengthening family bonds by addressing conflicts and fostering understanding among family members."
      image="https://images.unsplash.com/photo-1595674743829-fe8622a18156?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="mental-health"
      serviceName="family-therapy"
      benefits={[
        "Improved communication patterns within the family",
        "Strategies to resolve recurring conflicts and tensions",
        "Tools to navigate life transitions as a family unit",
        "Support for blended families in establishing new dynamics",
        "Guidance on parenting challenges and co-parenting approaches",
        "Framework for developing mutual respect and understanding"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Families navigating constant tension, blame, or emotional distance" },
          { text: "Parents and teens with unresolved conflict" },
          { text: "Blended families adjusting to change" },
          { text: "Households struggling with unspoken pain or fractured trust" }
        ]}
        howItWorks={[
          { text: "Share your family's unique situation" },
          { text: "Meet a therapist trained in multi-person dynamics" },
          { text: "Attend joint or split sessions as needed" },
          { text: "Build communication and respect at every level" }
        ]}
        mandalaColor="bg-purple-50"
        whoCanBenefitClassName="bg-gradient-6"
        howItWorksClassName="bg-gradient-1"
        useNewLayout={true}
      />
    </SubServiceLayout>
  );
};

export default FamilyTherapy;
