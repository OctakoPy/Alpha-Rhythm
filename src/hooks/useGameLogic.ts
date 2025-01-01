import { useState, useCallback, useEffect } from 'react';
import { LEVELS, calculateMinWordLength } from '../config/levels';
import { validateDictionaryWord } from '../utils/dictionary';
import { calculateScore } from '../config/scoring';
import { getRandomLetter } from '../config/letters';
import { getGameOverMessage } from '../utils/gameMessages';
import { soundManager } from '../audio/SoundManager';
import type { GameState, GameOverCondition } from '../types/game';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface ExtendedGameState extends GameState {
  octopusPowerupActive: boolean;
  showOctopusEffect: boolean;
}

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<ExtendedGameState>({
    currentLetter: getRandomLetter(),
    nextLetter: getRandomLetter(),
    currentLevel: 1,
    score: 0,
    highScore: 0,
    timeRemaining: LEVELS[0].timeLimit,
    wordInput: '',
    isGameOver: false,
    usedWords: new Set(),
    bpm: LEVELS[0].bpm,
    octopusPowerupActive: false,
    showOctopusEffect: false,
  });

  useEffect(() => {
    return () => soundManager.stopAllMusic();
  }, []);

  const handleGameOver = useCallback((condition: GameOverCondition, level: number) => {
    const isNewHighScore = gameState.score > gameState.highScore;
    soundManager.playGameOver(isNewHighScore);
    
    setGameState((prev) => ({
      ...prev,
      isGameOver: true,
      gameOverReason: condition,
      gameOverMessage: getGameOverMessage(condition, level),
    }));
  }, [gameState.score, gameState.highScore]);

  const validateWord = useCallback(async (word: string) => {
    if (!word) {
      handleGameOver('noWordEntered', 1);
      return;
    }

    const currentLevel = LEVELS.findIndex(
      (level, index) => {
        const nextLevel = LEVELS[index + 1];
        if (!nextLevel) return true;
        return gameState.score >= level.pointsRange[0] && gameState.score < nextLevel.pointsRange[0];
      }
    ) + 1;

    if (!word.toLowerCase().startsWith(gameState.currentLetter.toLowerCase())) {
      handleGameOver('invalidWord', currentLevel);
      return;
    }

    const levelConfig = LEVELS[currentLevel - 1];
    const minWordLength = calculateMinWordLength(gameState.score, levelConfig.minWordLength);
    if (word.length < minWordLength) {
      handleGameOver('tooShort', currentLevel);
      return;
    }

    if (gameState.usedWords.has(word.toLowerCase())) {
      handleGameOver('repeatedWord', currentLevel);
      return;
    }

    const isValid = await validateDictionaryWord(word);
    if (!isValid) {
      handleGameOver('invalidWord', currentLevel);
      return;
    }

    const isDoubleLetter = gameState.currentLetter.length === 2;
    let points = calculateScore(word.length, currentLevel, isDoubleLetter);
    
    // Check for octopus activation
    const isOctopus = word.toLowerCase() === 'octopus';
    if (isOctopus && !gameState.octopusPowerupActive) {
      setGameState(prev => ({
        ...prev,
        showOctopusEffect: true,
        octopusPowerupActive: true,
      }));
    }

    // Apply octopus multiplier if active
    if (gameState.octopusPowerupActive) {
      points *= 2;
    }

    const newScore = gameState.score + points;

    const nextLevel = LEVELS.findIndex(
      (level, index) => {
        const nextLevelConfig = LEVELS[index + 1];
        if (!nextLevelConfig) return true;
        return newScore >= level.pointsRange[0] && newScore < nextLevelConfig.pointsRange[0];
      }
    ) + 1;

    if (nextLevel > currentLevel) {
      soundManager.playNextLevel();
      soundManager.startLevelMusic(nextLevel);
    }

    soundManager.playCorrect();
    
    setGameState((prev) => ({
      ...prev,
      currentLetter: prev.nextLetter,
      nextLetter: getRandomLetter(),
      score: newScore,
      usedWords: new Set([...prev.usedWords, word.toLowerCase()]),
      wordInput: '',
      timeRemaining: levelConfig.timeLimit,
    }));

  }, [gameState, handleGameOver]);

  const { isMobileKeyboard } = useDeviceDetection();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (isMobileKeyboard) {
        // Logic for virtual keyboard
        setGameState(prev => ({
          ...prev,
          wordInput: value,
        }));
      } else {
        // Logic for physical keyboard
        soundManager.playTyping();
        setGameState(prev => ({
          ...prev,
          wordInput: value,
        }));
      }
    },
    [isMobileKeyboard] // Ensure dependency is correct
  );

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateWord(gameState.wordInput);
    }
  }, [gameState.wordInput, validateWord]);

  const handlePowerupComplete = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showOctopusEffect: false,
    }));
  }, []);

  const restartGame = useCallback(() => {
    soundManager.stopAllMusic();
    soundManager.startLevelMusic(1);
  
    setGameState((prev) => {
      const newState: ExtendedGameState = {
        currentLetter: getRandomLetter(),
        nextLetter: getRandomLetter(),
        currentLevel: 1,
        score: 0,
        highScore: Math.max(prev.highScore, prev.score),
        timeRemaining: LEVELS[0].timeLimit,
        wordInput: '',
        isGameOver: false,
        usedWords: new Set<string>(),
        bpm: LEVELS[0].bpm,
        octopusPowerupActive: false,
        showOctopusEffect: false,
      };
  
  
      return newState;
    });
  }, []);

  useEffect(() => {
    if (gameState.isGameOver) return;

    const timer = setInterval(() => {
      setGameState((prev) => {

        if (prev.timeRemaining <= 0) {
          if (prev.wordInput.trim()) {
            validateWord(prev.wordInput);
            return prev;
          }
          
          clearInterval(timer);
          return {
            ...prev,
            isGameOver: true,
            gameOverReason: 'noWordEntered',
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 0.1,
        };
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState.isGameOver, validateWord]);

  return {
    gameState,
    setGameState,
    handleInputChange,
    handleKeyPress,
    restartGame,
    handlePowerupComplete,
  };
};