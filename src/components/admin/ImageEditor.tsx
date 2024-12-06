import React, { useState, useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui/Button';
import { GameImage } from '../../types/game';
import { getImageDimensions } from '../../utils/maskScaling';

export const ImageEditor: React.FC = () => {
  const { images, updateImage, selectedImageId, setSelectedImageId } = useGameStore();
  const [editForm, setEditForm] = useState<Partial<GameImage>>({});
  const [previewUrl, setPreviewUrl] = useState('');
  const imageRef = useRef<HTMLImageElement>(null);

  const selectedImage = images.find(img => img.id === selectedImageId);

  useEffect(() => {
    if (selectedImage) {
      setEditForm(selectedImage);
      setPreviewUrl(selectedImage.imageUrl);
    }
  }, [selectedImage]);

  const handleSave = async () => {
    if (selectedImage && editForm) {
      // Get the current image dimensions when saving mask position
      const dimensions = await getImageDimensions(editForm.imageUrl || selectedImage.imageUrl);
      
      const updatedForm = {
        ...editForm,
        maskPosition: {
          ...editForm.maskPosition!,
          originalImageDimensions: dimensions
        }
      };
      
      updateImage(selectedImage.id, updatedForm);
      setSelectedImageId(null);
    }
  };

  const handleUrlChange = (url: string) => {
    setEditForm({ ...editForm, imageUrl: url });
    setPreviewUrl(url);
  };

  const handlePositionChange = (property: keyof typeof selectedImage.maskPosition, value: number) => {
    if (!editForm.maskPosition) return;
    
    setEditForm({
      ...editForm,
      maskPosition: {
        ...editForm.maskPosition,
        [property]: value
      }
    });
  };

  if (!selectedImage) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Image</h2>
          <Button variant="icon" onClick={() => setSelectedImageId(null)}>
            <X size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={editForm.imageUrl || ''}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full p-2 rounded bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Person Name</label>
              <input
                type="text"
                value={editForm.personName || ''}
                onChange={(e) => setEditForm({ ...editForm, personName: e.target.value })}
                className="w-full p-2 rounded bg-gray-700"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">X Position</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editForm.maskPosition?.x || 0}
                  onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Y Position</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editForm.maskPosition?.y || 0}
                  onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Scale</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={editForm.maskPosition?.scale || 1}
                  onChange={(e) => handlePositionChange('scale', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rotation</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={editForm.maskPosition?.rotation || 0}
                  onChange={(e) => handlePositionChange('rotation', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full mt-6">
              <Save size={18} className="mr-2" />
              Save Changes
            </Button>
          </div>

          <div className="relative max-h-[70vh] flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                ref={imageRef}
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
              />
              <img
                src="/santa-mask.png"
                alt="Santa Mask"
                className="absolute pointer-events-none"
                style={{
                  left: `${editForm.maskPosition?.x}%`,
                  top: `${editForm.maskPosition?.y}%`,
                  transform: `
                    translate(-50%, -50%)
                    scale(${editForm.maskPosition?.scale})
                    rotate(${editForm.maskPosition?.rotation}deg)
                  `,
                  width: '150px',
                  height: 'auto',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};