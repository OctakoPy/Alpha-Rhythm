// Scoring configuration
export const SCORING_CONFIG = {
  basePointsPerLetter: 10,
  doubleLetterMultiplier: 2,
  levelMultipliers: {
    1: 1,
    2: 1.5,
    3: 2,
    4: 2.5,
    5: 3,
    6: 3.5
  },
  defaultMultiplier: 3.5, // For levels > 6
  additionalWordLengthInterval: 10000 // Points needed for +1 minimum word length after level 6
};

export const calculateScore = (wordLength: number, level: number, isDoubleLetter: boolean): number => {
  const basePoints = wordLength * SCORING_CONFIG.basePointsPerLetter;
  const letterMultiplier = isDoubleLetter ? SCORING_CONFIG.doubleLetterMultiplier : 1;
  const levelMultiplier = level <= 6 
    ? SCORING_CONFIG.levelMultipliers[level as keyof typeof SCORING_CONFIG.levelMultipliers]
    : SCORING_CONFIG.defaultMultiplier;

  return Math.floor(basePoints * letterMultiplier * levelMultiplier);
};