import { useEffect, useState } from "react";
import { ProgressBar } from "./components/ProgressBar";
import { GameOver } from "./components/GameOver";
import { LevelEffects } from "./components/LevelEffects";
import { GameHeader } from "./components/GameHeader";
import { GameStats } from "./components/GameStats";
import { WordInput } from "./components/WordInput";
import { CurrentLetter } from "./components/CurrentLetter";
import { CoverPage } from "./components/CoverPage";
import { LevelDisplay } from "./components/LevelDisplay";
import { Credits } from "./components/Credits";
import { OctopusPowerup } from "./components/effects/OctopusPowerup";
import { useLevel } from "./hooks/useLevel";
import { useGameLogic } from "./hooks/useGameLogic";
import { loadDictionary } from "./utils/dictionary";
import type { GameOverCondition } from "./types/game";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const {
    gameState,
    handleInputChange,
    handleKeyPress,
    restartGame,
    handlePowerupComplete,
  } = useGameLogic();

  const { currentLevel, config: levelConfig } = useLevel(gameState.score);

  useEffect(() => {
    const handleResize = () => {
      // Check if visualViewport is available before using it
      const visualViewport = window.visualViewport;
  
      // Check if the keyboard is visible by comparing viewport height
      const keyboardVisible =
        visualViewport &&
        window.innerHeight - visualViewport.height > 100;
  
      setIsKeyboardVisible(!!keyboardVisible); // Ensure it's always true or false
      setViewportHeight(
        keyboardVisible ? visualViewport.height : window.innerHeight
      );
    };
  
    handleResize(); // Initial setup
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }
    window.addEventListener("resize", handleResize);
  
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
      window.removeEventListener("resize", handleResize);
    };
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
        height: `${viewportHeight}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <LevelEffects level={currentLevel} />

      {gameState.showOctopusEffect && (
        <OctopusPowerup onComplete={handlePowerupComplete} />
      )}

      {/* Header */}
      <div
        className={`absolute top-4 w-full px-4 ${
          isKeyboardVisible ? "hidden" : ""
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

      {/* Main Game Area */}
      <div
        className="flex-grow flex flex-col justify-center items-center"
        style={{
          paddingTop: isKeyboardVisible ? "10px" : "20px",
          paddingBottom: isKeyboardVisible ? "10px" : "40px",
        }}
      >
        <CurrentLetter
          letter={gameState.currentLetter}
          nextLetter={gameState.nextLetter}
          level={currentLevel}
          minLength={levelConfig.minWordLength}
        />

        <div
          className="w-full max-w-2xl mx-auto px-4 space-y-4"
          style={{
            marginTop: isKeyboardVisible ? "0" : "20px",
          }}
        >
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
