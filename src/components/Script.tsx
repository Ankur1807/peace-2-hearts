
import React, { useEffect, useState } from 'react';

interface ScriptProps {
  src: string;
  async?: boolean;
  defer?: boolean;
  id?: string;
  onLoad?: () => void;
}

const Script: React.FC<ScriptProps> = ({ src, async = true, defer = false, id, onLoad }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    const existingScript = document.querySelector(`script[src="${src}"]`);
    
    if (existingScript) {
      setLoaded(true);
      onLoad?.();
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    if (id) script.id = id;
    
    // Event listeners
    script.onload = () => {
      setLoaded(true);
      if (onLoad) onLoad();
    };
    
    // Append the script to the document
    document.body.appendChild(script);
    
    // Clean up
    return () => {
      // Only remove the script if it's not needed elsewhere
      if (id) {
        const scriptToRemove = document.getElementById(id);
        if (scriptToRemove) document.body.removeChild(scriptToRemove);
      }
    };
  }, [src, async, defer, id, onLoad]);

  return null;
};

export default Script;
