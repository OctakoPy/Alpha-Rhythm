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
  // Add state to track viewport height for mobile
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  const {
    gameState,
    handleInputChange,
    handleKeyPress,
    restartGame,
    handlePowerupComplete
  } = useGameLogic();

  const { currentLevel, config: levelConfig } = useLevel(gameState.score);

  // Handle viewport height changes (e.g., when virtual keyboard appears)
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    // Add event listener for iOS virtual keyboard
    window.addEventListener('focusin', handleResize);
    window.addEventListener('focusout', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focusin', handleResize);
      window.removeEventListener('focusout', handleResize);
    };
  }, []);

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
      className="relative flex flex-col items-center justify-between overflow-hidden"
      style={{ height: `${viewportHeight}px` }}
    >
      <LevelEffects level={currentLevel} />
      
      {gameState.showOctopusEffect && (
        <OctopusPowerup onComplete={handlePowerupComplete} />
      )}
      
      {/* Header Layout - Compact on mobile */}
      <div className="w-full px-2 sm:px-4 pt-2 sm:pt-4">
        <div className="flex justify-between items-center">
          <LevelDisplay level={currentLevel} />
          <GameHeader tempo={levelConfig.tempo} />
          <GameStats 
            score={gameState.score}
            highScore={gameState.highScore}
          />
        </div>
      </div>

      {/* Game Content Container - Flexbox for dynamic spacing */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 relative">
        {/* Current Letter - Responsive positioning */}
        <div className="transform -translate-y-1/4 sm:-translate-y-1/2">
          <CurrentLetter 
            letter={gameState.currentLetter}
            nextLetter={gameState.nextLetter}
            level={currentLevel}
            minLength={levelConfig.minWordLength}
          />
        </div>

        {/* Bottom Game Controls - Adjust based on viewport height */}
        <div className="absolute bottom-0 w-full flex flex-col items-center space-y-4 pb-4">
          <div className="w-full max-w-sm sm:max-w-lg px-2">
            <ProgressBar
              timeRemaining={gameState.timeRemaining}
              totalTime={levelConfig.timeLimit}
            />
          </div>
          
          <div className="w-full max-w-sm sm:max-w-lg px-2">
            <WordInput
              value={gameState.wordInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={gameState.isGameOver}
              currentLetter={gameState.currentLetter}
            />
          </div>
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