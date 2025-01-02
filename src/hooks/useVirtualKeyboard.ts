import { useState, useEffect } from 'react';

interface ViewportDimensions {
  viewportHeight: number;
  keyboardHeight: number;
  isKeyboardVisible: boolean;
}

export const useVirtualKeyboard = (): ViewportDimensions => {
  const [dimensions, setDimensions] = useState<ViewportDimensions>({
    viewportHeight: window.innerHeight,
    keyboardHeight: 0,
    isKeyboardVisible: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const newViewportHeight = window.innerHeight;
      const keyboardHeight = Math.max(0, dimensions.viewportHeight - newViewportHeight);
      
      setDimensions({
        viewportHeight: newViewportHeight,
        keyboardHeight,
        isKeyboardVisible: keyboardHeight > 100 // threshold to determine if keyboard is shown
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions.viewportHeight]);

  return dimensions;
};