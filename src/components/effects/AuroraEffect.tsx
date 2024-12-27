import React from 'react';

export const AuroraEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-transparent to-transparent">
        <div className="absolute inset-0 aurora-wave" />
        <div className="absolute inset-0 aurora-wave" style={{ animationDelay: '-2s' }} />
        <div className="absolute inset-0 aurora-wave" style={{ animationDelay: '-4s' }} />
      </div>
    </div>
  );
};