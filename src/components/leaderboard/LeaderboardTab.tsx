import React from 'react';
import type { LeaderboardType } from '../../types/leaderboard';

interface LeaderboardTabProps {
  type: LeaderboardType;
  active: boolean;
  onClick: () => void;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ type, active, onClick }) => {
  const getLabel = () => {
    switch (type) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'alltime': return 'All Time';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
        ${active 
          ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
      {getLabel()}
    </button>
  );
};