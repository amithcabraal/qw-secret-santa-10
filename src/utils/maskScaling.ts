import { MaskPosition } from '../types/game';

interface ImageDimensions {
  width: number;
  height: number;
}

// Base size for the mask when image is at reference dimensions
const BASE_MASK_WIDTH = 150;

// Reference dimensions that the mask positions were originally set for
const REFERENCE_WIDTH = 600;
const REFERENCE_HEIGHT = 900;

export const calculateScaleFactor = (
  originalDimensions: ImageDimensions,
  displayDimensions: ImageDimensions
): number => {
  // Calculate how much the display size differs from reference size
  const referenceAspectRatio = REFERENCE_WIDTH / REFERENCE_HEIGHT;
  const displayAspectRatio = displayDimensions.width / displayDimensions.height;

  let scaleFactor;
  if (displayAspectRatio > referenceAspectRatio) {
    // Height constrained
    scaleFactor = displayDimensions.height / REFERENCE_HEIGHT;
  } else {
    // Width constrained
    scaleFactor = displayDimensions.width / REFERENCE_WIDTH;
  }

  // Apply a base scale adjustment to make masks generally larger
  return scaleFactor * 1.5;
};

export const scaleMaskPosition = (
  originalPosition: MaskPosition,
  originalDimensions: ImageDimensions,
  displayDimensions: ImageDimensions
): MaskPosition => {
  const scaleFactor = calculateScaleFactor(originalDimensions, displayDimensions);
  
  return {
    ...originalPosition,
    scale: originalPosition.scale * scaleFactor
  };
};

export const getImageDimensions = (imageUrl: string): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

export const calculateMaskSize = (
  containerWidth: number,
  containerHeight: number
): number => {
  // For thumbnails, use a simpler scaling based on container size
  const referenceSize = Math.min(REFERENCE_WIDTH, REFERENCE_HEIGHT);
  const containerSize = Math.min(containerWidth, containerHeight);
  const scaleFactor = containerSize / referenceSize;
  
  return BASE_MASK_WIDTH * scaleFactor * 1.5;
};