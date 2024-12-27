import React from 'react';
import { GameOverCondition } from '../types/game';
import { gameOverMessages } from '../config/messages';

interface GameOverProps {
  score: number;
  highScore: number;
  level: number;
  attemptedWord: string;
  condition: GameOverCondition;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  score,
  highScore,
  level,
  attemptedWord,
  condition,
  onRestart,
}) => {
  const getMessage = () => {
    if (condition === 'invalidWord') {
      const messages = gameOverMessages.invalidWord[Math.min(level, 6) as keyof typeof gameOverMessages.invalidWord];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    if (level >= 6 && condition === 'tooShort') {
      const messages = gameOverMessages.invalidWord[6];
      return messages[Math.floor(Math.random() * messages.length)];
    }

    const messages = gameOverMessages[condition];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-4xl font-bold text-red-600 mb-4">Game Over</h2>
        <div className="space-y-4">
          <p className="text-2xl">Final Score: {score}</p>
          {score > highScore && (
            <p className="text-xl text-green-600">New High Score!</p>
          )}
          <p className="text-xl">Level Reached: {level}</p>
          {attemptedWord && (
            <p className="text-lg">
              {condition === 'invalidWord' && `Invalid word: ${attemptedWord}`}
              {condition === 'tooShort' && `Word too short: ${attemptedWord}`}
              {condition === 'repeatedWord' && `Already used: ${attemptedWord}`}
              {condition === 'noWordEntered' && 'No word entered'}
            </p>
          )}
          <p className="text-xl italic">{getMessage()}</p>
          <button
            onClick={onRestart}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};