import React from 'react';
import { Play, Info } from 'lucide-react';

interface CoverPageProps {
  highScore: number;
  onStartGame: () => void;
}

export const CoverPage: React.FC<CoverPageProps> = ({ highScore, onStartGame }) => {
  const [showInstructions, setShowInstructions] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Alphabet Rhythm
          </h1>
          
          <div className="mb-8">
            <p className="text-2xl font-semibold text-gray-700">High Score: {highScore}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onStartGame}
              className="w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
            >
              <Play size={24} />
              Start Game
            </button>

            <button
              onClick={() => setShowInstructions(true)}
              className="w-full py-4 px-8 bg-white text-gray-700 border-2 border-gray-200 rounded-lg text-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Info size={24} />
              How to Play
            </button>
          </div>
        </div>

        {showInstructions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
              <h2 className="text-3xl font-bold mb-4">How to Play</h2>
              <div className="space-y-3 text-gray-700 mb-6">
                <p>• Type words that start with the shown letter</p>
                <p>• Each word must be unique - no repeats!</p>
                <p>• Longer words give more points</p>
                <p>• As you level up:</p>
                <ul className="list-disc pl-8">
                  <li>Required word length increases</li>
                  <li>Time limit decreases</li>
                  <li>Music gets faster</li>
                </ul>
                <p>• Beat your high score!</p>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};