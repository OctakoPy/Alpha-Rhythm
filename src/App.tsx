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
import { OctopusPowerup } from './components/effects/OctopusPowerup';
import { useLevel } from './hooks/useLevel';
import { useGameLogic } from './hooks/useGameLogic';
import { useVirtualKeyboard } from './hooks/useVirtualKeyboard';
import { loadDictionary } from './utils/dictionary';
import type { GameOverCondition } from './types/game';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCover, setShowCover] = useState(false);

  const { isKeyboardVisible, viewportHeight, keyboardHeight } = useVirtualKeyboard();

  const {
    gameState,
    handleInputChange,
    handleKeyPress,
    restartGame,
    handlePowerupComplete
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

  const handleStartGame = () => {
    setShowCover(false);
    restartGame();
  };

  useEffect(() => {
    const preventScrolling = (e: TouchEvent) => {
      if (!showCover && !gameState.isGameOver) {
        e.preventDefault();
      }
    };

    const inputFocusHandler = () => {
      // Ensure the page is not scrolled when input is focused
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    };

    if (!showCover && !gameState.isGameOver) {
      // Disable scrolling during gameplay
      document.addEventListener('touchmove', preventScrolling, { passive: false });

      // Prevent scrolling on input focus
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        input.addEventListener('focus', inputFocusHandler);
      });

      return () => {
        // Cleanup event listeners on unmount
        document.removeEventListener('touchmove', preventScrolling);
        inputs.forEach(input => {
          input.removeEventListener('focus', inputFocusHandler);
        });
      };
    }
  }, [showCover, gameState.isGameOver]);

  const Credits = () => (
    <div
      className="transition-all duration-200 text-white/70 font-serif italic text-sm text-center absolute"
      style={{
        bottom: isKeyboardVisible ? `${keyboardHeight}px` : '1rem',
        right: '1rem',
      }}
    >
      <div>Created by Octako</div>
      <div>© 2024</div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center overflow-hidden">
        <h1 className="text-2xl font-bold">Loading assets...</h1>
        <Credits />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center overflow-hidden">
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
      </>
    );
  }

  return (
    <div className="min-h-screen bg-blue-500 relative overflow-hidden">
      {/* Fixed container for background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <LevelEffects level={currentLevel} />
        {gameState.showOctopusEffect && (
          <OctopusPowerup onComplete={handlePowerupComplete} />
        )}
      </div>

      {/* Main game container with keyboard-aware layout */}
      <div
        className="fixed inset-0"
        style={{
          height: isKeyboardVisible ? `${viewportHeight}px` : '100vh',
          overflow: 'hidden'
        }}
      >
        {/* Header section */}
        <div
          className={`absolute w-full px-4 transition-all duration-200 ${
            isKeyboardVisible ? 'top-2' : 'top-4'
          }`}
        >
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
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            height: isKeyboardVisible ? `${viewportHeight - keyboardHeight}px` : '100%',
            paddingTop: isKeyboardVisible ? '3rem' : '5rem',
            paddingBottom: isKeyboardVisible ? 'env(safe-area-inset-bottom)' : '1rem', // Dynamic padding for safe areas
            minHeight: '100vh', // Ensure the container fills the full height
            boxSizing: 'border-box', // Include padding in height calculations
          }}
          >
          {/* Current Letter Section */}
          <div
            className="flex-grow flex items-center justify-center"
            style={{
              transform: isKeyboardVisible ? 'scale(0.8)' : 'none',
              transition: 'transform 0.2s ease'
            }}
          >
            <CurrentLetter
              letter={gameState.currentLetter}
              nextLetter={gameState.nextLetter}
              level={currentLevel}
              minLength={levelConfig.minWordLength}
            />
          </div>

          {/* Controls Section */}
          {/* WordInput Section */}
          <div className="w-full max-w-2xl mx-auto px-4 space-y-2">
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
              style={{
                marginBottom: `calc(env(safe-area-inset-bottom) + 25px)`, // Increase the value for more space
                transform: 'translateY(-25px)', // Temporarily move it up for testing
                backgroundColor: '#f8f9fa', // Optional: Differentiate visually for testing
              }}
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

      </div>
    </div>
  );
}
