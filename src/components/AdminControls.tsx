import React from 'react';
import { useGameStore } from '../store/gameStore';
import { GameImage } from '../types/game';
import { Button } from './ui/Button';

export const AdminControls: React.FC = () => {
  const { updateMaskPosition, addImage, currentImage } = useGameStore();

  const handlePositionChange = (property: keyof typeof currentImage.maskPosition, value: number) => {
    updateMaskPosition({
      ...currentImage.maskPosition,
      [property]: value,
    });
  };

  const handleAddImage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newImage: GameImage = {
      id: Date.now().toString(),
      imageUrl: formData.get('imageUrl') as string,
      personName: formData.get('personName') as string,
      maskPosition: { x: 50, y: 30, scale: 1, rotation: 0 },
    };
    addImage(newImage);
    e.currentTarget.reset();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-bold">Mask Controls</h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center">
                X Position:
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentImage.maskPosition.x}
                  onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                  className="ml-2"
                />
              </label>
              <label className="flex items-center">
                Y Position:
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentImage.maskPosition.y}
                  onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                  className="ml-2"
                />
              </label>
              <label className="flex items-center">
                Scale:
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={currentImage.maskPosition.scale}
                  onChange={(e) => handlePositionChange('scale', Number(e.target.value))}
                  className="ml-2"
                />
              </label>
              <label className="flex items-center">
                Rotation:
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={currentImage.maskPosition.rotation}
                  onChange={(e) => handlePositionChange('rotation', Number(e.target.value))}
                  className="ml-2"
                />
              </label>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold">Add New Image</h3>
            <form onSubmit={handleAddImage} className="space-y-2">
              <input
                type="url"
                name="imageUrl"
                placeholder="Image URL"
                required
                className="w-full p-1 border rounded"
              />
              <input
                type="text"
                name="personName"
                placeholder="Person's Name"
                required
                className="w-full p-1 border rounded"
              />
              <Button type="submit">
                Add Image
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};