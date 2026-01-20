import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300
                  ${isCompleted 
                    ? "bg-success text-success-foreground" 
                    : isCurrent 
                    ? "gradient-hero text-primary-foreground shadow-card" 
                    : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              <span 
                className={`
                  mt-2 text-xs font-medium hidden sm:block
                  ${isCurrent ? "text-foreground" : "text-muted-foreground"}
                `}
              >
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`
                  w-12 sm:w-16 h-1 mx-2 rounded-full transition-all duration-300
                  ${isCompleted ? "bg-success" : "bg-muted"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
