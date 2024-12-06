import React from 'react';

export const HowToPlay: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">How to Play</h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Game Modes</h2>
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Santa Mask Mode</h3>
                <p className="text-gray-300">
                  The classic mode where a Santa mask covers the person's face. Try to guess who's behind the mask!
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Effects Mode</h3>
                <p className="text-gray-300">
                  A challenging mode where the image is flipped and colors are inverted. Test your recognition skills in this unique way!
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Game Rules</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Try to guess who's in the image based on the mode's effect</li>
              <li>Use the navigation arrows to move between images</li>
              <li>Click "Show Answer" to reveal who's in the image</li>
              <li>Challenge your friends to see who can guess the most correctly!</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Admin Mode</h2>
            <p>
              In admin mode, you can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Add new images to the game</li>
              <li>Position and scale the Santa mask</li>
              <li>Edit or remove existing images</li>
              <li>Import and export your image collection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};