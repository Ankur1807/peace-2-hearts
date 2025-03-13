
import SubServiceLayout from "@/components/SubServiceLayout";

const PremaritalCounselling = () => {
  return (
    <SubServiceLayout
      title="Premarital Counselling"
      description="Preparing couples for a strong and fulfilling marriage through guided discussions and planning."
      image="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="mental-health"
      serviceName="premarital-counselling"
      benefits={[
        "Establish healthy communication patterns before marriage",
        "Identify and resolve potential conflicts early",
        "Align expectations about finances, family, and future goals",
        "Develop conflict resolution skills that strengthen your relationship",
        "Explore important topics that many couples overlook",
        "Build a strong foundation for a lasting partnership"
      ]}
    >
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6">About Our Premarital Counselling</h2>
            <p className="text-gray-600 mb-4">
              At Peace2Hearts, our premarital counselling is designed to help couples prepare for a successful marriage by addressing potential challenges before they arise. Our counsellors create a supportive environment where you and your partner can openly discuss important topics that form the foundation of a healthy marriage.
            </p>
            <p className="text-gray-600 mb-4">
              Through structured sessions, you'll explore your values, expectations, communication styles, and future plans. Our approach helps you strengthen your relationship while developing practical skills for navigating the complexities of married life.
            </p>
            <p className="text-gray-600 mb-8">
              Premarital counselling is beneficial for all couples, whether you're experiencing specific concerns or simply want to ensure you're building your marriage on a solid foundation.
            </p>
            
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">What to Expect</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Comprehensive assessment of your relationship strengths and areas for growth</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Guided discussions about essential pre-marriage topics</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Personalized strategies for effective communication</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Tools for navigating differences and resolving conflicts</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Resources to continue strengthening your relationship after counselling</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default PremaritalCounselling;
