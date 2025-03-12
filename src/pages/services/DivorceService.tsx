
import ServiceLayout from "@/components/ServiceLayout";

const DivorceService = () => {
  return (
    <ServiceLayout
      title="Divorce Guidance"
      description="Our comprehensive divorce guidance services combine legal expertise and emotional support to help you navigate this challenging transition with dignity and clarity."
      image="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      forWhom={[
        "Individuals considering divorce and needing to understand their options",
        "Couples seeking an amicable, collaborative divorce process",
        "Those needing support with contested divorce proceedings",
        "Parents concerned about co-parenting after divorce",
        "People dealing with complex financial situations in divorce",
        "Anyone needing emotional support during divorce proceedings"
      ]}
      howItWorks={[
        "Initial consultation to understand your situation and needs",
        "Comprehensive assessment of legal, financial, and emotional aspects",
        "Development of a personalized divorce strategy and support plan",
        "Ongoing guidance and support throughout the divorce process"
      ]}
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title text-3xl mb-6">Our Holistic Approach</h2>
              <p className="text-gray-600 mb-4">
                Peace2Hearts recognizes that divorce impacts every aspect of life. Our holistic approach addresses not only the legal proceedings but also the emotional, financial, and practical aspects of this major life transition.
              </p>
              <p className="text-gray-600 mb-4">
                We combine legal expertise with therapeutic support, creating a comprehensive team that helps you navigate divorce with minimal conflict and maximum support.
              </p>
              <p className="text-gray-600">
                Whether you're seeking an amicable collaborative divorce or need support through a contested process, our team provides the guidance, expertise, and compassion needed during this challenging time.
              </p>
            </div>
            <div>
              <h2 className="section-title text-3xl mb-6">Comprehensive Divorce Support</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Legal guidance throughout the divorce process</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Emotional support and therapy options during transition</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Assistance with fair asset division and financial planning</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Co-parenting guidance and child-focused solutions</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Mediation and conflict resolution services</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Post-divorce adjustment support and future planning</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
};

export default DivorceService;
