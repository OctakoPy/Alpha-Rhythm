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
    handlePowerupComplete,
  } = useGameLogic();

  const { currentLevel, config: levelConfig } = useLevel(gameState.score);

  useEffect(() => {
    const disableScroll = () => {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.width = '100%';
      document.body.style.height = '100vh'; // Lock the body height to the full viewport height
    };

    const enableScroll = () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = ''; // Reset the height when scrolling is enabled again
    };

    if (!showCover && !gameState.isGameOver) {
      disableScroll(); // Disable scroll during gameplay
    } else {
      enableScroll(); // Enable scroll during cover or game over
    }

    return () => {
      enableScroll(); // Clean up and re-enable scroll when component unmounts or game ends
    };
  }, [showCover, gameState.isGameOver]);

  useEffect(() => {
    const handleResize = () => {
      if (isKeyboardVisible) {
        document.body.style.height = `${viewportHeight}px`; // Dynamically adjust body height based on viewport height
      } else {
        document.body.style.height = ''; // Reset height when keyboard isn't visible
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial call to set body height on mount
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isKeyboardVisible, viewportHeight]);

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
        <Credits />
      </>
    );
  }

  return (
    <div
      className="min-h-screen bg-blue-500 relative"
      style={{
        height: isKeyboardVisible ? `${viewportHeight}px` : '100vh',
        overflow: 'hidden',
      }}
    >
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
          overflow: 'hidden',
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
            <GameStats score={gameState.score} highScore={gameState.highScore} />
          </div>
        </div>

        {/* Game Area */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            height: isKeyboardVisible ? `${viewportHeight - keyboardHeight}px` : '100%',
            paddingTop: isKeyboardVisible ? '3rem' : '5rem',
            paddingBottom: isKeyboardVisible ? '0.5rem' : '1rem',
          }}
        >
          {/* Current Letter Section */}
          <div
            className="flex-grow flex items-center justify-center"
            style={{
              transform: isKeyboardVisible ? 'scale(0.8)' : 'none',
              transition: 'transform 0.2s ease',
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
