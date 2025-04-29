
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdminContext";

const AdminLayout: React.FC = () => {
  const { isAdmin, isAdminChecking } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    // Only redirect if we've finished checking and user is not admin
    if (!isAdminChecking && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You need to be authenticated as admin to access this area",
        variant: "destructive",
      });
      navigate("/admin/login");
    }
  }, [isAdmin, isAdminChecking, navigate, toast]);

  // Show loading state while checking admin status
  if (isAdminChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-peacefulBlue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-peacefulBlue text-white shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Peace2Hearts Admin</h1>
          <nav>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-peacefulBlue/90" asChild>
              <Link to="/">Back to Site</Link>
            </Button>
          </nav>
        </div>
      </header>
      
      <div className="flex-1 flex">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-10 bg-gray-50">
          <Outlet />
        </div>
      </div>
      
      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto py-4 px-4 text-center text-sm text-gray-600">
          Peace2Hearts Admin Portal &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
