
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultantHeader } from "./ConsultantHeader";
import { AboutTab } from "./AboutTab";
import { ExpertiseTab } from "./ExpertiseTab";
import { BookingTab } from "./BookingTab";
import { ConsultantBreadcrumb } from "./ConsultantBreadcrumb";
import { Consultant } from "@/utils/consultants";

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

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="booking">Book</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about">
          <AboutTab consultant={consultant} />
        </TabsContent>
        
        <TabsContent value="expertise">
          <ExpertiseTab 
            consultant={consultant}
            formatSpecialization={formatSpecialization}
          />
        </TabsContent>
        
        <TabsContent value="booking">
          <BookingTab consultant={consultant} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
