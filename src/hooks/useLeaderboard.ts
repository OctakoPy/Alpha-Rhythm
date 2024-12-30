import { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../utils/supabase';
import type { LeaderboardEntry, LeaderboardType } from '../types/leaderboard';

export const useLeaderboard = (type: LeaderboardType) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await fetchLeaderboard(type);
        setEntries(data);
        setError(null);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error('Leaderboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
    
    // Refresh daily leaderboard every minute
    if (type === 'daily') {
      const interval = setInterval(loadLeaderboard, 60000);
      return () => clearInterval(interval);
    }
  }, [type]);

  return { entries, loading, error };
};