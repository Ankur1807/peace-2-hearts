import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  Package, 
  DollarSign, 
  ArrowRightLeft,
  ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home className="h-5 w-5" /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Consultants', path: '/admin/consultants', icon: <Users className="h-5 w-5" /> },
    { name: 'Services', path: '/admin/services', icon: <Package className="h-5 w-5" /> },
    { 
      name: 'Pricing', 
      path: '/admin/pricing', 
      icon: <DollarSign className="h-5 w-5" />,
      subItems: [
        { name: 'Price Management', path: '/admin/pricing' },
        { name: 'Pricing Audit', path: '/admin/pricing/audit', icon: <ClipboardCheck className="h-4 w-4" /> }
      ]
    },
    { name: 'Payment Migration', path: '/admin/migration', icon: <ArrowRightLeft className="h-5 w-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r py-4">
      <div className="px-6 py-3">
        <Link to="/" className="flex items-center space-x-2 font-semibold">
          <Home className="h-5 w-5" />
          <span>Peace2Hearts</span>
        </Link>
      </div>
    
    <div className="space-y-4">
      {menuItems.map((item) => (
        <React.Fragment key={item.path}>
          <Link
            to={item.path}
            className={cn(
              "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
              isActive(item.path) && !item.subItems 
                ? "bg-gray-100 text-gray-900" 
                : "text-gray-600"
            )}
          >
            <span className="text-gray-500">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
          
          {item.subItems && (
            <div className="pl-10 space-y-1 mt-1">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={cn(
                    "flex items-center space-x-2 text-xs rounded-md px-3 py-1.5 hover:bg-gray-100 hover:text-gray-900",
                    isActive(subItem.path) ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600"
                  )}
                >
                  {subItem.icon && <span className="text-gray-500">{subItem.icon}</span>}
                  <span>{subItem.name}</span>
                </Link>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
    
      <div className="mt-auto px-6 py-3 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} Peace2Hearts
      </div>
    </div>
  );
};

export default AdminSidebar;
