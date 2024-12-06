import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="space-y-4">
          <p>
            This game stores image data locally in your browser's storage. We do not collect or transmit any personal information.
          </p>
          <h2 className="text-xl font-semibold mt-6">Data Storage</h2>
          <p>
            All game data, including images and settings, is stored locally on your device using browser localStorage.
            No data is sent to external servers.
          </p>
          <h2 className="text-xl font-semibold mt-6">Image Usage</h2>
          <p>
            Images added to the game should respect copyright and privacy rights.
            Please ensure you have the right to use any images you add to the game.
          </p>
        </div>
      </div>
    </div>
  );
};