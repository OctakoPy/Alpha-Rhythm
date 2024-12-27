export interface GameState {
  currentLetter: string;
  nextLetter: string;
  currentLevel: number;
  score: number;
  highScore: number;
  timeRemaining: number;
  wordInput: string;
  isGameOver: boolean;
  gameOverReason?: GameOverCondition;
  gameOverMessage?: string;
  usedWords: Set<string>;
  bpm: number;
}

export type GameOverCondition = 'invalidWord' | 'tooShort' | 'repeatedWord' | 'noWordEntered';

export interface LevelConfig {
  pointsRange: [number, number];
  minWordLength: number;
  timeLimit: number;
  tempo: string;
  bpm: number;
}