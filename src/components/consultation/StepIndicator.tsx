
import React from 'react';
import { cn } from "@/lib/utils";

type StepIndicatorProps = {
  currentStep: number;
  steps: {
    number: number;
    label: string;
  }[];
};

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center relative mb-6">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center relative z-10">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium",
                currentStep >= step.number ? "bg-peacefulBlue" : "bg-gray-300"
              )}
            >
              {step.number}
            </div>
            <span className={cn(
              "text-sm mt-2",
              currentStep >= step.number ? "text-peacefulBlue font-medium" : "text-gray-500"
            )}>
              {step.label}
            </span>
          </div>
        ))}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
        <div 
          className="absolute top-5 left-0 h-0.5 bg-peacefulBlue -z-10 transition-all" 
          style={{ width: `${(currentStep - 1) * 33.3}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepIndicator;
