import { useState, useEffect } from 'react';

const ProductGallery = ({ images, externalActiveImage, onImageChange }) => {
  const [localActiveImage, setLocalActiveImage] = useState(images[0]);

  // If external active image is provided, use it. Otherwise, use local state.
  const activeImage = externalActiveImage !== undefined ? externalActiveImage : localActiveImage;

  // Sync local active image when images array changes, in case it's used locally
  useEffect(() => {
    setLocalActiveImage(images[0]);
  }, [images]);

  const handleImageClick = (img) => {
    if (onImageChange) {
      onImageChange(img);
    }
    setLocalActiveImage(img);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
        <img 
          src={activeImage} 
          alt="Product main" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => handleImageClick(img)}
            className={`flex-shrink-0 w-20 h-24 sm:w-24 sm:h-32 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-slate-900 shadow-md' : 'border-transparent hover:border-slate-300'}`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
