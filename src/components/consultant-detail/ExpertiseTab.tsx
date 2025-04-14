
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface ExpertiseTabProps {
  consultant: {
    specialization: string;
  };
  formatSpecialization: (specialization: string) => string;
}

export function ExpertiseTab({ consultant, formatSpecialization }: ExpertiseTabProps) {
  const getSpecializationItems = () => {
    if (consultant.specialization === 'legal') {
      return [
        "Divorce proceedings and settlements",
        "Child custody arrangements",
        "Mediation between parties",
        "Legal documentation review",
        "Spousal support consultation"
      ];
    } else if (consultant.specialization === 'mental_health') {
      return [
        "Relationship counseling",
        "Emotional support during separation",
        "Coping strategies for major life changes",
        "Family therapy",
        "Personal growth and healing"
      ];
    }
    return [
      "Professional consultation",
      "Expert guidance",
      "Personalized support",
      "Strategic planning",
      "Solution-focused approach"
    ];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Areas of Expertise</CardTitle>
        <CardDescription>Specialized knowledge and skills</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">{formatSpecialization(consultant.specialization)}</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            {consultant.specialization === 'legal' ? 
              "Providing expert legal guidance on matters related to relationships, marriage, and family law. Specialized in helping clients understand their legal rights and options during challenging times." :
              consultant.specialization === 'mental_health' ?
              "Offering professional mental health support focused on relationship dynamics, personal growth, and emotional wellbeing. Specialized in providing strategies for healing and moving forward." :
              "Delivering specialized consultation services to help clients navigate complex personal challenges with expert guidance and support."}
          </p>
          
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h4 className="font-medium mb-3">Specializations:</h4>
            <ul className="space-y-2">
              {getSpecializationItems().map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
          <h4 className="font-medium mb-3">What to expect during consultations:</h4>
          <ul className="space-y-2">
            {consultant.specialization === 'legal' ? (
              <>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Comprehensive assessment of your legal situation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Clear explanation of your legal rights and options</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Strategic guidance on possible next steps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Answers to your specific legal questions</span>
                </li>
              </>
            ) : consultant.specialization === 'mental_health' ? (
              <>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Supportive space to discuss your concerns</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Assessment of your emotional wellbeing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Practical coping strategies and tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Personalized guidance for your situation</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Professional assessment of your situation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Tailored advice based on your specific needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Practical strategies for moving forward</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Answers to your most pressing questions</span>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <Link to="/resources" className="text-primary hover:underline">
            Visit our resources section for additional information
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
