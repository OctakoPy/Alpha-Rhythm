import React, { useState, useEffect } from 'react';
import { GameOverCondition } from '../types/game';
import { gameOverMessages } from '../config/messages';
import { checkHighScore, submitHighScore } from '../utils/supabase';

interface GameOverProps {
  score: number;
  highScore: number;
  level: number;
  attemptedWord: string;
  condition: GameOverCondition;
  onRestart: () => void;
  setShowCover: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LeaderboardQualification {
  qualifies_daily: boolean;
  qualifies_weekly: boolean;
  qualifies_alltime: boolean;
}

export const GameOver: React.FC<GameOverProps> = ({
  score,
  highScore,
  level,
  attemptedWord,
  condition,
  onRestart,
  setShowCover,
}) => {
  const handleGoHome = () => {
    setShowCover(true);
  };

  const [leaderboardStatus, setLeaderboardStatus] = useState<LeaderboardQualification | null>(null);
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [message, setMessage] = useState(''); // Store the game-over message

  useEffect(() => {
    const checkLeaderboardQualification = async () => {
      console.log('Checking leaderboard qualification for score:', score);
      try {
        const qualificationStatus = await checkHighScore(score);
        console.log('Leaderboard qualification result:', qualificationStatus);
        const parsedStatus = Array.isArray(qualificationStatus) ? qualificationStatus[0] : qualificationStatus;
        setLeaderboardStatus(parsedStatus);
      } catch (error) {
        console.error('Error checking leaderboard qualification:', error);
        setError('Failed to check leaderboard qualification');
      }
    };

    checkLeaderboardQualification();

    // Generate and set the game-over message once on mount
    const messages =
      condition === 'invalidWord'
        ? gameOverMessages.invalidWord[Math.min(level, 6) as keyof typeof gameOverMessages.invalidWord]
        : condition === 'tooShort' && level >= 6
        ? gameOverMessages.invalidWord[6]
        : gameOverMessages[condition];
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [score, condition, level]);

  const qualifiesForLeaderboard =
    leaderboardStatus?.qualifies_daily ||
    leaderboardStatus?.qualifies_weekly ||
    leaderboardStatus?.qualifies_alltime;

  console.log('Rendering GameOver. qualifiesForLeaderboard:', qualifiesForLeaderboard);

  const handleSubmitScore = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await submitHighScore(username.trim() || 'anon', score);
      setSubmitSuccess(true);
      setShowNameInput(false);
    } catch (error) {
      console.error('Error submitting score:', error);
      setError('Failed to submit score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-4xl font-bold text-red-600 mb-4">Game Over</h2>
        <div className="space-y-4">
          <p className="text-2xl">Final Score: {score}</p>
          {score > highScore && <p className="text-xl text-green-600">New High Score!</p>}
          <p className="text-xl">Level Reached: {level}</p>
          {attemptedWord && (
            <p className="text-lg">
              {condition === 'invalidWord' && `Invalid word: ${attemptedWord}`}
              {condition === 'tooShort' && `Word too short: ${attemptedWord}`}
              {condition === 'repeatedWord' && `Already used: ${attemptedWord}`}
              {condition === 'noWordEntered' && 'No word entered'}
            </p>
          )}
          <p className="text-xl italic">{message}</p>

          {qualifiesForLeaderboard && !showNameInput && !submitSuccess && (
            <button
              onClick={() => setShowNameInput(true)}
              className="w-full py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Enter Your Name!
            </button>
          )}

          {showNameInput && !submitSuccess && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={20}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleSubmitScore}
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Score'}
              </button>
            </div>
          )}

          {submitSuccess && (
            <div className="text-green-600 text-xl font-semibold animate__animated animate__fadeIn">
              Done! Your score has been submitted.
            </div>
          )}

          <button
            onClick={onRestart}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>

          <button
            onClick={handleGoHome}
            className="w-full py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};
