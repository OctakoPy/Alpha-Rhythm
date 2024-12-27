import React from 'react';

interface VignetteEffectProps {
  pulseWithRhythm?: boolean;
}

export const VignetteEffect: React.FC<VignetteEffectProps> = ({ pulseWithRhythm }) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none
        bg-radial-vignette
        ${pulseWithRhythm ? 'animate-vignette-pulse' : ''}
      `}
      style={{
        background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
      }}
    />
  );
};