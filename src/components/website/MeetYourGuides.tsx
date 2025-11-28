import React from 'react';
import Link from "next/link";
import { guides } from '@/constants';
import { Guide } from '@/types';

const GuideCard: React.FC<{ guide: Guide }> = ({ guide }) => {
  const role = guide.specialties[0] || 'Team Member';
  return (
    <div className="group relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
      <img src={guide.imageUrl} alt={guide.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
        <h3 className="text-xl font-bold">{guide.name}</h3>
        <p className="text-sm opacity-90 mt-1">{role}</p>
        <div className="w-12 h-1 bg-primary mt-3"></div>
      </div>
    </div>
  );
};


const MeetYourGuides: React.FC = () => {
  return (
    <section className="relative py-16 md:py-28 bg-[#FDFBF9] dark:bg-background-dark overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 -left-48 w-96 h-96 bg-primary/5 dark:bg-white/5 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-ink-accentA/5 dark:bg-white/5 rounded-full opacity-50 blur-3xl"></div>
        
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Content Block */}
          <div className="text-center lg:text-left">
            <p className="font-semibold text-primary tracking-wider">|| OUR TEAM ||</p>
            <h2 className="text-3xl md:text-4xl font-bold text-ink-primary dark:text-white mt-4">Say Hello to Our Team</h2>
            <div className="flex justify-center lg:justify-start my-6">
                <svg width="88" height="10" viewBox="0 0 88 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 5L5.5 9.79902V0.200981L11 5L16.5 9.79902V0.200981L22 5L27.5 9.79902V0.200981L33 5L38.5 9.79902V0.200981L44 5L49.5 9.79902V0.200981L55 5L60.5 9.79902V0.200981L66 5L71.5 9.79902V0.200981L77 5L82.5 9.79902V0.200981L88 5" stroke="currentColor" strokeWidth="1.5" className="text-ink-neutral-300 dark:text-ink-neutral-600"/>
                </svg>
            </div>
            <p className="mt-4 text-ink-neutral-700 dark:text-ink-neutral-300 max-w-lg mx-auto lg:mx-0">
              Our guides are not just experts; they are local storytellers, safety professionals, and your personal connection to the culture of East Java. Meet the people who make your journey unforgettable.
            </p>
            <Link 
              href="/why-jvto/our-story"
              className="mt-8 group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ink-primary dark:bg-white text-white dark:text-ink-primary font-semibold hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              View All Members
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
          
          {/* Right Guide Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {guides.slice(0, 4).map((guide, index) => (
              <div
                key={guide.id}
                className={`transform transition-transform duration-500 ${index % 2 !== 0 ? 'translate-y-8' : ''}`}
              >
                <GuideCard guide={guide} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default MeetYourGuides;