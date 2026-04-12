
import React, { useState } from 'react';

interface ProductPreviewProps {
  images: string[];
  onImageClick: (index: number) => void;
}

export const CardMarketplacePrevia: React.FC<ProductPreviewProps> = ({ images, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full relative group bg-black">
      <div 
        className="aspect-video w-full flex items-center justify-center cursor-pointer"
        onClick={() => onImageClick(currentIndex)}
      >
        <img 
          src={images[currentIndex]} 
          alt="Product main image" 
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        />
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={(e) => { e.stopPropagation(); goToPrevious(); }} 
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-black/70">
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); goToNext(); }} 
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-black/70">
        <i className="fa-solid fa-chevron-right"></i>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); goToImage(index); }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-[#00c2ff]' : 'bg-white/40 hover:bg-white/70'}`}>
          </button>
        ))}
      </div>
    </div>
  );
};
