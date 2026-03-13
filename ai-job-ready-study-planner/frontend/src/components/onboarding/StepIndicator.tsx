interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-sm mx-auto">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={idx} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-neon border-neon text-charcoal shadow-neon-sm'
                    : isActive
                    ? 'bg-neon/10 border-neon text-neon shadow-neon-sm'
                    : 'bg-surface-2 border-border text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? 'text-neon' : isCompleted ? 'text-neon/70' : 'text-muted-foreground'
                }`}
              >
                {labels[idx]}
              </span>
            </div>
            {idx < totalSteps - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 transition-all duration-300 ${
                  isCompleted ? 'bg-neon' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
