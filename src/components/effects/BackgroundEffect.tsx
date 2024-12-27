import React from 'react';
import { ParticleEffect } from './ParticleEffect';
import { RippleEffect } from './RippleEffect';
import { VignetteEffect } from './VignetteEffect';
import { AuroraEffect } from './AuroraEffect';

interface BackgroundEffectProps {
  level: number;
}

export const BackgroundEffect: React.FC<BackgroundEffectProps> = ({ level }) => {
  const getBackgroundClass = () => {
    switch (level) {
      case 1:
        return 'bg-gradient-to-br from-blue-400 to-blue-600';
      case 2:
        return 'bg-gradient-to-br from-blue-500 to-purple-600';
      case 3:
        return 'bg-gradient-to-br from-purple-600 to-orange-500';
      case 4:
        return 'bg-gradient-to-br from-orange-500 to-red-500';
      case 5:
        return 'bg-gradient-to-br from-purple-600 to-pink-500';
      default:
        return 'bg-gradient-to-br from-indigo-600 to-purple-800';
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className={`absolute inset-0 transition-all duration-1000 ${getBackgroundClass()}`} />
      
      {level >= 1 && <RippleEffect intensity={level} />}
      {level >= 2 && <ParticleEffect type="corner" intensity={level} />}
      {level >= 3 && <ParticleEffect type="floating" intensity={level} />}
      {level >= 4 && <ParticleEffect type="stream" intensity={level} />}
      {level >= 5 && <VignetteEffect pulseWithRhythm />}
      {level >= 6 && <AuroraEffect />}
    </div>
  );
};