import { useEffect, useState } from 'react';
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
import { loadDictionary } from './utils/dictionary'; // Import the dictionary loader
import type { GameOverCondition } from './types/game';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // New state for errors
  const [showCover, setShowCover] = useState(false);
  const {
    gameState,
    handleInputChange,
    handleKeyPress,
    restartGame,
  } = useGameLogic();

  const { currentLevel, config: levelConfig } = useLevel(gameState.score);

  // Load assets at the start
  useEffect(() => {
    const initializeGame = async () => {
      try {
        await loadDictionary();
        setLoading(false); // Assets are ready
        setShowCover(true); // Show cover page after loading
      } catch (error) {
        console.error('Failed to load assets:', error);
        setLoading(false); // Stop loading
        setError(true); // Set error state
      }
    };

    initializeGame();
  }, []);

  const handleStartGame = () => {
    setShowCover(false);
    restartGame();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading assets...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">
          Sorry! AlphaRhythm is currently down!
        </h1>
      </div>
    );
  }

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
          setShowCover={setShowCover}
        />
      )}
    </div>
  );
}
