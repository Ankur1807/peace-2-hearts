
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ServiceCategorySelectorProps {
  serviceCategory: string;
  setServiceCategory: (category: string) => void;
}

const ServiceCategorySelector: React.FC<ServiceCategorySelectorProps> = ({
  serviceCategory,
  setServiceCategory
}) => {
  return (
    <div className="space-y-4">
      <Tabs 
        value={serviceCategory} 
        onValueChange={setServiceCategory}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger 
            value="mental-health"
            className="py-3 data-[state=active]:bg-peacefulBlue data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 5 17.5v-12a2.5 2.5 0 0 1 4.96-.44A2.5 2.5 0 0 1 12 2.5"/>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 19 17.5v-12a2.5 2.5 0 0 0-4.96-.44A2.5 2.5 0 0 0 12 2.5"/>
                <path d="M7 16.01V16"/>
                <path d="M17 16.01V16"/>
                <path d="M7 20.01V20"/>
                <path d="M17 20.01V20"/>
                <path d="M7 8.01V8"/>
                <path d="M17 8.01V8"/>
              </svg>
              <span>Mental Health</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="legal"
            className="py-3 data-[state=active]:bg-peacefulBlue data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scale">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="M7 21h10"/>
                <path d="M12 3v18"/>
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
              </svg>
              <span>Legal</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="holistic"
            className="py-3 data-[state=active]:bg-peacefulBlue data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>Holistic</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mental-health" className="p-4 bg-gray-50 rounded-md mt-4">
          <p className="text-sm text-gray-600">
            Our mental health professionals provide support through therapy and counseling to help you navigate relationship challenges.
          </p>
        </TabsContent>
        
        <TabsContent value="legal" className="p-4 bg-gray-50 rounded-md mt-4">
          <p className="text-sm text-gray-600">
            Expert legal consultation for marriage, divorce, maintenance, and custody matters, with a focus on peaceful resolution.
          </p>
        </TabsContent>
        
        <TabsContent value="holistic" className="p-4 bg-gray-50 rounded-md mt-4">
          <p className="text-sm text-gray-600">
            Comprehensive packages combining both mental health and legal support for complete peace of mind.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceCategorySelector;
