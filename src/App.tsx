import React from 'react';
import { ProgressBar } from './components/ProgressBar';
import { GameOver } from './components/GameOver';
import { LevelEffects } from './components/LevelEffects';
import { GameHeader } from './components/GameHeader';
import { GameStats } from './components/GameStats';
import { WordInput } from './components/WordInput';
import { CurrentLetter } from './components/CurrentLetter';
import { CoverPage } from './components/CoverPage';
import { LevelDisplay } from './components/LevelDisplay';
import { useLevel } from './hooks/useLevel';
import { useGameLogic } from './hooks/useGameLogic';
import type { GameOverCondition } from './types/game';

export default function App() {
  const [showCover, setShowCover] = React.useState(true);
  const {
    gameState,
    setGameState,
    handleInputChange,
    handleKeyPress,
    restartGame,
  } = useGameLogic();

  const { currentLevel, config: levelConfig } = useLevel(gameState.score);

  const handleStartGame = () => {
    setShowCover(false);
    restartGame();
  };

  if (showCover) {
    return <CoverPage highScore={gameState.highScore} onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen relative">
      <LevelEffects level={currentLevel} />
      
      {/* Header Layout */}
      <div className="absolute top-4 w-full px-4">
        <div className="flex justify-between items-center">
          <LevelDisplay level={currentLevel} />
          <GameHeader tempo={levelConfig.tempo} />
          <GameStats 
            score={gameState.score}
            highScore={gameState.highScore}
          />
        </div>
      </div>

      {/* Current Letter - Center of screen */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CurrentLetter 
          letter={gameState.currentLetter}
          nextLetter={gameState.nextLetter}
          level={currentLevel}
          minLength={levelConfig.minWordLength}
        />
      </div>

      {/* Progress Bar - Bottom third of screen */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-96">
        <ProgressBar
          timeRemaining={gameState.timeRemaining}
          totalTime={levelConfig.timeLimit}
        />
      </div>

      {/* Word Input - Bottom of screen */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-96">
        <WordInput
          value={gameState.wordInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={gameState.isGameOver}
          currentLetter={gameState.currentLetter}
        />
      </div>

      {gameState.isGameOver && (
        <GameOver
          score={gameState.score}
          highScore={gameState.highScore}
          level={currentLevel}
          attemptedWord={gameState.wordInput}
          condition={gameState.gameOverReason as GameOverCondition}
          onRestart={restartGame}
        />
      )}
    </div>
  );
}