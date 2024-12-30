import { createClient } from '@supabase/supabase-js';
import type { LeaderboardEntry, LeaderboardType } from '../types/leaderboard';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function checkHighScore(score: number) {
  console.log('checkHighScore called with score:', score);

  const { data, error } = await supabase
    .rpc('check_score_qualifies', { p_score: score });

  if (error) {
    console.error('Error checking high score:', error);
    return { qualifies_daily: false, qualifies_weekly: false, qualifies_alltime: false };
  }

  console.log('checkHighScore result data:', data);
  return data;
}

export async function submitHighScore(username: string, score: number) {
  console.log('submitHighScore called with username:', username, 'and score:', score);

  const { error } = await supabase
    .rpc('add_high_score', { 
      p_username: username, 
      p_score: score 
    });

  if (error) {
    console.error('Error submitting high score:', error);
    throw error;
  }

  console.log('submitHighScore successfully executed');
}

export async function fetchLeaderboard(type: LeaderboardType): Promise<LeaderboardEntry[]> {
  console.log('fetchLeaderboard called with type:', type);

  const { data, error } = await supabase
    .from(`${type}_leaderboard`)
    .select('username, score, created_at')
    .order('score', { ascending: false })
    .limit(10);

  if (error) {
    console.error(`Error fetching ${type} leaderboard:`, error);
    throw error;
  }

  console.log('fetchLeaderboard result data:', data);
  return data || [];
}
