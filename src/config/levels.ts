import { LevelConfig } from '../types/game';

export const LEVELS: LevelConfig[] = [
  {
    pointsRange: [0, 1000],
    minWordLength: 2,
    timeLimit: 15,
    tempo: 'Slow',
    bpm: 80,
  },
  {
    pointsRange: [1001, 5000],
    minWordLength: 3,
    timeLimit: 12,
    tempo: 'Medium',
    bpm: 100,
  },
  {
    pointsRange: [5001, 12000],
    minWordLength: 4,
    timeLimit: 10,
    tempo: 'Fast',
    bpm: 120,
  },
  {
    pointsRange: [12001, 20000],
    minWordLength: 5,
    timeLimit: 8,
    tempo: 'Very Fast',
    bpm: 140,
  },
  {
    pointsRange: [20001, 30000],
    minWordLength: 6,
    timeLimit: 6,
    tempo: 'Super Fast',
    bpm: 160,
  },
  {
    pointsRange: [30001, 40000],
    minWordLength: 7,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [40001, 50000],
    minWordLength: 8,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [50001, 60000],
    minWordLength: 9,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [60001, 70000],
    minWordLength: 10,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [70001, 80000],
    minWordLength: 11,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [80001, 90000],
    minWordLength: 12,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [90001, 100000],
    minWordLength: 13,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [100001, 110000],
    minWordLength: 14,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [110001, 120000],
    minWordLength: 15,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [120001, 130000],
    minWordLength: 16,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [130001, 140000],
    minWordLength: 17,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [140001, 150000],
    minWordLength: 18,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [150001, 160000],
    minWordLength: 19,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [160001, 170000],
    minWordLength: 20,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [170001, 180000],
    minWordLength: 21,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [180001, 190000],
    minWordLength: 22,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [190001, 200000],
    minWordLength: 23,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [200001, 210000],
    minWordLength: 24,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [210001, 220000],
    minWordLength: 25,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
  {
    pointsRange: [220001, Infinity],
    minWordLength: 26,
    timeLimit: 4,
    tempo: 'Ultra Fast',
    bpm: 180,
  },
];


export const calculateMinWordLength = (score: number, baseMinLength: number): number => {
  if (score <= 220000) return baseMinLength;
  
  // For every 10000 points above 30000, increase min length by 1
  const additionalLength = Math.floor((score - 30000) / 10000);
  return baseMinLength + additionalLength;
};