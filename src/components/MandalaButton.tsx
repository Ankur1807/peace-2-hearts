
import React, { useState, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

import SimpleMandala from './mandala/SimpleMandala';
import ComplexMandala from './mandala/ComplexMandala';
import LotusMandala from './mandala/LotusMandala';

interface MandalaButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'cta';
  children: React.ReactNode;
  asChild?: boolean;
  mandalaType?: 'simple' | 'complex' | 'lotus';
  animated?: boolean;
  href?: string;
  onClick?: () => void;
}

const MandalaButton = React.forwardRef<HTMLButtonElement, MandalaButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    children, 
    asChild = false, 
    mandalaType = 'simple', 
    animated = true,
    href,
    onClick,
    ...props 
  }, ref) => {
    const isMobile = useIsMobile();
    const [isHovered, setIsHovered] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Map our custom variants to ButtonProps variants
    const buttonVariant = 
      variant === 'primary' ? 'default' : 
      variant === 'secondary' ? 'secondary' : 
      variant === 'cta' ? 'cta' : 'outline';
    
    const baseClasses = cn(
      "relative font-bold text-lg rounded-full flex justify-center items-center overflow-hidden z-0",
      "transition-all duration-300 transform hover:-translate-y-0.5",
      isMobile ? "w-full px-6 py-4" : "px-8 py-4",
      // New improved button styles for vivid purple CTA look
      variant === 'primary' || variant === 'cta'
        ? "bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] text-white hover:shadow-lg shadow-md hover:from-[#a792fa] hover:to-[#b389f4] border-none"
        : variant === 'secondary'
        ? "bg-gradient-to-r from-[#36bcf6] to-[#7fe6c0] text-white hover:shadow-lg shadow-md border-none"
        : "border-2 border-peacefulBlue text-peacefulBlue hover:bg-peacefulBlue/5",
      className
    );
    
    // Only render the mandala background if mounted (to prevent SSR issues)
    const MandalaBackground = isMounted && (
      <div className="absolute inset-0 w-full h-full -z-10">
        {mandalaType === 'simple' && <SimpleMandala isHovered={isHovered} animated={animated} />}
        {mandalaType === 'complex' && <ComplexMandala isHovered={isHovered} animated={animated} />}
        {mandalaType === 'lotus' && <LotusMandala isHovered={isHovered} animated={animated} />}
      </div>
    );
    
    // Generate different content based on asChild prop and href
    if (asChild && href) {
      return (
        <div 
          className={baseClasses}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {MandalaBackground}
          <Button
            className="bg-transparent border-none shadow-none hover:bg-transparent h-auto w-full p-0 text-inherit"
            variant={buttonVariant}
            ref={ref}
            asChild
            {...props}
          >
            <Link to={href} className="w-full text-center flex items-center justify-center" onClick={onClick}>
              {children}
            </Link>
          </Button>
        </div>
      );
    }
    
    return (
      <div 
        className={baseClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {MandalaBackground}
        <Button
          className="bg-transparent border-none shadow-none hover:bg-transparent h-auto w-full p-0 text-inherit"
          variant={buttonVariant}
          ref={ref}
          onClick={onClick}
          asChild={asChild}
          {...props}
        >
          <div className="flex items-center justify-center w-full text-center">{children}</div>
        </Button>
      </div>
    );
  }
);

MandalaButton.displayName = "MandalaButton";

export { MandalaButton };
