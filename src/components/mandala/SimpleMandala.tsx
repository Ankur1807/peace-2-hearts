
import React from "react";
import { cn } from "@/lib/utils";

interface SimpleMandalaProps {
  isHovered: boolean;
  animated: boolean;
}

const SimpleMandala: React.FC<SimpleMandalaProps> = ({ isHovered, animated }) => {
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

export default SimpleMandala;
