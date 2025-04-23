
import React from "react";
import { cn } from "@/lib/utils";

interface LotusMandalaProps {
  isHovered: boolean;
  animated: boolean;
}

const LotusMandalaPattern: React.FC<LotusMandalaProps> = ({ isHovered, animated }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Lotus petals outer ring */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        animated && "animate-spin-very-slow"
      )}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={cn(
              "absolute top-1 left-1/2 -translate-x-1/2 w-7 h-14",
              "rounded-[100%_100%_0_0] bg-white/5",
              animated && "transition-all duration-700",
              isHovered && animated && "bg-white/10 h-[3.75rem]"
            )}/>
          </div>
        ))}
      </div>
      
      {/* Lotus petals inner ring */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        animated && "animate-spin-reverse-slow"
      )}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 45}deg)` }}
          >
            <div className={cn(
              "absolute top-[25%] left-1/2 -translate-x-1/2 w-5 h-10",
              "rounded-[100%_100%_0_0] bg-white/10",
              animated && "transition-all duration-500",
              isHovered && animated && "bg-white/15 h-11"
            )}/>
          </div>
        ))}
      </div>
      
      {/* Center circle with dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          "w-[40%] h-[40%] rounded-full border border-white/20 flex items-center justify-center",
          animated && "transition-all duration-500",
          isHovered && animated && "border-white/30 scale-110"
        )}>
          <div className={cn(
            "w-[60%] h-[60%] rounded-full bg-white/10",
            animated && "transition-all duration-500",
            isHovered && animated && "bg-white/15"
          )}/>
        </div>
      </div>
      
      {/* Fine lines radiating out */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute h-full w-px bg-white/5", 
              animated && "transition-all duration-700",
              isHovered && animated && "bg-white/10"
            )}
            style={{ transform: `rotate(${i * 15}deg)` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LotusMandalaPattern;
