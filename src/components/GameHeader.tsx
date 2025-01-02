import React from 'react';
import { Music } from 'lucide-react';

interface GameHeaderProps {
  tempo: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ tempo }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg flex flex-col sm:flex-row items-center sm:gap-4 sm:h-auto">
      <h1 className="text-xl font-bold text-gray-800 sm:mb-0 mb-2 sm:text-left text-center sm:w-auto w-full">
        Alphabet Rhythm
      </h1>
      <div className="flex items-center gap-2 sm:mb-0 mb-2 sm:w-auto w-full justify-center sm:justify-start">
        <Music className="w-5 h-5 text-blue-500 animate-pulse" />
        <span className="text-sm text-gray-600">{tempo}</span>
      </div>
    </div>
  );
};
