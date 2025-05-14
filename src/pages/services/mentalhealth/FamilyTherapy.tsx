
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
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6">About Our Family Therapy</h2>
            <p className="text-gray-600 mb-4">
              Family therapy at Peace2Hearts focuses on improving relationships and resolving conflicts within the family system. We work with all types of families – traditional, single-parent, blended, extended, and chosen families – to help strengthen bonds and create healthier patterns of interaction.
            </p>
            <p className="text-gray-600 mb-4">
              Our therapists create a safe, neutral space where all family members can express themselves and feel heard. Through structured sessions, we help identify unhealthy patterns, improve communication, and develop strategies to navigate challenges together.
            </p>
            <p className="text-gray-600 mb-8">
              Family therapy is particularly beneficial during major life transitions such as divorce, remarriage, relocation, or when facing challenges with children's behavior, grief, or other stressors that affect the family unit.
            </p>
            
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">Our Family Therapy Approach</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Initial family assessment to understand dynamics and challenges</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Collaborative goal-setting with all family members</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Structured sessions that ensure everyone's voice is heard</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Practical communication tools to use at home</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Strategies for maintaining progress after therapy concludes</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default FamilyTherapy;
