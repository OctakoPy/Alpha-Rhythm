import React, { useState } from 'react';
import { LeaderboardTab } from './LeaderboardTab';
import { LeaderboardEntry } from './LeaderboardEntry';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import type { LeaderboardType } from '../../types/leaderboard';

export const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('daily');
  const { entries, loading, error } = useLeaderboard(activeTab);

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="flex gap-1 p-1 bg-gray-100">
        <LeaderboardTab
          type="daily"
          active={activeTab === 'daily'}
          onClick={() => setActiveTab('daily')}
        />
        <LeaderboardTab
          type="weekly"
          active={activeTab === 'weekly'}
          onClick={() => setActiveTab('weekly')}
        />
        <LeaderboardTab
          type="alltime"
          active={activeTab === 'alltime'}
          onClick={() => setActiveTab('alltime')}
        />
      </div>

      <div className="p-4">
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : error ? (
          <div className="h-[400px] flex items-center justify-center text-red-600">
            {error}
          </div>
        ) : entries.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            No scores yet. Be the first!
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <LeaderboardEntry
                key={`${entry.username}-${entry.created_at}`}
                entry={entry}
                rank={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};