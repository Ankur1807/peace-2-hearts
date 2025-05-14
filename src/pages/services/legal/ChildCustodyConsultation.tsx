
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const ChildCustodyConsultation = () => {
  return (
    <SubServiceLayout
      title="Child Custody Consultation"
      description="Support for understanding and advocating in custody decisions for the best outcomes for children."
      image="https://images.unsplash.com/photo-1516733968668-dbdce39c4651?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="legal-support"
      serviceName="custody"
      benefits={[
        "Understanding different custody arrangements and their implications",
        "Guidance on creating parenting plans that prioritize children's well-being",
        "Knowledge about legal standards used in custody decisions",
        "Strategies for effective co-parenting after separation or divorce",
        "Information on modifying custody arrangements as circumstances change",
        "Support in navigating emotionally challenging custody disputes"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Parents uncertain about custody rights and responsibilities" },
          { text: "Those facing co-parenting challenges or disputes" },
          { text: "Individuals concerned about child welfare during separation" },
          { text: "Anyone needing clarity on legal steps around guardianship" }
        ]}
        howItWorks={[
          { text: "Share your parenting or custody concerns" },
          { text: "Connect with a legal expert in custody law" },
          { text: "Understand your rights, options, and risks" },
          { text: "Make child-focused choices, with clear guidance" }
        ]}
        mandalaColor="bg-teal-50"
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6">About Our Child Custody Consultation</h2>
            <p className="text-gray-600 mb-4">
              Child custody matters are among the most emotionally challenging aspects of relationship transitions. At Peace2Hearts, our child custody consultation service provides compassionate guidance to help parents make informed decisions that protect their children's best interests.
            </p>
            <p className="text-gray-600 mb-4">
              Our experienced legal team explains custody laws and procedures while helping you understand the factors courts consider when making custody determinations. We focus on helping you develop practical, child-centered solutions that minimize conflict and support healthy parent-child relationships.
            </p>
            <p className="text-gray-600 mb-8">
              Whether you're in the early stages of separation, need to modify an existing custody arrangement, or are facing a custody dispute, our consultation service provides the knowledge and support you need to navigate this complex area of family law.
            </p>
            
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">What Our Consultation Covers</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Legal and physical custody concepts and arrangements</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Creating comprehensive, detailed parenting plans</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Understanding how courts determine "best interests of the child"</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Strategies for effective co-parenting in challenging circumstances</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Options for resolving custody disputes outside of court</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default ChildCustodyConsultation;
