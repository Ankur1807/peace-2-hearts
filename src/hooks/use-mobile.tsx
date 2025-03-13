
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Setup media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
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
