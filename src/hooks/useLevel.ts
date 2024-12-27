import { useMemo } from 'react';
import { LEVELS } from '../config/levels';

export const useLevel = (score: number) => {
  return useMemo(() => {
    const levelIndex = LEVELS.findIndex(
      (level, index) => {
        const nextLevel = LEVELS[index + 1];
        if (!nextLevel) return true;
        return score >= level.pointsRange[0] && score < nextLevel.pointsRange[0];
      }
    );
    return {
      currentLevel: levelIndex + 1,
      config: LEVELS[levelIndex],
    };
  }, [score]);
};