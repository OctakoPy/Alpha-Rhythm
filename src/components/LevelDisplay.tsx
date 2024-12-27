import React from 'react';

interface LevelDisplayProps {
  level: number;
}

export const LevelDisplay: React.FC<LevelDisplayProps> = ({ level }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
      <span className="text-lg font-semibold text-blue-600">Level {level}</span>
    </div>
  );
};