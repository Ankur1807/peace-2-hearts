
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    
    // Setup media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handle resize events directly
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize);
    
    // Handle media query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    // Modern browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", handleChange)
    } 
    // Legacy support
    else if ('addListener' in mql) {
      // @ts-ignore - for older browsers
      mql.addListener(handleChange)
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleChange)
      } 
      else if ('removeListener' in mql) {
        // @ts-ignore - for older browsers
        mql.removeListener(handleChange)
      }
    }
  }, [])

  return isMobile
}
