import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { scaleMaskPosition, getImageDimensions } from '../../utils/maskScaling';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const ImageDisplay: React.FC = () => {
  const { currentImage, showAnswer, gameMode } = useGameStore();
  const [maskLoaded, setMaskLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [displayDimensions, setDisplayDimensions] = useState<{ width: number; height: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setImageLoaded(false);
    if (gameMode === 'mask') {
      setMaskLoaded(false);
    }
  }, [currentImage.id, gameMode]);

  useEffect(() => {
    const loadOriginalDimensions = async () => {
      try {
        const dimensions = await getImageDimensions(currentImage.imageUrl);
        setOriginalDimensions(dimensions);
      } catch (error) {
        console.error('Error loading image dimensions:', error);
      }
    };
    loadOriginalDimensions();
  }, [currentImage.imageUrl]);

  useEffect(() => {
    const updateDisplayDimensions = () => {
      if (imageRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();
        
        setDisplayDimensions({
          width: imageRect.width,
          height: imageRect.height
        });
      }
    };

    if (imageLoaded) {
      updateDisplayDimensions();
      window.addEventListener('resize', updateDisplayDimensions);
      return () => window.removeEventListener('resize', updateDisplayDimensions);
    }
  }, [imageLoaded]);

  useEffect(() => {
    if (imageLoaded && (gameMode === 'effects' || maskLoaded)) {
      setIsLoading(false);
    }
  }, [imageLoaded, maskLoaded, gameMode]);

  // Handle reveal animation for effects mode
  useEffect(() => {
    if (gameMode === 'effects') {
      if (showAnswer) {
        // Start flip animation
        setIsFlipping(true);
        setIsRevealing(false);
        
        // After flip completes, pause, then start color reveal
        setTimeout(() => {
          setIsFlipping(false);
          setTimeout(() => {
            setIsRevealing(true);
          }, 500); // 0.5s pause
        }, 500); // 0.5s flip duration
      } else {
        setIsFlipping(false);
        setIsRevealing(false);
      }
    }
  }, [showAnswer, gameMode]);

  const scaledMaskPosition = originalDimensions && displayDimensions
    ? scaleMaskPosition(
        currentImage.maskPosition,
        originalDimensions,
        displayDimensions
      )
    : currentImage.maskPosition;

  const getImageStyle = () => {
    if (gameMode === 'effects') {
      const styles: React.CSSProperties = {
        transition: isRevealing 
          ? 'filter 2s ease-in-out, transform 0.5s ease-in-out' 
          : 'transform 0.5s ease-in-out',
      };

      if (isFlipping) {
        styles.transform = 'scaleX(0)';
        styles.filter = 'invert(1)';
      } else if (!showAnswer || !isRevealing) {
        styles.filter = 'invert(1)';
        styles.transform = 'scaleX(-1)';
      } else if (isRevealing) {
        styles.transform = 'scaleX(1)';
        styles.filter = 'invert(0)';
      }

      return styles;
    }
    return {
      transition: 'all 0.3s ease-in-out'
    };
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleMaskLoad = () => {
    setMaskLoaded(true);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
      <div 
        ref={containerRef}
        className="relative w-full"
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      >
        <div className="relative max-h-[80vh] flex items-center justify-center bg-gray-900">
          <img
            ref={imageRef}
            src={currentImage.imageUrl}
            alt="Person"
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
            style={getImageStyle()}
            onLoad={handleImageLoad}
          />
          
          {gameMode === 'mask' && !showAnswer && (
            <img
              src="/santa-mask.png"
              alt="Santa Mask"
              className="absolute pointer-events-none"
              style={{
                left: `${scaledMaskPosition.x}%`,
                top: `${scaledMaskPosition.y}%`,
                transform: `
                  translate(-50%, -50%)
                  scale(${scaledMaskPosition.scale})
                  rotate(${scaledMaskPosition.rotation}deg)
                `,
                width: '150px',
                height: 'auto',
              }}
              onLoad={handleMaskLoad}
            />
          )}
        </div>
      </div>
      
      {isLoading && <LoadingSpinner />}
    </div>
  );
};