import React, { useRef, useEffect, useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui/Button';
import { scaleMaskPosition, getImageDimensions } from '../../utils/maskScaling';

interface ThumbnailDimensions {
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

export const ImageGrid: React.FC = () => {
  const { images, deleteImage, selectedImageId, setSelectedImageId, toggleMask } = useGameStore();
  const [thumbnailDimensions, setThumbnailDimensions] = useState<Record<string, ThumbnailDimensions>>({});
  const thumbnailRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const loadImageDimensions = async () => {
      const dimensionsPromises = images.map(async (image) => {
        try {
          const dimensions = await getImageDimensions(image.imageUrl);
          return [image.id, dimensions] as const;
        } catch (error) {
          console.error(`Error loading dimensions for image ${image.id}:`, error);
          return null;
        }
      });

      const loadedDimensions = await Promise.all(dimensionsPromises);
      const newDimensions: Record<string, ThumbnailDimensions> = {};

      loadedDimensions.forEach((result) => {
        if (result) {
          const [id, dimensions] = result;
          const ref = thumbnailRefs.current[id];
          if (ref) {
            const { width, height } = ref.getBoundingClientRect();
            newDimensions[id] = {
              width,
              height,
              originalWidth: dimensions.width,
              originalHeight: dimensions.height
            };
          }
        }
      });

      setThumbnailDimensions(newDimensions);
    };

    loadImageDimensions();
  }, [images]);

  useEffect(() => {
    const updateThumbnailSizes = () => {
      const newDimensions: Record<string, ThumbnailDimensions> = {};
      Object.entries(thumbnailRefs.current).forEach(([id, ref]) => {
        if (ref && thumbnailDimensions[id]) {
          const { width, height } = ref.getBoundingClientRect();
          newDimensions[id] = {
            ...thumbnailDimensions[id],
            width,
            height
          };
        }
      });
      setThumbnailDimensions(newDimensions);
    };

    updateThumbnailSizes();
    window.addEventListener('resize', updateThumbnailSizes);
    return () => window.removeEventListener('resize', updateThumbnailSizes);
  }, [images.length]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteImage(id);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => {
        const dimensions = thumbnailDimensions[image.id];
        const scaledPosition = dimensions
          ? scaleMaskPosition(
              image.maskPosition,
              { width: dimensions.originalWidth, height: dimensions.originalHeight },
              { width: dimensions.width, height: dimensions.height }
            )
          : image.maskPosition;

        return (
          <div
            key={image.id}
            ref={(el) => thumbnailRefs.current[image.id] = el}
            className={`
              relative group cursor-pointer rounded-lg overflow-hidden
              ${selectedImageId === image.id ? 'ring-4 ring-red-500' : ''}
            `}
            onClick={() => setSelectedImageId(image.id)}
          >
            <div className="relative pt-[100%]">
              <img
                src={image.imageUrl}
                alt={image.personName}
                className="absolute inset-0 w-full h-full object-contain bg-gray-800"
              />
              {image.showMask && dimensions && (
                <img
                  src="/santa-mask.png"
                  alt="Santa Mask"
                  className="absolute pointer-events-none"
                  style={{
                    left: `${scaledPosition.x}%`,
                    top: `${scaledPosition.y}%`,
                    transform: `
                      translate(-50%, -50%)
                      scale(${scaledPosition.scale})
                      rotate(${scaledPosition.rotation}deg)
                    `,
                    width: '150px',
                    height: 'auto',
                  }}
                />
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold mb-2">{image.personName}</p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1 z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageId(image.id);
                    }}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMask(image.id);
                    }}
                  >
                    {image.showMask ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 z-20"
                    onClick={(e) => handleDelete(image.id, e)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};