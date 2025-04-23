
import React, { useState, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

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

// Different Mandala Patterns
const SimpleMandala: React.FC<{isHovered: boolean, animated: boolean}> = ({isHovered, animated}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Center circle */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        animated && "transition-transform duration-1000",
        isHovered && animated && "scale-110"
      )}>
        <div className={cn(
          "w-full h-full rounded-full border-2 border-white/20 flex items-center justify-center",
          animated && "transition-all duration-1000",
          isHovered && animated && "scale-105 border-white/30"
        )}>
          <div className={cn(
            "w-[85%] h-[85%] rounded-full border border-white/10",
            animated && "animate-spin-slow"
          )}/>
        </div>
      </div>
      
      {/* Geometric patterns */}
      <div className={cn(
        "absolute inset-0",
        animated && "animate-spin-reverse-slow"
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute h-full w-2 bg-white/5",
                animated && "transition-all duration-500",
                isHovered && animated && "bg-white/10"
              )}
              style={{ transform: `rotate(${i * 30}deg)` }}
            />
          ))}
        </div>
      </div>
      
      {/* Circular rings */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center opacity-70",
        animated && isHovered && "opacity-90 transition-opacity duration-500"
      )}>
        <div className={cn(
          "w-[90%] h-[90%] rounded-full border border-white/10",
          animated && "animate-spin-slow"
        )}/>
        <div className={cn(
          "w-[70%] h-[70%] rounded-full border border-white/15",
          animated && "animate-spin-reverse-slow"
        )}/>
        <div className={cn(
          "w-[50%] h-[50%] rounded-full border border-white/20",
          animated && "animate-spin-slower"
        )}/>
      </div>
    </div>
  );
};

const ComplexMandala: React.FC<{isHovered: boolean, animated: boolean}> = ({isHovered, animated}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background geometric shapes */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        animated && "animate-spin-very-slow"
      )}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 45}deg)` }}
          >
            <div className={cn(
              "absolute top-0 left-[calc(50%-1px)] h-[50%] w-0.5 bg-white/10",
              animated && isHovered && "bg-white/20 transition-colors duration-500"
            )}/>
            <div className={cn(
              "absolute top-[10%] left-[calc(50%-5px)] w-2.5 h-2.5 rounded-full bg-white/15",
              animated && isHovered && "bg-white/25 transition-all duration-500 scale-110"
            )}/>
          </div>
        ))}
      </div>
      
      {/* Rotating triangles */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        animated && "animate-spin-reverse-slow"
      )}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 60}deg)` }}
          >
            <div className={cn(
              "absolute w-full h-full",
              "before:content-[''] before:absolute before:top-0 before:left-[calc(50%-10px)]",
              "before:border-l-[10px] before:border-r-[10px] before:border-b-[20px]", 
              "before:border-l-transparent before:border-r-transparent before:border-b-white/5",
              animated && isHovered && "before:border-b-white/10 transition-all duration-500"
            )}/>
            <div className={cn(
              "absolute w-full h-full",
              "before:content-[''] before:absolute before:bottom-0 before:left-[calc(50%-10px)]",
              "before:border-l-[10px] before:border-r-[10px] before:border-t-[20px]", 
              "before:border-l-transparent before:border-r-transparent before:border-t-white/5",
              animated && isHovered && "before:border-t-white/10 transition-all duration-500"
            )}/>
          </div>
        ))}
      </div>
      
      {/* Central circles */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        animated && "transition-transform duration-700",
        isHovered && animated && "scale-105"
      )}>
        <div className={cn(
          "w-[65%] h-[65%] rounded-full border border-white/20",
          animated && "animate-spin-slow transition-all duration-500",
          isHovered && animated && "border-white/30"
        )}/>
        <div className={cn(
          "w-[45%] h-[45%] rounded-full border border-white/10",
          animated && "animate-spin-reverse-slow"
        )}/>
        <div className={cn(
          "w-[30%] h-[30%] rounded-full bg-white/5",
          animated && isHovered && "bg-white/10 transition-colors duration-500"
        )}/>
      </div>
    </div>
  );
};

const LotusMandala: React.FC<{isHovered: boolean, animated: boolean}> = ({isHovered, animated}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Lotus petals outer ring */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        animated && "animate-spin-very-slow"
      )}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={cn(
              "absolute top-1 left-1/2 -translate-x-1/2 w-7 h-14",
              "rounded-[100%_100%_0_0] bg-white/5",
              animated && "transition-all duration-700",
              isHovered && animated && "bg-white/10 h-[3.75rem]"
            )}/>
          </div>
        ))}
      </div>
      
      {/* Lotus petals inner ring */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        animated && "animate-spin-reverse-slow"
      )}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 45}deg)` }}
          >
            <div className={cn(
              "absolute top-[25%] left-1/2 -translate-x-1/2 w-5 h-10",
              "rounded-[100%_100%_0_0] bg-white/10",
              animated && "transition-all duration-500",
              isHovered && animated && "bg-white/15 h-11"
            )}/>
          </div>
        ))}
      </div>
      
      {/* Center circle with dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          "w-[40%] h-[40%] rounded-full border border-white/20 flex items-center justify-center",
          animated && "transition-all duration-500",
          isHovered && animated && "border-white/30 scale-110"
        )}>
          <div className={cn(
            "w-[60%] h-[60%] rounded-full bg-white/10",
            animated && "transition-all duration-500",
            isHovered && animated && "bg-white/15"
          )}/>
        </div>
      </div>
      
      {/* Fine lines radiating out */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute h-full w-px bg-white/5", 
              animated && "transition-all duration-700",
              isHovered && animated && "bg-white/10"
            )}
            style={{ transform: `rotate(${i * 15}deg)` }}
          />
        ))}
      </div>
    </div>
  );
};

export { MandalaButton };
