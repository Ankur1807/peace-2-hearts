
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const SexualHealthCounselling = () => {
  return (
    <SubServiceLayout
      title="Sexual Health Counselling"
      description="Specialized support for addressing intimacy concerns and enhancing relationship satisfaction."
      image="https://images.unsplash.com/photo-1560183721-fa5e04c20db3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="mental-health"
      serviceName="sexual-health-counselling"
      benefits={[
        "Improved communication about intimacy needs and boundaries",
        "Strategies to address physical and emotional intimacy challenges",
        "Guidance on rebuilding intimacy after relationship difficulties",
        "Support for sexual health concerns affecting relationship satisfaction",
        "Tools for enhancing connection and pleasure in your relationship",
        "Safe space to discuss sensitive topics with professional guidance"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Individuals struggling with shame, performance anxiety, or identity conflict" },
          { text: "Couples facing disconnect or unspoken issues in intimacy" },
          { text: "People recovering from past sexual trauma or conditioning" },
          { text: "Anyone seeking safe, non-judgmental clarity around their sexual health" }
        ]}
        howItWorks={[
          { text: "Share your concerns confidentially" },
          { text: "Speak to a therapist trained in sexual health" },
          { text: "Explore beliefs, fears, and experiences" },
          { text: "Move toward confidence, comfort, and connection" }
        ]}
        mandalaColor="bg-pink-50"
        whoCanBenefitClassName="bg-gradient-3"
        howItWorksClassName="bg-gradient-6"
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6">About Our Sexual Health Counselling</h2>
            <p className="text-gray-600 mb-4">
              At Peace2Hearts, our sexual health counselling services provide a confidential, non-judgmental space to address intimacy concerns that may be affecting your relationship. Our specialized therapists understand the sensitive nature of these issues and approach each session with empathy, respect, and professionalism.
            </p>
            <p className="text-gray-600 mb-4">
              Sexual health is an important component of overall relationship satisfaction, and many couples experience challenges in this area at some point. Our counselling helps address concerns related to desire differences, communication about intimacy, physical issues, emotional barriers, and rebuilding connection after relationship difficulties.
            </p>
            <p className="text-gray-600 mb-8">
              Whether you're seeking to enhance an already positive intimate relationship or working through specific challenges, our therapists provide evidence-based guidance tailored to your unique situation.
            </p>
            
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">What to Expect</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Compassionate, professional environment to discuss sensitive topics</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Comprehensive assessment of concerns and relationship dynamics</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Education about sexual health and intimacy in relationships</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Personalized strategies to enhance communication and connection</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Referrals to medical professionals when appropriate</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default SexualHealthCounselling;
