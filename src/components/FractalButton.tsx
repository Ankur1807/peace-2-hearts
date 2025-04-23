
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface FractalButtonProps extends ButtonProps {
  fractalType?: 'primary' | 'secondary' | 'outline' | 'cta';
  pulseEffect?: boolean;
}

const FractalButton = React.forwardRef<HTMLButtonElement, FractalButtonProps>(
  ({ className, fractalType = 'primary', pulseEffect = false, children, asChild = false, ...props }, ref) => {
    const isMobile = useIsMobile();
    
    const buttonVariant = 
      fractalType === 'primary' ? 'default' : 
      fractalType === 'secondary' ? 'secondary' : 
      fractalType === 'cta' ? 'cta' :
      'outline';
    
    const buttonClasses = cn(
      "font-bold text-lg px-8 py-5 rounded-full flex justify-center items-center text-center transition-all duration-300",
      isMobile ? "w-full" : "",
      fractalType === 'primary' ? 'bg-gradient-to-r from-vibrantPurple to-vividPink text-white hover:from-vibrantPurple/90 hover:to-vividPink/90' : 
      fractalType === 'secondary' ? 'bg-gradient-to-r from-peacefulBlue to-softGreen text-white hover:from-peacefulBlue/90 hover:to-softGreen/90' : 
      fractalType === 'cta' ? 'bg-vibrantPurple text-white border-2 border-peacefulBlue hover:bg-vibrantPurple/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' :
      'border-2 border-peacefulBlue text-peacefulBlue hover:bg-peacefulBlue/5',
      className
    );
    
    return (
      <Button
        className={buttonClasses}
        variant={buttonVariant}
        ref={ref}
        asChild={asChild}
        {...props}
      >
        <div className="flex items-center justify-center w-full text-center">{children}</div>
      </Button>
    );
  }
);

FractalButton.displayName = "FractalButton";

export { FractalButton };

