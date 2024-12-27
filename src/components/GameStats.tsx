import React from 'react';

interface GameStatsProps {
  score: number;
  highScore: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ score, highScore }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
      <div className="text-sm font-medium">
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
      </div>
    </div>
  );
};