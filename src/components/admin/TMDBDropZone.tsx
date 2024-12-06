import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { GameImage } from '../../types/game';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ImageIcon } from 'lucide-react';

export const TMDBDropZone: React.FC = () => {
  const { addImage } = useGameStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const extractTMDBData = async (url: string) => {
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      const html = data.contents;
      
      // Create a DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract the name and image URL
      const nameElement = doc.querySelector('h2.title');
      const imageElement = doc.querySelector('img.profile.w-full') as HTMLImageElement;
      
      if (!nameElement || !imageElement) {
        throw new Error('Could not find required elements on the page');
      }

      return {
        name: nameElement.textContent?.trim() || '',
        imageUrl: imageElement.src
      };
    } catch (error) {
      console.error('Error parsing TMDB page:', error);
      throw new Error('Failed to parse TMDB page');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsProcessing(true);

    try {
      const url = e.dataTransfer.getData('text');
      
      if (!url.includes('themoviedb.org')) {
        throw new Error('Please drag a URL from TMDB');
      }

      const { name, imageUrl } = await extractTMDBData(url);

      const newImage: GameImage = {
        id: Date.now().toString(),
        imageUrl,
        personName: name,
        maskPosition: { x: 50, y: 30, scale: 1, rotation: 0 },
        showMask: true
      };

      addImage(newImage);
    } catch (error) {
      console.error('Error processing drop:', error);
      alert(error instanceof Error ? error.message : 'Failed to process TMDB page');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center
        transition-colors duration-200 mb-6 min-h-[160px]
        flex items-center justify-center
        ${isDragging ? 'border-red-500 bg-red-500/10' : 'border-gray-700 hover:border-gray-600'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isProcessing ? (
        <div className="flex items-center justify-center gap-3">
          <LoadingSpinner />
          <span>Processing TMDB page...</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <ImageIcon size={32} className="text-gray-500" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Drag a TMDB profile URL here
            </p>
            <p className="text-sm text-gray-400">
              Drag and drop a URL from themoviedb.org to automatically import the person
            </p>
          </div>
        </div>
      )}
    </div>
  );
};