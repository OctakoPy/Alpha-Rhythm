import { GameOverCondition } from '../types/game';
import { gameOverMessages } from '../config/messages';

export const getGameOverMessage = (condition: GameOverCondition, level: number): string => {
  if (condition === 'invalidWord' || (level >= 6 && condition === 'tooShort')) {
    const messages = gameOverMessages.invalidWord[Math.min(level, 6) as keyof typeof gameOverMessages.invalidWord];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  const messages = gameOverMessages[condition];
  return messages[Math.floor(Math.random() * messages.length)];
};