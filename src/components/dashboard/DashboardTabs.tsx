
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MessageCircle, FileText, Users } from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, setActiveTab }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-transparent">
        <TabsTrigger 
          value="appointments" 
          className={`flex items-center gap-2 ${activeTab === 'appointments' ? 'bg-blue-50 text-blue-600' : ''}`}
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden md:inline">Appointments</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="messages" 
          className={`flex items-center gap-2 ${activeTab === 'messages' ? 'bg-blue-50 text-blue-600' : ''}`}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden md:inline">Messages</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="documents" 
          className={`flex items-center gap-2 ${activeTab === 'documents' ? 'bg-blue-50 text-blue-600' : ''}`}
        >
          <FileText className="h-4 w-4" />
          <span className="hidden md:inline">Documents</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="consultants" 
          className={`flex items-center gap-2 ${activeTab === 'consultants' ? 'bg-blue-50 text-blue-600' : ''}`}
        >
          <Users className="h-4 w-4" />
          <span className="hidden md:inline">Consultants</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DashboardTabs;
