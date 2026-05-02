// FIX: Implemented the Gallery component to resolve the 'not a module' error in App.tsx.
import React from 'react';
import { SectionCopy } from '@/types';
import { galleryImages } from '@/data';

const Gallery: React.FC<{copy: SectionCopy}> = ({ copy }) => {
  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-ink-accentC to-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-white/80 font-semibold tracking-wide uppercase">{copy.overline}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-1 drop-shadow-lg">{copy.title}</h2>
          <p className="mt-2 text-white/90 max-w-2xl mx-auto">{copy.subhead}</p>
        </div>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {galleryImages.map((image) => (
            <div key={image.id} className="break-inside-avoid relative group overflow-hidden rounded-sm shadow-lg transform hover:scale-105 transition-transform duration-300">
              <img
                className="w-full h-auto block"
                src={image.src}
                alt={image.alt}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{image.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
