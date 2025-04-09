
import ServiceLayout from "@/components/ServiceLayout";
import { Check } from "lucide-react";

const DivorcePreventionPackage = () => {
  return (
    <ServiceLayout
      title="Divorce Prevention Package"
      description="A comprehensive approach combining therapy and legal guidance to help couples navigate challenging periods and rediscover connection before considering separation."
      image="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1286&q=80"
      forWhom={[
        "Couples experiencing persistent conflict or communication breakdown",
        "Partners considering separation but willing to explore alternatives",
        "Relationships affected by a specific crisis (infidelity, financial stress, etc.)",
        "Couples with children who want to prioritize family stability",
        "Partners who feel disconnected but want to rekindle their relationship"
      ]}
      howItWorks={[
        "Initial assessment to understand your specific relationship challenges",
        "Two therapy sessions focused on communication and emotional connection",
        "One mediation session to address specific areas of conflict",
        "One legal consultation to understand rights, responsibilities, and options"
      ]}
    >
      <section className="py-16 bg-softGray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-3xl mb-8 text-center">What's Included in This Package</h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">2 Therapy Sessions</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-vibrantPurple mr-2 mt-0.5" />
                    <span className="text-gray-600">Assessment of relationship dynamics and attachment patterns</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-vibrantPurple mr-2 mt-0.5" />
                    <span className="text-gray-600">Communication skill development to address conflicts constructively</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-vibrantPurple mr-2 mt-0.5" />
                    <span className="text-gray-600">Exploration of emotional triggers and unmet needs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-vibrantPurple mr-2 mt-0.5" />
                    <span className="text-gray-600">Techniques for rebuilding trust and intimacy</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">1 Mediation Session</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Neutral facilitation to address specific areas of conflict</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Development of mutually acceptable solutions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Documentation of agreements reached during the session</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Strategies for implementing new approaches in daily life</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm md:col-span-2">
                <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">1 Legal Consultation</h3>
                <ul className="space-y-3 md:columns-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Overview of marital rights and responsibilities</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Understanding legal implications of separation and divorce</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Information about asset division and financial considerations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Guidance on custody matters when children are involved</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">Package Benefits</h3>
              <p className="text-gray-600 mb-6">
                By combining therapeutic support with legal guidance, this package offers a comprehensive approach to relationship challenges that:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-vibrantPurple/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-vibrantPurple text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Addresses both emotional and practical aspects of relationship difficulties</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-vibrantPurple/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-vibrantPurple text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Provides clarity on what's at stake legally before making major decisions</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-vibrantPurple/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-vibrantPurple text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Creates a structured framework for addressing complex issues</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-vibrantPurple/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-vibrantPurple text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Offers cost savings compared to booking services individually</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title text-3xl mb-6">Our Success Stories</h2>
            <p className="text-gray-600 mb-12">
              Many couples have found renewed connection and clarity through our Divorce Prevention Package. While every relationship is unique, our integrated approach has helped partners rediscover their commitment to each other and build stronger foundations.
            </p>
            
            <div className="bg-gray-50 p-8 rounded-xl italic text-gray-700">
              "We were on the brink of filing for divorce after 12 years of marriage when we decided to try the Divorce Prevention Package. The combination of therapy and legal guidance helped us understand both the emotional and practical implications of our choices. Six months later, we're still together and working through our challenges with new tools and perspective."
              <p className="mt-4 font-medium not-italic">— A couple from Delhi</p>
            </div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
};

export default DivorcePreventionPackage;
