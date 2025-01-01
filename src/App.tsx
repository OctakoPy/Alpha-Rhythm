import { useEffect, useState, useRef } from 'react';
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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    gameState,
    handleInputChange,
    handleKeyPress,
    restartGame,
    handlePowerupComplete
  } = useGameLogic();

  const { currentLevel, config: levelConfig } = useLevel(gameState.score);

  // Handle keyboard visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Check if an input element is focused
      const isInputFocused = document.activeElement?.tagName === 'INPUT';
      setIsKeyboardVisible(isInputFocused);
      
      // Force a reflow after keyboard appears/disappears
      if (gameContainerRef.current) {
        gameContainerRef.current.style.height = '100vh';
        setTimeout(() => {
          if (gameContainerRef.current) {
            gameContainerRef.current.style.height = `${window.innerHeight}px`;
          }
        }, 50);
      }
    };

    window.addEventListener('resize', handleVisibilityChange);
    document.addEventListener('focusin', handleVisibilityChange);
    document.addEventListener('focusout', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleVisibilityChange);
      document.removeEventListener('focusin', handleVisibilityChange);
      document.removeEventListener('focusout', handleVisibilityChange);
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
      ref={gameContainerRef}
      className="relative flex flex-col bg-blue-500 touch-none"
      style={{
        height: '100vh',
        minHeight: '-webkit-fill-available'
      }}
    >
      <LevelEffects level={currentLevel} />
      
      {gameState.showOctopusEffect && (
        <OctopusPowerup onComplete={handlePowerupComplete} />
      )}
      
      {/* Header - Fixed size */}
      <div className="w-full px-2 py-2 bg-white/90 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <LevelDisplay level={currentLevel} />
          <GameHeader tempo={levelConfig.tempo} />
          <GameStats 
            score={gameState.score}
            highScore={gameState.highScore}
          />
        </div>
      </div>

      {/* Main game area - Flexible height */}
      <div className={`flex-1 flex flex-col justify-between ${isKeyboardVisible ? 'pt-2' : 'pt-8'}`}>
        {/* Current Letter Container - Adjusts position based on keyboard */}
        <div className={`flex-1 flex items-${isKeyboardVisible ? 'start' : 'center'} justify-center pb-4`}>
          <CurrentLetter 
            letter={gameState.currentLetter}
            nextLetter={gameState.nextLetter}
            level={currentLevel}
            minLength={levelConfig.minWordLength}
          />
        </div>

        {/* Bottom Controls - Fixed position */}
        <div className="w-full px-4 pb-4 space-y-3">
          <div className="w-full max-w-lg mx-auto">
            <ProgressBar
              timeRemaining={gameState.timeRemaining}
              totalTime={levelConfig.timeLimit}
            />
          </div>
          
          <div className="w-full max-w-lg mx-auto">
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