
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "./AdminSidebar";
import { AdminProvider, useAdmin } from "@/hooks/useAdminContext";

export const AdminLayoutContent = () => {
  const { isAdmin, isAdminChecking } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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

  // If we're still here and not checking, user must be admin
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-10">
        <Outlet />
      </div>
    </div>
  );
};

// Wrap the admin layout with the admin context provider
const AdminLayout = () => {
  return (
    <AdminProvider>
      <AdminLayoutContent />
    </AdminProvider>
  );
};

export default AdminLayout;
