
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FractalButtonProps extends ButtonProps {
  fractalType?: 'primary' | 'secondary' | 'outline';
  pulseEffect?: boolean;
}

const FractalButton = React.forwardRef<HTMLButtonElement, FractalButtonProps>(
  ({ className, fractalType = 'primary', pulseEffect = false, children, ...props }, ref) => {
    // Map fractal types to button variants
    const buttonVariant = 
      fractalType === 'primary' ? 'default' : 
      fractalType === 'secondary' ? 'secondary' : 
      'outline';
    
    // Apply appropriate styling based on fractal type, but without fractal effects
    const buttonClasses = cn(
      "font-bold text-lg px-8 py-5 rounded-full flex justify-center items-center text-center w-full",
      fractalType === 'primary' ? 'bg-gradient-to-r from-vibrantPurple to-vividPink text-white hover:from-vibrantPurple/90 hover:to-vividPink/90' : 
      fractalType === 'secondary' ? 'bg-gradient-to-r from-peacefulBlue to-softGreen text-white hover:from-peacefulBlue/90 hover:to-softGreen/90' : 
      'border-2 border-peacefulBlue text-peacefulBlue hover:bg-peacefulBlue/5',
      className
    );
    
    return (
      <Button
        className={buttonClasses}
        variant={buttonVariant}
        ref={ref}
        {...props}
      >
        <span className="mx-auto">{children}</span>
      </Button>
    );
  }
);

FractalButton.displayName = "FractalButton";

export { FractalButton };
