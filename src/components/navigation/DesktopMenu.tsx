
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface DesktopMenuProps {
  isLoggedIn: boolean;
  userName: string;
  onSignOut: () => void;
}

const DesktopMenu = ({ isLoggedIn, userName, onSignOut }: DesktopMenuProps) => {
  return (
    <div className="hidden md:flex items-center gap-8">
      <Link to="/" className="text-white hover:text-white/80 transition-colors">Home</Link>
      <Link to="/about" className="text-white hover:text-white/80 transition-colors">About Us</Link>
      <Link to="/services" className="text-white hover:text-white/80 transition-colors">Services</Link>
      
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10">Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[220px]">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/resources"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-peacefulBlue/10 hover:text-peacefulBlue focus:bg-peacefulBlue/10 focus:text-peacefulBlue"
                    >
                      <div className="text-sm font-medium">Articles & Guides</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Explore our collection of helpful resources
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/news"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-peacefulBlue/10 hover:text-peacefulBlue focus:bg-peacefulBlue/10 focus:text-peacefulBlue"
                    >
                      <div className="text-sm font-medium">Latest News</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Stay updated with relationship and marriage news
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <Link to="/contact" className="text-white hover:text-white/80 transition-colors">Contact</Link>
      
      <UserMenu isLoggedIn={isLoggedIn} userName={userName} onSignOut={onSignOut} />
    </div>
  );
};

export default DesktopMenu;
