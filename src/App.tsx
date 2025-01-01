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
import { Credits } from './components/Credits';
import { OctopusPowerup } from './components/effects/OctopusPowerup';
import { useLevel } from './hooks/useLevel';
import { useGameLogic } from './hooks/useGameLogic';
import { loadDictionary } from './utils/dictionary';
import type { GameOverCondition } from './types/game';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  const {
    gameState,
    handleInputChange,
    handleKeyPress,
    restartGame,
    handlePowerupComplete,
  } = useGameLogic();

  const { currentLevel, config: levelConfig } = useLevel(gameState.score);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        await loadDictionary();
        setLoading(false);
        setShowCover(true);
      } catch (error) {
        console.error('Failed to load assets:', error);
        setLoading(false);
        setError(true);
      }
    };

    initializeGame();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight); // Adjust for virtual keyboard
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartGame = () => {
    setShowCover(false);
    restartGame();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading assets...</h1>
        <Credits />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">
          Sorry! AlphaRhythm is currently down!
        </h1>
        <Credits />
      </div>
    );
  }

  if (showCover) {
    return (
      <>
        <CoverPage highScore={gameState.highScore} onStartGame={handleStartGame} />
        <Credits />
      </>
    );
  }

  return (
    <div
      className="min-h-screen bg-blue-500 relative"
      style={{ height: `${viewportHeight}px` }} // Dynamically adjust height
    >
      <LevelEffects level={currentLevel} />

      {gameState.showOctopusEffect && (
        <OctopusPowerup onComplete={handlePowerupComplete} />
      )}

      {/* Header */}
      <div className="absolute top-4 w-full px-4">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <LevelDisplay level={currentLevel} />
          <GameHeader tempo={levelConfig.tempo} />
          <GameStats
            score={gameState.score}
            highScore={gameState.highScore}
          />
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 pt-20 pb-4 flex flex-col">
        {/* Current Letter Section */}
        <div className="flex-grow flex items-center justify-center md:transform md:-translate-y-12">
          <CurrentLetter
            letter={gameState.currentLetter}
            nextLetter={gameState.nextLetter}
            level={currentLevel}
            minLength={levelConfig.minWordLength}
          />
        </div>

        {/* Controls Section */}
        <div className="w-full max-w-2xl mx-auto px-4 space-y-4">
          <ProgressBar
            timeRemaining={gameState.timeRemaining}
            totalTime={levelConfig.timeLimit}
          />

          <WordInput
            value={gameState.wordInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={gameState.isGameOver}
            currentLetter={gameState.currentLetter}
          />
        </div>
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

      <Credits />
    </div>
  );
}
