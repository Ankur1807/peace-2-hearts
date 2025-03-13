
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Initialize with a default value (false for server-side rendering)
  const [isMobile, setIsMobile] = useState(false);
  
  // Use a separate state to track if we've checked the screen size
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Function to check if viewport is mobile
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);
      setHasChecked(true);
      console.log("Window width:", width, "isMobile:", width < MOBILE_BREAKPOINT);
    };

    // Set initial state immediately
    checkMobile();
    
    // Use resize event listener
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // If we haven't checked the screen size yet, assume we're on desktop
  // This prevents layout shifts during initial load
  return hasChecked ? isMobile : false;
}
