
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FractalButtonProps extends ButtonProps {
  fractalType?: 'primary' | 'secondary' | 'outline';
  pulseEffect?: boolean;
}

const FractalButton = React.forwardRef<HTMLButtonElement, FractalButtonProps>(
  ({ className, fractalType = 'primary', pulseEffect = false, children, ...props }, ref) => {
    const fractalVariant = 
      fractalType === 'primary' ? 'fractal' : 
      fractalType === 'secondary' ? 'fractalSecondary' : 
      'fractalOutline';
    
    const pulseClass = pulseEffect ? 'pulse-effect' : '';
    
    return (
      <div className={cn("fractal-button-wrapper relative", pulseClass)}>
        <div className="fractal-noise absolute inset-0 z-0 opacity-30"></div>
        <Button
          className={cn("relative z-10", className)}
          variant={fractalVariant}
          ref={ref}
          {...props}
        >
          {children}
        </Button>
      </div>
    );
  }
);

FractalButton.displayName = "FractalButton";

export { FractalButton };
