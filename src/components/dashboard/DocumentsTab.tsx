
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const DocumentsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Documents</h2>
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>View and download your documents.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* In a future update, these would be fetched from Supabase storage */}
          <div className="flex items-center p-3 border rounded-md">
            <FileText className="h-5 w-5 mr-3 text-gray-500" />
            <div>
              <p className="font-medium">Consultation Summary - Mental Health</p>
              <p className="text-sm text-gray-500">Uploaded on May 15, 2023</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">Download</Button>
          </div>
          <div className="flex items-center p-3 border rounded-md">
            <FileText className="h-5 w-5 mr-3 text-gray-500" />
            <div>
              <p className="font-medium">Legal Agreement</p>
              <p className="text-sm text-gray-500">Uploaded on April 2, 2023</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">Download</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTab;
