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

// Custom hook to handle keyboard visibility
const useKeyboardVisibility = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Only run on mobile devices
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      const handleResize = () => {
        // Viewport height without keyboard
        const visualViewportHeight = window.visualViewport?.height || window.innerHeight;
        // If the viewport height is significantly less than window height, keyboard is likely visible
        const keyboardIsVisible = window.innerHeight - visualViewportHeight > 100;
        
        setIsKeyboardVisible(keyboardIsVisible);
        if (keyboardIsVisible) {
          setKeyboardHeight(window.innerHeight - visualViewportHeight);
        } else {
          setKeyboardHeight(0);
        }
      };

      // Listen to viewport changes
      window.visualViewport?.addEventListener('resize', handleResize);
      window.visualViewport?.addEventListener('scroll', handleResize);

      return () => {
        window.visualViewport?.removeEventListener('resize', handleResize);
        window.visualViewport?.removeEventListener('scroll', handleResize);
      };
    }
  }, []);

  return { keyboardHeight, isKeyboardVisible };
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCover, setShowCover] = useState(false);
  
  const { keyboardHeight, isKeyboardVisible } = useKeyboardVisibility();

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
      style={{
        height: isKeyboardVisible ? `calc(100vh - ${keyboardHeight}px)` : '100vh',
      }}
    >
      <LevelEffects level={currentLevel} />
      
      {gameState.showOctopusEffect && (
        <OctopusPowerup onComplete={handlePowerupComplete} />
      )}
      
      {/* Header - Adjust spacing when keyboard is visible */}
      <div className={`absolute top-${isKeyboardVisible ? '2' : '4'} w-full px-4`}>
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <LevelDisplay level={currentLevel} />
          <GameHeader tempo={levelConfig.tempo} />
          <GameStats 
            score={gameState.score}
            highScore={gameState.highScore}
          />
        </div>
      </div>

      {/* Game Area - Adjust spacing when keyboard is visible */}
      <div 
        className="absolute inset-0 flex flex-col"
        style={{
          paddingTop: isKeyboardVisible ? '3rem' : '5rem',
          paddingBottom: '1rem'
        }}
      >
        {/* Current Letter Section - Adjust vertical positioning */}
        <div 
          className={`flex-grow flex items-center justify-center ${
            isKeyboardVisible ? '' : 'md:transform md:-translate-y-12'
          }`}
        >
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