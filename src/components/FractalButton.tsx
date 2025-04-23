
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface FractalButtonProps extends ButtonProps {
  fractalType?: 'primary' | 'secondary' | 'outline' | 'cta';
  pulseEffect?: boolean;
  showArrow?: boolean;
}

const FractalButton = React.forwardRef<HTMLButtonElement, FractalButtonProps>(
  ({ className, fractalType = 'primary', pulseEffect = false, showArrow = true, children, ...props }, ref) => {
    const buttonVariant = 
      fractalType === 'primary' ? 'default' : 
      fractalType === 'secondary' ? 'secondary' : 
      fractalType === 'cta' ? 'cta' :
      'outline';
    
    const buttonClasses = cn(
      "font-bold text-base px-6 py-3 rounded-lg flex items-center justify-center text-center gap-2 transition-all duration-300",
      fractalType === 'primary' ? 'bg-gradient-to-r from-vibrantPurple to-vividPink text-white hover:from-vibrantPurple/90 hover:to-vividPink/90' : 
      fractalType === 'secondary' ? 'bg-gradient-to-r from-peacefulBlue to-softGreen text-white hover:from-peacefulBlue/90 hover:to-softGreen/90' : 
      fractalType === 'cta' ? 'bg-gradient-to-r from-vibrantPurple to-vividPink text-white border-2 border-peacefulBlue hover:from-vibrantPurple/90 hover:to-vividPink/90 shadow-lg hover:shadow-xl' :
      'border-2 border-peacefulBlue text-peacefulBlue hover:bg-peacefulBlue/5',
      className
    );
    
    // When using asChild, we need to ensure there's only one child element
    // We'll modify our approach based on whether asChild is true
    if (props.asChild) {
      // With asChild, we need a single child so we don't add the arrow here
      return (
        <Button
          className={buttonClasses}
          variant={buttonVariant}
          ref={ref}
          {...props}
        >
          {children}
        </Button>
      );
    }
    
    // Without asChild, we can add both children and arrow directly
    return (
      <Button
        className={buttonClasses}
        variant={buttonVariant}
        ref={ref}
        {...props}
      >
        {children}
        {showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    );
  }
);

FractalButton.displayName = "FractalButton";

export { FractalButton };
