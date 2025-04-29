
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdminContext";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Calendar,
  Settings,
  LogOut,
  FileEdit
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const { adminLogout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard"
    },
    {
      label: "Consultants",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/consultants"
    },
    {
      label: "Pricing",
      icon: <DollarSign className="h-5 w-5" />,
      href: "/admin/pricing"
    },
    {
      label: "Services",
      icon: <FileEdit className="h-5 w-5" />,
      href: "/admin/services"
    },
    {
      label: "Bookings",
      icon: <Calendar className="h-5 w-5" />,
      href: "/admin/bookings"
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings"
    }
  ];

  return (
    <aside className="w-64 bg-white shadow-md hidden md:block">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold text-peacefulBlue">Peace2Hearts</h1>
          <p className="text-sm text-gray-500">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg",
                isActive 
                  ? "bg-peacefulBlue text-white" 
                  : "hover:bg-gray-100 hover:text-peacefulBlue"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
