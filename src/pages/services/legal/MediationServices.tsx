
import SubServiceLayout from "@/components/SubServiceLayout";

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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6">About Our Mediation Services</h2>
            <p className="text-gray-600 mb-4">
              Peace2Hearts offers professional mediation services to help individuals and couples resolve disputes without the stress, expense, and adversarial nature of court proceedings. Our skilled mediators create a neutral, supportive environment where all parties can express their concerns and work toward mutually acceptable solutions.
            </p>
            <p className="text-gray-600 mb-4">
              Unlike litigation, mediation empowers you to maintain control over the outcome. Our mediators don't make decisions for you but rather guide the conversation, ensure all voices are heard, and help you explore options that might not be available through court proceedings.
            </p>
            <p className="text-gray-600 mb-8">
              Mediation is particularly valuable for relationship disputes, as it helps preserve relationships, reduces emotional trauma, and creates more sustainable agreements that parties are likely to honor because they helped create them.
            </p>
            
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">Our Mediation Process</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Initial consultation to understand the dispute and assess suitability for mediation</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Joint sessions where all parties discuss issues and explore solutions</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Private caucuses when needed to address sensitive concerns</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Drafting of agreements that reflect the solutions developed during mediation</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Review of agreements by independent legal counsel before finalization</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default MediationServices;
