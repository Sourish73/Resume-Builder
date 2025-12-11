import React from 'react';

const StepProgress = ({ 
  currentStep = 1, 
  totalSteps = 5, 
  color = '#ec4899', 
  bgColor = '#e5e7eb', 
  completedColor = '#06b6d4',
  size = 32,
  showLabels = false,
  labels = [],
  direction = 'horizontal',
  showProgressText = true
}) => {
  const isVertical = direction === 'vertical';
  
  // Ensure currentStep is within valid range
  const safeCurrentStep = Math.max(1, Math.min(currentStep, totalSteps));
  const progressPercentage = (safeCurrentStep / totalSteps) * 100;
  
  // Debug logging to help identify the issue
  console.log('StepProgress Debug:', { currentStep, safeCurrentStep, totalSteps, progressPercentage });

  // Progress text based on percentage
  const getProgressText = () => {
    if (progressPercentage <= 0) return "Not Started";
    if (progressPercentage < 25) return "Getting Started";
    if (progressPercentage < 50) return "In Progress";
    if (progressPercentage < 75) return "Halfway There";
    if (progressPercentage < 100) return "Almost Done";
    return "Completed";
  };

  return (
    <div className={`flex ${isVertical ? 'flex-col' : 'flex-col'} items-center gap-4 p-4`}>
      {/* Progress Text */}
      {showProgressText && (
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-lg text-gray-600 mt-1">
            {getProgressText()}
          </div>
          {/* Debug info - remove in production */}
          <div className="text-xs text-gray-400 mt-1">
            Step {safeCurrentStep} of {totalSteps}
          </div>
        </div>
      )}
      
      <div className={`flex ${isVertical ? 'flex-col items-start' : 'flex-row items-center'} gap-4`}>
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < safeCurrentStep;
          const isCurrent = stepNumber === safeCurrentStep;
          const stepLabel = labels[index] || `Step ${stepNumber}`;
          
          return (
            <React.Fragment key={index}>
              <div className={`flex ${isVertical ? 'flex-row items-center' : 'flex-col items-center'} gap-3`}>
                {/* Step Circle */}
                <div 
                  className={`
                    rounded-full flex items-center justify-center 
                    transition-all duration-300 font-semibold
                    shadow-md border-2 border-white
                    ${isCompleted ? 'scale-110 shadow-lg' : isCurrent ? 'scale-105' : 'scale-100'}
                  `}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: isCompleted 
                      ? completedColor
                      : isCurrent 
                        ? color
                        : bgColor,
                    color: isCurrent || isCompleted ? 'white' : '#6b7280',
                    fontSize: `${size * 0.4}px`,
                    borderColor: isCurrent ? completedColor : 'transparent'
                  }}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                
                {/* Step Label */}
                {showLabels && (
                  <div className={`text-center ${isVertical ? 'min-w-24' : ''}`}>
                    <div 
                      className={`font-medium transition-all ${
                        isCurrent ? 'text-gray-900 scale-105' : 'text-gray-600'
                      }`}
                      style={{
                        color: isCurrent ? color : isCompleted ? completedColor : '#6b7280'
                      }}
                    >
                      {stepLabel}
                    </div>
                    {isCurrent && (
                      <div className="text-xs text-gray-500 mt-1">Current</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <div 
                  className={`
                    transition-all duration-500 
                    ${isVertical ? 'w-0.5 h-8 ml-4' : 'h-0.5 w-12'}
                  `}
                  style={{
                    backgroundColor: stepNumber < safeCurrentStep ? completedColor : bgColor
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;