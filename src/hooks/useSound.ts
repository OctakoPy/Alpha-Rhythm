import { useCallback } from 'react';

const sounds = {
  typing: new Audio('/sounds/typing.mp3'),
  warning: new Audio('/sounds/warning.mp3'),
  celebration: new Audio('/sounds/celebration.mp3'),
};

// Preload sounds
Object.values(sounds).forEach(sound => {
  sound.load();
  sound.volume = 0.3; // Set default volume
});

export const useSound = () => {
  const playTyping = useCallback(() => {
    sounds.typing.currentTime = 0;
    sounds.typing.play();
  }, []);

  const playWarning = useCallback(() => {
    sounds.warning.currentTime = 0;
    sounds.warning.play();
  }, []);

  const playCelebration = useCallback(() => {
    sounds.celebration.currentTime = 0;
    sounds.celebration.play();
  }, []);

  return {
    playTyping,
    playWarning,
    playCelebration,
  };
};