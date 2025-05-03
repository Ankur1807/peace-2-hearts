
import SubServiceLayout from "@/components/SubServiceLayout";

const PreMarriageLegal = () => {
  return (
    <SubServiceLayout
      title="Pre-marriage Legal Consultation"
      description="Guidance on rights, agreements, and legal aspects to ensure a secure foundation before marriage."
      image="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="legal-support"
      serviceName="pre-marriage"
      benefits={[
        "Comprehensive understanding of your legal rights before marriage",
        "Expert guidance on prenuptial agreements",
        "Clear advice on asset protection and financial planning",
        "Information on legal implications of joint property ownership",
        "Insights into inheritance rights and estate planning for couples",
        "Knowledge about legal responsibilities within marriage"
      ]}
    >
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6">About Pre-marriage Legal Consultation</h2>
            <p className="text-gray-600 mb-4">
              Our pre-marriage legal consultation service provides couples with the legal knowledge and tools they need to start their marriage on a solid foundation. While planning a wedding often takes center stage, understanding the legal implications of marriage is equally important for long-term security.
            </p>
            <p className="text-gray-600 mb-4">
              At Peace2Hearts, our legal experts guide you through important considerations such as prenuptial agreements, asset protection, inheritance rights, and financial planning. We believe that open discussions about these topics strengthen relationships by ensuring both partners are informed and aligned.
            </p>
            <p className="text-gray-600 mb-8">
              Our approach is sensitive and balanced, recognizing that these conversations can be delicate. We create a comfortable environment where both partners can ask questions and gain clarity about their rights and responsibilities.
            </p>
            
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">What Our Consultation Covers</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Overview of marriage laws and legal implications</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Detailed discussion of prenuptial agreements and their benefits</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Guidance on property rights and asset protection</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Information on financial responsibilities and planning</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Advice on inheritance rights and estate planning considerations</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default PreMarriageLegal;
