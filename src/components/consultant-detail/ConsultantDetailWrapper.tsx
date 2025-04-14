
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultantHeader } from "./ConsultantHeader";
import { AboutTab } from "./AboutTab";
import { ExpertiseTab } from "./ExpertiseTab";
import { BookingTab } from "./BookingTab";
import { ConsultantBreadcrumb } from "./ConsultantBreadcrumb";
import { Consultant } from "@/utils/consultants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ConsultantDetailWrapperProps {
  consultant: Consultant;
  getInitials: () => string;
  formatSpecialization: (specialization: string) => string;
}

export function ConsultantDetailWrapper({
  consultant,
  getInitials,
  formatSpecialization
}: ConsultantDetailWrapperProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <ConsultantBreadcrumb consultantName={consultant.name} />
      
      <Card className="mb-8 overflow-hidden border-none shadow-lg">
        <div className="bg-gradient-to-r from-peacefulBlue to-softGreen h-40"></div>
        <ConsultantHeader
          consultant={consultant}
          getInitials={getInitials}
          formatSpecialization={formatSpecialization}
        />
      </Card>

      <div className="space-y-8">
        <AboutTab consultant={consultant} />
        
        <ExpertiseTab 
          consultant={consultant}
          formatSpecialization={formatSpecialization}
        />

        <Card className="overflow-hidden border shadow-sm">
          <div className="p-6 bg-gray-50 border-b">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                This expert may be matched to your case based on your needs. To begin, please book a session through our main service page.
              </p>
              <Link to="/book-consultation">
                <Button className="px-8 py-6 text-lg">
                  Book sessions with experts such as {consultant.name || "our consultants"}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
