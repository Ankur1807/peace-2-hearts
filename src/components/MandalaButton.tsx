
import React, { useState, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

import SimpleMandalaPattern from './mandala/SimpleMandalaPattern';
import ComplexMandalaPattern from './mandala/ComplexMandalaPattern';
import LotusMandalaPattern from './mandala/LotusMandalaPattern';

interface MandalaButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'cta' | 'teal';
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

    const buttonVariant = 
      variant === 'primary' ? 'default' : 
      variant === 'secondary' ? 'secondary' : 
      variant === 'cta' ? 'cta' :
      variant === 'teal' ? 'teal' : 'outline';

    // Use teal gradient if variant='teal'; otherwise use original
    const tealClasses = "bg-gradient-to-r from-teal-400 to-teal-600 text-white shadow-md hover:from-teal-500 hover:to-teal-700 border-none";
    
    const baseClasses = cn(
      "relative font-bold rounded-full flex justify-center items-center overflow-hidden z-0",
      // Increase base font size by 4 points (~1rem = 16px, so text-2xl is 24px, which is +4px from text-xl)
      "text-[2rem]",   // 2rem = 32px, so ~4pt larger than before (typically 1pt=1.33px)
      "transition-all duration-300 transform hover:-translate-y-0.5",
      isMobile ? "w-full px-6 py-4" : "px-8 py-4",
      variant === 'teal'
        ? tealClasses
        : variant === 'primary' || variant === 'cta'
        ? "bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] text-white hover:shadow-lg shadow-md hover:from-[#a792fa] hover:to-[#b389f4] border-none"
        : variant === 'secondary'
        ? "bg-gradient-to-r from-[#36bcf6] to-[#7fe6c0] text-white hover:shadow-lg shadow-md border-none"
        : "border-2 border-peacefulBlue text-peacefulBlue hover:bg-peacefulBlue/5",
      className
    );
    
    const MandalaBackground = isMounted && (
      <div className="absolute inset-0 w-full h-full -z-10">
        {mandalaType === 'simple' && <SimpleMandalaPattern isHovered={isHovered} animated={animated} />}
        {mandalaType === 'complex' && <ComplexMandalaPattern isHovered={isHovered} animated={animated} />}
        {mandalaType === 'lotus' && <LotusMandalaPattern isHovered={isHovered} animated={animated} />}
      </div>
    );
    
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
            <Link to={href} className="w-full text-center flex items-center justify-center font-bold text-[2rem]" onClick={onClick}>
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
          <div className="flex items-center justify-center w-full text-center font-bold text-[2rem]">{children}</div>
        </Button>
      </div>
    );
  }
);

MandalaButton.displayName = "MandalaButton";

export { MandalaButton };

