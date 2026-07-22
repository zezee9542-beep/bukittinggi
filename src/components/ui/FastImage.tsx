import { useState, useEffect, type ImgHTMLAttributes } from 'react';

export interface FastImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
  aspectRatio?: string;
  fallbackSrc?: string;
  containerClassName?: string;
}

export function FastImage({
  src,
  alt,
  priority = false,
  aspectRatio,
  fallbackSrc,
  containerClassName = '',
  className = '',
  style,
  onLoad,
  onError,
  ...props
}: FastImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={{ aspectRatio: aspectRatio || style?.aspectRatio }}
    >
      {/* Shimmer skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-stone-800/30 via-stone-700/50 to-stone-800/30" />
      )}

      {/* Error fallback state */}
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center bg-stone-900/60 p-4 text-center text-xs text-amber-200/60">
          <span>{alt || 'Gambar tidak dapat dimuat'}</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={(e) => {
            setIsLoaded(true);
            if (onLoad) onLoad(e);
          }}
          onError={(e) => {
            if (fallbackSrc && currentSrc !== fallbackSrc) {
              setCurrentSrc(fallbackSrc);
            } else {
              setHasError(true);
            }
            if (onError) onError(e);
          }}
          className={`transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } ${className}`}
          style={style}
          {...props}
        />
      )}
    </div>
  );
}

export default FastImage;
