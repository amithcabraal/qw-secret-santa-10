import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const Share: React.FC = () => {
  const shareUrl = window.location.origin;
  const shareTitle = 'Secret Santa - Guess Who Game';
  const shareText = 'Try to guess who\'s behind the Santa mask in this fun guessing game!';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert('Game link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Share the Game</h1>
        <div className="space-y-6">
          <p className="text-lg">Share this fun guessing game with your friends and family!</p>
          
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleShare}
              className="flex items-center gap-2 text-lg px-8 py-3 animate-pulse hover:animate-none"
            >
              <Share2 size={24} />
              Share Game
            </Button>
            
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-xl">
              <p className="text-sm text-gray-400 mb-2">Game URL:</p>
              <code className="text-red-400 text-lg break-all">{shareUrl}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};