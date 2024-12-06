import { create } from 'zustand';
import { GameState, GameImage, MaskPosition, GameMode } from '../types/game';
import { loadImagesFromStorage, saveImagesToStorage } from '../services/gameData';
import { SeededRandom } from '../utils/seededShuffle';
import initialData from '../data/initialGameData.json';

const getInitialImages = (): GameImage[] => {
  const storedImages = loadImagesFromStorage();
  return storedImages.length > 0 ? storedImages : initialData.images;
};

const initialImages = getInitialImages();

export const useGameStore = create<GameState>((set) => ({
  images: initialImages,
  currentImageIndex: 0,
  isAdmin: false,
  isMenuOpen: false,
  showAnswer: false,
  selectedImageId: null,
  gameMode: 'mask',
  gameOrder: Array.from({ length: initialImages.length }, (_, i) => i),
  
  currentImage: initialImages[0] || initialData.images[0],
  
  initializeGameOrder: (seed: number) => set((state) => {
    const seededRandom = new SeededRandom(seed);
    const shuffledIndices = seededRandom.shuffle(
      Array.from({ length: state.images.length }, (_, i) => i)
    );
    return {
      gameOrder: shuffledIndices,
      currentImageIndex: 0,
      currentImage: state.images[shuffledIndices[0]]
    };
  }),

  setCurrentImageIndex: (index: number) => 
    set((state) => ({
      currentImageIndex: index,
      currentImage: state.images[state.gameOrder[index]],
      showAnswer: false
    })),
    
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleAdmin: () => set((state) => ({ isAdmin: !state.isAdmin })),
  toggleAnswer: () => set((state) => ({ showAnswer: !state.showAnswer })),
  setGameMode: (mode: GameMode) => set(() => ({ gameMode: mode })),
  
  updateMaskPosition: (position: MaskPosition) => set((state) => {
    const newImages = state.images.map((img, idx) =>
      idx === state.gameOrder[state.currentImageIndex]
        ? { ...img, maskPosition: position }
        : img
    );
    saveImagesToStorage(newImages);
    return {
      images: newImages,
      currentImage: {
        ...state.currentImage,
        maskPosition: position
      }
    };
  }),
  
  addImage: (image: GameImage) => set((state) => {
    const newImages = [...state.images, { ...image, showMask: true }];
    saveImagesToStorage(newImages);
    return { 
      images: newImages,
      gameOrder: [...state.gameOrder, newImages.length - 1]
    };
  }),

  updateImage: (id: string, updates: Partial<GameImage>) => set((state) => {
    const newImages = state.images.map(img =>
      img.id === id ? { ...img, ...updates } : img
    );
    saveImagesToStorage(newImages);
    return {
      images: newImages,
      currentImage: state.currentImage.id === id 
        ? { ...state.currentImage, ...updates }
        : state.currentImage,
      selectedImageId: null
    };
  }),

  deleteImage: (id: string) => set((state) => {
    const deletedIndex = state.images.findIndex(img => img.id === id);
    const newImages = state.images.filter(img => img.id !== id);
    const newGameOrder = state.gameOrder
      .filter(index => index !== deletedIndex)
      .map(index => index > deletedIndex ? index - 1 : index);
    
    saveImagesToStorage(newImages);
    return {
      images: newImages,
      gameOrder: newGameOrder,
      currentImageIndex: 0,
      currentImage: newImages[newGameOrder[0]] || initialData.images[0],
      selectedImageId: null
    };
  }),

  importImages: (newImages: GameImage[]) => set(() => {
    const imagesWithMask = newImages.map(img => ({ ...img, showMask: true }));
    saveImagesToStorage(imagesWithMask);
    return {
      images: imagesWithMask,
      gameOrder: Array.from({ length: imagesWithMask.length }, (_, i) => i),
      currentImageIndex: 0,
      currentImage: imagesWithMask[0]
    };
  }),

  setSelectedImageId: (id: string | null) => set(() => ({
    selectedImageId: id
  })),

  toggleMask: (id: string) => set((state) => {
    const newImages = state.images.map(img =>
      img.id === id ? { ...img, showMask: !img.showMask } : img
    );
    saveImagesToStorage(newImages);
    return {
      images: newImages,
      currentImage: state.currentImage.id === id
        ? { ...state.currentImage, showMask: !state.currentImage.showMask }
        : state.currentImage
    };
  })
}));