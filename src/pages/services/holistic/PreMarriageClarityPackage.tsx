
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import SiteCard from "@/components/SiteCard";

const PreMarriageClarityPackage = () => {
  return (
    <SubServiceLayout
      title="Pre-Marriage Clarity Package"
      description="Build a strong foundation for your marriage with combined emotional and legal guidance before you say 'I do'."
      image="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
      serviceType="legal-support"
      serviceName="pre-marriage-clarity"
      benefits={[
        "Clear understanding of emotional and legal aspects of marriage",
        "Guidance on shared financial planning and boundaries",
        "Space to explore goals for family, career, and intimacy",
        "Insight into roles, values, and expectations",
        "Address differences around religion, lifestyle, or culture",
        "Confidence in your decision to marry — or pause to reflect"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Engaged or soon-to-be married couples" },
          { text: "Partners with differing cultural, religious, or financial expectations" },
          { text: "Couples experiencing tension during wedding planning" },
          { text: "Anyone wanting to build a strong foundation before commitment" }
        ]}
        howItWorks={[
          { text: "Join a pre-marital clarity session together or individually" },
          { text: "Talk through beliefs, expectations, and communication habits" },
          { text: "Identify potential tension points early" },
          { text: "Strengthen trust and alignment through personalized guidance" }
        ]}
        mandalaColor="bg-blue-50"
        whoCanBenefitClassName="bg-gradient-6"
        howItWorksClassName="bg-gradient-3"
        useNewLayout={true}
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6 text-center">About Our Pre-Marriage Clarity Package</h2>
            <p className="text-gray-600 mb-6">
              Starting your marriage with open communication and clear expectations is essential for long-term success. Our Pre-Marriage Clarity Package helps couples build a strong foundation by addressing important relationship dynamics before saying "I do."
            </p>
            <p className="text-gray-600 mb-6">
              This holistic package combines relationship counseling with legal guidance to help you navigate important conversations about values, finances, family planning, and more—setting you up for a resilient partnership.
            </p>
            
            <div className="my-8">
              <AspectRatio ratio={16/9} className="bg-muted rounded-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1511763922698-0f32a97e4193?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Happy engaged couple" 
                  className="object-cover h-full w-full" 
                />
              </AspectRatio>
            </div>
            
            <SiteCard className="mb-8">
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">What's Included</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Guided conversations about values, expectations, and potential conflict areas</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Information about legal aspects of marriage and options for protecting both partners</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Communication tools for navigating differences in a healthy way</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Exploration of financial planning, joint assets, and future goals</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Personalized relationship roadmap to support your journey together</p>
                </li>
              </ul>
            </SiteCard>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default PreMarriageClarityPackage;
