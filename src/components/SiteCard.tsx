
import React from "react";
import { cn } from "@/lib/utils";

interface SiteCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const SiteCard: React.FC<SiteCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        // Pastel tint, rounded, inner padding, border, drop-shadow, for consistency
        "bg-gradient-to-br from-white to-softPink/10 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default SiteCard;
