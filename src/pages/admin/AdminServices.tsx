
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdminContext';

const AdminServices: React.FC = () => {
  const { isAdmin } = useAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Services Management</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Service Catalog</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!isAdmin && (
            <div className="p-4 mb-4 bg-red-100 text-red-800 rounded-md">
              <p className="font-medium">Authentication Required</p>
              <p>You must be logged in as an admin to access service management.</p>
            </div>
          )}
          <div className="p-4 text-center text-gray-500">
            <p>Service management is now handled directly through the Supabase dashboard.</p>
            <p className="mt-2">Please contact the development team for any service configuration changes.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServices;
