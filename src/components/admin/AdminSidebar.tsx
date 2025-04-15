
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CalendarClock,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    // Clear admin authentication
    localStorage.removeItem('p2h_admin_authenticated');
    localStorage.removeItem('p2h_admin_auth_time');
    
    // Sign out from Supabase if signed in
    await supabase.auth.signOut();
    
    toast({
      title: "Signed out",
      description: "You have been signed out from the admin portal"
    });
    
    navigate('/admin');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
      isActive 
        ? 'bg-peacefulBlue text-white' 
        : 'hover:bg-gray-200'
    }`;

  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Peace2Hearts Admin</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/admin" end className={navLinkClass}>
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/admin/consultants" className={navLinkClass}>
          <Users className="h-5 w-5" />
          <span>Consultants</span>
        </NavLink>
        
        <NavLink to="/admin/pricing" className={navLinkClass}>
          <DollarSign className="h-5 w-5" />
          <span>Services & Pricing</span>
        </NavLink>
        
        <NavLink to="/admin/bookings" className={navLinkClass}>
          <CalendarClock className="h-5 w-5" />
          <span>Booking History</span>
        </NavLink>
        
        <NavLink to="/admin/settings" className={navLinkClass}>
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>
      </nav>
      
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 justify-center"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
