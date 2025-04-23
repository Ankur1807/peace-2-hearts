
import React from "react";
import { cn } from "@/lib/utils";

interface ComplexMandalaProps {
  isHovered: boolean;
  animated: boolean;
}

const ComplexMandalaPattern: React.FC<ComplexMandalaProps> = ({ isHovered, animated }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background geometric shapes */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        animated && "animate-spin-very-slow"
      )}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 45}deg)` }}
          >
            <div className={cn(
              "absolute top-0 left-[calc(50%-1px)] h-[50%] w-0.5 bg-white/10",
              animated && isHovered && "bg-white/20 transition-colors duration-500"
            )}/>
            <div className={cn(
              "absolute top-[10%] left-[calc(50%-5px)] w-2.5 h-2.5 rounded-full bg-white/15",
              animated && isHovered && "bg-white/25 transition-all duration-500 scale-110"
            )}/>
          </div>
        ))}
      </div>
      
      {/* Rotating triangles */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        animated && "animate-spin-reverse-slow"
      )}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 60}deg)` }}
          >
            <div className={cn(
              "absolute w-full h-full",
              "before:content-[''] before:absolute before:top-0 before:left-[calc(50%-10px)]",
              "before:border-l-[10px] before:border-r-[10px] before:border-b-[20px]", 
              "before:border-l-transparent before:border-r-transparent before:border-b-white/5",
              animated && isHovered && "before:border-b-white/10 transition-all duration-500"
            )}/>
            <div className={cn(
              "absolute w-full h-full",
              "before:content-[''] before:absolute before:bottom-0 before:left-[calc(50%-10px)]",
              "before:border-l-[10px] before:border-r-[10px] before:border-t-[20px]", 
              "before:border-l-transparent before:border-r-transparent before:border-t-white/5",
              animated && isHovered && "before:border-t-white/10 transition-all duration-500"
            )}/>
          </div>
        ))}
      </div>
      
      {/* Central circles */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        animated && "transition-transform duration-700",
        isHovered && animated && "scale-105"
      )}>
        <div className={cn(
          "w-[65%] h-[65%] rounded-full border border-white/20",
          animated && "animate-spin-slow transition-all duration-500",
          isHovered && animated && "border-white/30"
        )}/>
        <div className={cn(
          "w-[45%] h-[45%] rounded-full border border-white/10",
          animated && "animate-spin-reverse-slow"
        )}/>
        <div className={cn(
          "w-[30%] h-[30%] rounded-full bg-white/5",
          animated && isHovered && "bg-white/10 transition-colors duration-500"
        )}/>
      </div>
    </div>
  );
};

export default ComplexMandalaPattern;
