import React from 'react';
import { BackgroundEffect } from './effects/BackgroundEffect';
import { LetterEffect } from './effects/LetterEffect';

interface LevelEffectsProps {
  level: number;
  children?: React.ReactNode;
}

export const LevelEffects: React.FC<LevelEffectsProps> = ({ level, children }) => {
  return (
    <>
      <BackgroundEffect level={level} />
      {children && <LetterEffect level={level}>{children}</LetterEffect>}
    </>
  );
};