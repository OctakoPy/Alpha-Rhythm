import React from 'react';

interface ProgressBarProps {
  timeRemaining: number;
  totalTime: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ timeRemaining, totalTime }) => {
  const progress = (timeRemaining / totalTime) * 100;
  const getColor = () => {
    if (progress > 66) return 'bg-green-500';
    if (progress > 33) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isPulsing = timeRemaining <= 3;
  const isFlashing = timeRemaining <= 1;

  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-200 ${getColor()} ${
          isPulsing ? 'animate-pulse' : ''
        } ${isFlashing ? 'animate-flash' : ''}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};