export interface MaskPosition {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  originalImageDimensions?: {
    width: number;
    height: number;
  };
}

export type GameMode = 'mask' | 'effects';

export interface GameImage {
  id: string;
  imageUrl: string;
  personName: string;
  maskPosition: MaskPosition;
  showMask?: boolean;
}

export interface GameState {
  images: GameImage[];
  currentImageIndex: number;
  currentImage: GameImage;
  isAdmin: boolean;
  isMenuOpen: boolean;
  showAnswer: boolean;
  selectedImageId: string | null;
  gameMode: GameMode;
  gameOrder: number[];
  
  initializeGameOrder: (seed: number) => void;
  setCurrentImageIndex: (index: number) => void;
  toggleMenu: () => void;
  toggleAdmin: () => void;
  toggleAnswer: () => void;
  setGameMode: (mode: GameMode) => void;
  updateMaskPosition: (position: MaskPosition) => void;
  addImage: (image: GameImage) => void;
  updateImage: (id: string, image: Partial<GameImage>) => void;
  deleteImage: (id: string) => void;
  importImages: (images: GameImage[]) => void;
  setSelectedImageId: (id: string | null) => void;
  toggleMask: (id: string) => void;
}