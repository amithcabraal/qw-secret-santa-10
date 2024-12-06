import { useCallback, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const useImageNavigation = () => {
  const { images, currentImageIndex, setCurrentImageIndex } = useGameStore();
  const [isNavigating, setIsNavigating] = useState(false);

  const nextImage = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
    // Reset navigation state after a short delay
    setTimeout(() => setIsNavigating(false), 500);
  }, [currentImageIndex, images.length, isNavigating]);

  const previousImage = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    setCurrentImageIndex(
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    );
    // Reset navigation state after a short delay
    setTimeout(() => setIsNavigating(false), 500);
  }, [currentImageIndex, images.length, isNavigating]);

  return { nextImage, previousImage, isNavigating };
};