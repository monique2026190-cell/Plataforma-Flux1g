
import React, { useState, useEffect } from 'react';

interface ZoomPreviaProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

export const CardZoomPrevia: React.FC<ZoomPreviaProps> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentIndex + 1) % images.length;
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      new Image().src = images[nextIndex];
      new Image().src = images[prevIndex];
    }
  }, [currentIndex, images]);

  const changeImage = (newIndex: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 200);
  };

  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    changeImage(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    changeImage(newIndex);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/70 text-4xl z-50 hover:text-white transition-colors bg-black/40 rounded-full w-14 h-14 flex items-center justify-center"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      <div className="w-full h-full flex items-center justify-center">
        {images.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-5 text-white/70 text-3xl p-4 rounded-full bg-black/40 hover:bg-black/60 hover:text-white transition-all z-20"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`Visualização ampliada do produto ${currentIndex + 1}`}
            className={`max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-5 text-white/70 text-3xl p-4 rounded-full bg-black/40 hover:bg-black/60 hover:text-white transition-all z-20"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-5 text-white/80 bg-black/40 px-3 py-1 rounded-lg text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};
