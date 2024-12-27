import React from 'react';
import { Music } from 'lucide-react';

interface GameHeaderProps {
  tempo: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ tempo }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg flex items-center gap-4">
      <h1 className="text-xl font-bold text-gray-800">Alphabet Rhythm</h1>
      <div className="flex items-center gap-2">
        <Music className="w-5 h-5 text-blue-500 animate-pulse" />
        <span className="text-sm text-gray-600">{tempo}</span>
      </div>
    </div>
  );
};