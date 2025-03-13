
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Set initial state based on window width if available
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    // Function to check if viewport is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Run on mount to ensure correct initial state
    checkMobile();

    // Set up media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleMediaQueryChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    
    // Also listen for resize events for more responsive behavior
    window.addEventListener('resize', checkMobile);
    mql.addEventListener("change", handleMediaQueryChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mql.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return isMobile;
}
