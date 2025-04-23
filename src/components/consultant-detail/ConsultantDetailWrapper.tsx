
import { Card } from "@/components/ui/card";
import { ConsultantHeader } from "./ConsultantHeader";
import { ExpertiseTab } from "./ExpertiseTab";
import { ConsultantBreadcrumb } from "./ConsultantBreadcrumb";
import { Consultant } from "@/utils/consultants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Copy, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const publicProfileLink = `${window.location.origin}/consultants/${consultant.id}`;

  const handleShareLink = () => {
    navigator.clipboard.writeText(publicProfileLink).then(() => {
      toast.success("Consultant profile link copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy link: ", err);
      toast.error("Failed to copy link");
    });
  };

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
        <div className="px-6 pb-4">
          <Button 
            variant="outline" 
            onClick={handleShareLink} 
            className="w-full"
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Public Profile Link
          </Button>
        </div>
      </Card>

      <div className="space-y-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Availability & Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Available Days</p>
                <p className="text-gray-600">
                  {consultant.available_days?.join(", ") || "Monday - Friday"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Working Hours</p>
                <p className="text-gray-600">{consultant.available_hours || "9:00 AM - 5:00 PM"}</p>
              </div>
            </div>
          </div>
        </Card>
        
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
              <Link to="/book-consultation" className="inline-block w-full">
                <Button className={`px-8 py-6 text-lg ${isMobile ? 'w-full' : ''}`}>
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
