import { useState } from 'react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="h-full w-full flex items-center justify-center text-ink/30 text-sm">
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
