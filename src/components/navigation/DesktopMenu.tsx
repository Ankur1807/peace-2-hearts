
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';
import { signOut } from '@/utils/authUtils';

interface DesktopMenuProps {
  isLoggedIn: boolean;
  userName: string;
  onSignOut: () => void;
}

const DesktopMenu = ({ isLoggedIn, userName, onSignOut }: DesktopMenuProps) => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    onSignOut?.();
    navigate('/');
  };

  // Navigation menu item component
  const MenuItem = React.forwardRef<
    React.ElementRef<typeof NavigationMenuLink>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuLink>
  >(({ className, children, ...props }, ref) => (
    <NavigationMenuLink ref={ref} className={cn("px-4 py-2 text-white hover:bg-purple-800/50 rounded-md", className)} {...props}>
      {children}
    </NavigationMenuLink>
  ));
  MenuItem.displayName = "MenuItem";

  return (
    <div className="flex items-center">
      <NavigationMenu className="text-white">
        <NavigationMenuList className="space-x-1">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/" className="px-4 py-2 text-white hover:bg-purple-800/50 rounded-md">
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-white hover:bg-purple-800/50 data-[state=open]:bg-purple-800/50">Services</NavigationMenuTrigger>
            <NavigationMenuContent className="bg-purple-800 p-2 shadow-lg rounded-md min-w-[200px]">
              <Link to="/services/mental-health" className="block px-3 py-2 hover:bg-purple-700 rounded-md">Mental Health</Link>
              <Link to="/services/legal-support" className="block px-3 py-2 hover:bg-purple-700 rounded-md">Legal Support</Link>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/consultants" className="px-4 py-2 text-white hover:bg-purple-800/50 rounded-md">
                Consultants
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/resources" className="px-4 py-2 text-white hover:bg-purple-800/50 rounded-md">
                Resources
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/about" className="px-4 py-2 text-white hover:bg-purple-800/50 rounded-md">
                About
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/contact" className="px-4 py-2 text-white hover:bg-purple-800/50 rounded-md">
                Contact
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/admin" className="px-4 py-2 text-white hover:bg-purple-800/50 rounded-md">
                Admin
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="ml-6">
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" className="bg-transparent text-white hover:bg-white hover:text-purple-600 border-white">
                Dashboard
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              onClick={handleSignOut}
              className="bg-white/20 text-white hover:bg-white hover:text-purple-600"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <UserMenu isLoggedIn={false} userName="" onSignOut={() => {}} />
        )}
      </div>
    </div>
  );
};

export default DesktopMenu;
