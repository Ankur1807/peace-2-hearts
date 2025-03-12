
import ServiceLayout from "@/components/ServiceLayout";

const CustodyService = () => {
  return (
    <ServiceLayout
      title="Custody Support"
      description="Our child custody support services prioritize the well-being of children while helping parents develop fair, workable custody arrangements during and after relationship transitions."
      image="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
      forWhom={[
        "Parents going through divorce or separation who need custody guidance",
        "Those seeking to modify existing custody arrangements",
        "Co-parents experiencing conflict over visitation or parenting decisions",
        "Parents concerned about their children's adjustment to family changes",
        "Those needing help developing comprehensive parenting plans",
        "Anyone wanting to prioritize their children's needs during relationship transitions"
      ]}
      howItWorks={[
        "Initial consultation to understand your family situation and concerns",
        "Assessment of child needs and parental capabilities",
        "Development of child-centered custody proposals and parenting plans",
        "Ongoing support for implementation and adjustment of arrangements"
      ]}
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title text-3xl mb-6">Child-Centered Approach</h2>
              <p className="text-gray-600 mb-4">
                At Peace2Hearts, we firmly believe that custody arrangements should prioritize children's emotional and developmental needs. Our child-centered approach focuses on creating stability and nurturing environments for children while respecting both parents' roles.
              </p>
              <p className="text-gray-600 mb-4">
                Our team of legal experts and child development specialists work together to help parents develop custody arrangements that minimize conflict and maximize cooperation for the benefit of the children.
              </p>
              <p className="text-gray-600">
                We support families in creating detailed, workable parenting plans that address everyday concerns as well as special circumstances, holidays, and future changes in family situations.
              </p>
            </div>
            <div>
              <h2 className="section-title text-3xl mb-6">Custody Support Services</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Legal guidance on custody laws and parent rights</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Development of customized parenting plans</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Co-parenting communication strategies and tools</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Assistance with custody modifications as needed</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Support for children adjusting to new family structures</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Mediation for resolving custody disputes</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
};

export default CustodyService;
