"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface DeferredImageProps {
  src: string;
  alt: string;
  sizes: string;
  quality?: number;
  className?: string;
  rootMargin?: string;
}

const DeferredImage: React.FC<DeferredImageProps> = ({
  src,
  alt,
  sizes,
  quality,
  className,
  rootMargin = "250px 0px",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin, shouldLoad]);

  return (
    <div ref={ref} className="absolute inset-0">
      {shouldLoad ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className={className}
        />
      ) : (
        <div className="absolute inset-0 bg-white/5" aria-hidden="true" />
      )}
    </div>
  );
};

export default DeferredImage;
