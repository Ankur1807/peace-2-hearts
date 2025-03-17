
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentsTab from "./AppointmentsTab";
import DocumentsTab from "./DocumentsTab";
import MessagesTab from "./MessagesTab";

interface DashboardTabsProps {
  appointments: Array<{
    id: string;
    date: Date;
    service: string;
    specialist: string;
    status: "upcoming" | "completed" | "cancelled";
  }>;
}

const DashboardTabs = ({ appointments }: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="appointments" className="space-y-8">
      <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>

      <TabsContent value="appointments">
        <AppointmentsTab appointments={appointments} />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsTab />
      </TabsContent>

      <TabsContent value="messages">
        <MessagesTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
