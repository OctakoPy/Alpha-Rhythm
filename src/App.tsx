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

const useKeyboardAwareLayout = () => {
  const [layout, setLayout] = useState({
    isKeyboardVisible: false,
    visibleHeight: window.innerHeight,
    keyboardHeight: 0
  });

  useEffect(() => {
    const handleViewportChange = () => {
      if (!window.visualViewport) return;

      // Get the visible height from visualViewport
      const visibleHeight = window.visualViewport.height;
      const isKeyboardVisible = window.innerHeight - visibleHeight > 100;

      // Prevent any scrolling
      document.body.style.height = `${visibleHeight}px`;
      document.body.style.overflow = 'hidden';

      // Update layout state
      setLayout({
        isKeyboardVisible,
        visibleHeight,
        keyboardHeight: window.innerHeight - visibleHeight
      });

      // Ensure viewport is at top
      window.scrollTo(0, 0);
    };

    // Initial setup
    handleViewportChange();

    // Add event listeners
    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('scroll', handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, []);

  return layout;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCover, setShowCover] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { isKeyboardVisible, visibleHeight } = useKeyboardAwareLayout();

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
      <div style={{ height: visibleHeight }} className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading assets...</h1>
        <Credits />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: visibleHeight }} className="flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">
          Sorry! AlphaRhythm is currently down!
        </h1>
        <Credits />
      </div>
    );
  }

  if (showCover) {
    return (
      <div style={{ height: visibleHeight }}>
        <CoverPage highScore={gameState.highScore} onStartGame={handleStartGame} />
        <Credits />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="bg-blue-500 relative flex flex-col overflow-hidden"
      style={{ 
        height: visibleHeight,
        transition: 'height 0.3s ease'
      }}
    >
      <LevelEffects level={currentLevel} />
      
      {gameState.showOctopusEffect && (
        <OctopusPowerup onComplete={handlePowerupComplete} />
      )}
      
      {/* Header section with dynamic spacing */}
      <div className={`
        ${isKeyboardVisible ? 'py-1' : 'py-4'}
        px-4 transition-all duration-300
      `}>
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <LevelDisplay level={currentLevel} />
          <GameHeader tempo={levelConfig.tempo} />
          <GameStats 
            score={gameState.score}
            highScore={gameState.highScore}
          />
        </div>
      </div>

      {/* Game Area with flexible spacing */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Current Letter Section with dynamic sizing */}
        <div className={`
          flex-1 flex items-center justify-center
          ${isKeyboardVisible ? 'scale-75' : 'scale-100'}
          transition-transform duration-300
        `}>
          <CurrentLetter 
            letter={gameState.currentLetter}
            nextLetter={gameState.nextLetter}
            level={currentLevel}
            minLength={levelConfig.minWordLength}
          />
        </div>

        {/* Controls Section */}
        <div className={`
          w-full max-w-2xl mx-auto px-4
          ${isKeyboardVisible ? 'space-y-2' : 'space-y-4'}
          transition-all duration-300
        `}>
          <ProgressBar
            timeRemaining={gameState.timeRemaining}
            totalTime={levelConfig.timeLimit}
          />
          
          <div className={`mb-${isKeyboardVisible ? '2' : '4'}`}>
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