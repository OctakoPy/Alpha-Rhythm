import React from 'react';
import { LetterEffect } from './effects/LetterEffect';

interface CurrentLetterProps {
  letter: string;
  nextLetter: string;
  level: number;
  minLength: number;
}

export const CurrentLetter: React.FC<CurrentLetterProps> = ({ 
  letter, 
  nextLetter, 
  level, 
  minLength 
}) => {
  return (
    <div className="text-center">
      <div className="flex items-center gap-8 justify-center mb-6"> {/* Increased `mb-6` */}
        <div className="text-8xl font-bold text-white">
          <LetterEffect level={level}>{letter}</LetterEffect>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white/70 text-sm mb-1">Next</span>
          <span className="text-4xl font-bold text-white/80">{nextLetter}</span>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg mt-4"> {/* Added `mt-4` */}
        <p className="text-sm text-gray-600">
          Minimum word length: {minLength}
        </p>
      </div>
    </div>
  );
};