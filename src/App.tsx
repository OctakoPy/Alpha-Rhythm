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
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight); // Dynamically track the viewport height

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
        console.error("Failed to load assets:", error);
        setLoading(false);
        setError(true);
      }
    };

    initializeGame();
  }, []);

  // Adjust viewport height dynamically when the keyboard appears
  useEffect(() => {
    const handleViewportResize = () => {
      setViewportHeight(window.visualViewport?.height || window.innerHeight);
    };

    window.visualViewport?.addEventListener("resize", handleViewportResize);
    window.addEventListener("resize", handleViewportResize); // Fallback for non-visualViewport browsers

    return () => {
      window.visualViewport?.removeEventListener("resize", handleViewportResize);
      window.removeEventListener("resize", handleViewportResize);
    };
  }, []);

  const handleStartGame = () => {
    setShowCover(false);
    restartGame();
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Loading assets...</h1>
        <Credits />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "red" }}>
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
      style={{
        height: `${viewportHeight}px`, // Dynamically adjust the container height
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#3b82f6", // Example blue background
        position: "relative",
      }}
    >
      <LevelEffects level={currentLevel} />

      {gameState.showOctopusEffect && (
        <OctopusPowerup onComplete={handlePowerupComplete} />
      )}

      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "rgba(0, 0, 0, 0.1)", // Optional sticky background
        }}
      >
        <LevelDisplay level={currentLevel} />
        <GameHeader tempo={levelConfig.tempo} />
        <GameStats score={gameState.score} highScore={gameState.highScore} />
      </div>

      {/* Game Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <CurrentLetter
          letter={gameState.currentLetter}
          nextLetter={gameState.nextLetter}
          level={currentLevel}
          minLength={levelConfig.minWordLength}
        />

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
