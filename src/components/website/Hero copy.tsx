

import React from 'react';
import Link from "next/link";
import { HeroCopy } from '@/types';

interface HeroProps {
  heroCopy: HeroCopy;
  onCtaClick: (ctaId: string, ctaText: string, section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ heroCopy, onCtaClick }) => {
  const parts = heroCopy.title.split(/(Bromo & Ijen tours)/i);

  return (
    <section className="relative bg-ink-primary overflow-hidden h-[90vh] min-h-[700px] flex items-center">
      {/* Image Background */}
      <img
          src="https://res.klook.com/image/upload/w_1920,h_1080,c_fill,q_85/activities/weoylprwytpd0u8qks6z.webp"
          alt="Pemandangan Kawah Ijen dengan danau pirus dan asap belerang saat fajar"
          className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(to right, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 40%, rgba(15, 23, 42, 0) 70%)' }}
      ></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="flex">
          <div className="md:w-1/2 lg:w-7/12 text-center md:text-left">
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold tracking-tighter text-white animate-slide-in-up leading-tight max-w-[750px] mx-auto md:mx-0">
              {parts.length === 3 ? (
                <>
                  {parts[0]}
                  <span className="relative inline-block whitespace-nowrap">
                    <span className="absolute inset-x-[-0.2em] inset-y-[-0.2em] bg-scribble-green bg-cover bg-center bg-no-repeat"></span>
                    <span className="relative text-ink-primary">{parts[1]}</span>
                  </span>
                  {parts[2]}
                </>
              ) : (
                heroCopy.title
              )}
            </h1>
            
            {/* Subheadline */}
            <p className="mt-6 text-lg md:text-xl text-ink-neutral-200 animate-slide-in-up max-w-xl mx-auto md:mx-0" style={{ animationDelay: '100ms' }}>{heroCopy.subhead}</p>
            
            {/* Badges */}
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-white animate-fade-in" style={{ animationDelay: '200ms' }}>
                <span className="inline-flex items-center gap-1.5 font-semibold"><span className="material-symbols-outlined text-base text-yellow-400">star</span>5★ Public Reviews</span>
                <span className="inline-flex items-center gap-1.5 font-semibold"><span className="material-symbols-outlined text-base text-green-400">school</span>ISIC Official Partner</span>
            </div>
            
            {/* CTAs */}
            <div className="mt-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Link
                  href="/plan-my-trip"
                  onClick={() => onCtaClick('hero_plan_trip', heroCopy.ctaPrimary, 'hero')}
                  className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-primary text-white font-bold text-base transition-all duration-300 shadow-[0_4px_12px_rgba(255,106,61,0.3)] hover:bg-[#E65A2F] hover:shadow-[0_6px_16px_rgba(255,106,61,0.4)] hover:-translate-y-0.5 active:bg-[#CC4F29] active:translate-y-0 active:shadow-[0_2px_6px_rgba(255,106,61,0.3)]"
                >
                  {heroCopy.ctaPrimary}
                </Link>
                <Link
                  href="/tours"
                  onClick={() => onCtaClick('hero_see_all_tours', heroCopy.ctaSecondary, 'hero')}
                  className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/30 text-base transition-all duration-300 hover:bg-white/20 hover:border-white/50 active:bg-white/15 active:scale-[0.98]"
                >
                  {heroCopy.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;