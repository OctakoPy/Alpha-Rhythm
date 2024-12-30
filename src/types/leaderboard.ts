export interface LeaderboardEntry {
  username: string;
  score: number;
  created_at: string;
}

export type LeaderboardType = 'daily' | 'weekly' | 'alltime';