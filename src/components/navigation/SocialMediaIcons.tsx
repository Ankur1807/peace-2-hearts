
import { Facebook, Instagram, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SocialMediaIconsProps {
  className?: string;
  iconClassName?: string;
  iconSize?: number;
  showLabels?: boolean;
}

const SocialMediaIcons = ({
  className,
  iconClassName,
  iconSize = 20,
  showLabels = false,
}: SocialMediaIconsProps) => {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/people/Peace2Hearts/61576144408544/",
      icon: Facebook,
    },
    {
      name: "Twitter",
      url: "https://x.com/Peace2Hearts_1",
      icon: Twitter,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/peace2hearts_1/",
      icon: Instagram,
    },
  ];

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-2 text-white/80 hover:text-white transition-colors",
            iconClassName
          )}
          aria-label={`Follow us on ${social.name}`}
        >
          <social.icon size={iconSize} />
          {showLabels && <span>{social.name}</span>}
        </a>
      ))}
    </div>
  );
};

export default SocialMediaIcons;
