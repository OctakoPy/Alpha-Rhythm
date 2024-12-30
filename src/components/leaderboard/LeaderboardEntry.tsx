import React from 'react';
import { Trophy } from 'lucide-react';
import type { LeaderboardEntry as LeaderboardEntryType } from '../../types/leaderboard';

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType;
  rank: number;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ entry, rank }) => {
  const getTrophyColor = () => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className={`flex items-center gap-4 p-3 ${rank <= 3 ? 'bg-blue-50' : ''}`}>
      <div className="flex items-center gap-2 w-12">
        <span className="text-gray-600 font-medium">{rank}</span>
        {rank <= 3 && <Trophy size={16} className={getTrophyColor()} />}
      </div>
      <div className="flex-1 font-medium">{entry.username}</div>
      <div className="text-right font-bold text-blue-600">{entry.score.toLocaleString()}</div>
    </div>
  );
};