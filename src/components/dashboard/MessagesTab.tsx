
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const MessagesTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Messages</h2>
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Recent messages from your specialists.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* In a future update, these would be fetched from Supabase */}
          <div className="flex items-start p-3 border rounded-md">
            <MessageSquare className="h-5 w-5 mr-3 mt-1 text-gray-500" />
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium">Dr. Sarah Johnson</p>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <p className="text-sm text-gray-600">Hi there! I've sent you some resources to review before our next appointment. Please let me know if you have any questions.</p>
            </div>
          </div>
          <div className="flex items-start p-3 border rounded-md">
            <MessageSquare className="h-5 w-5 mr-3 mt-1 text-gray-500" />
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium">Atty. Michael Chen</p>
                <span className="text-xs text-gray-500">1 week ago</span>
              </div>
              <p className="text-sm text-gray-600">I've reviewed your documents and would like to schedule a follow-up call to discuss next steps. Please let me know your availability.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesTab;
