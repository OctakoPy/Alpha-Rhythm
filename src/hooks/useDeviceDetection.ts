import { useState, useEffect } from 'react';

export const useDeviceDetection = () => {
  const [isMobileKeyboard, setIsMobileKeyboard] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // Check if device is mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      // Check if virtual keyboard might be present
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobileKeyboard(isMobile && hasTouch);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobileKeyboard };
};