import React, { useEffect, useRef } from 'react';

interface LetterEffectProps {
  level: number;
  children: React.ReactNode;
}

export const LetterEffect: React.FC<LetterEffectProps> = ({ level, children }) => {
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = letterRef.current;
    if (!element) return;

    if (level >= 2) {
      element.addEventListener('animationend', () => {
        element.classList.remove('typing-spark');
      });
    }

    return () => {
      if (level >= 2) {
        element.removeEventListener('animationend', () => {
          element.classList.remove('typing-spark');
        });
      }
    };
  }, [level]);

  const getLetterClass = () => {
    switch (level) {
      case 1:
        return 'letter-glow';
      case 2:
        return 'letter-spark';
      case 3:
        return 'letter-trail';
      case 4:
        return 'letter-explode';
      case 5:
        return 'letter-lightning';
      default:
        return 'letter-shockwave';
    }
  };

  return (
    <div 
      ref={letterRef}
      className={`relative inline-block ${getLetterClass()}`}
      data-letter={children}
    >
      {children}
    </div>
  );
};