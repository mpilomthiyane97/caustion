import { useState } from 'react';
import ProductImage from './ProductImage';

interface ProductCarouselProps {
  images: string[];
  alt: string;
}

export default function ProductCarousel({ images, alt }: ProductCarouselProps) {
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const go = (e: React.MouseEvent, direction: -1 | 1) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev + direction + images.length) % images.length);
  };

  return (
    <div className="relative h-full w-full">
      <ProductImage
        src={images[index]}
        alt={alt}
        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
      />

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => go(e, -1)}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink shadow hover:bg-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => go(e, 1)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink shadow hover:bg-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((image, i) => (
              <span
                key={image}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-amber' : 'bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
