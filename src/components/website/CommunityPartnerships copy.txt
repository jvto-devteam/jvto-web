import React from 'react';
import Link from "next/link";
import { communityPartnershipsCopy, communityPartners } from '@/constants';
import { CommunityPartner } from '@/types';

const PartnerCard: React.FC<{ partner: CommunityPartner }> = ({ partner }) => {
  const linkClassName = "mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-ink-neutral-400 dark:border-ink-neutral-600 text-ink-primary dark:text-white font-semibold hover:bg-ink-neutral-100 dark:hover:bg-ink-neutral-800 transition-colors";

  return (
    <div className="group flex flex-col rounded-2xl bg-white dark:bg-background-dark shadow-card hover:shadow-cardHover transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img 
          src={partner.imageUrl} 
          alt={partner.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute top-4 left-4 bg-primary/80 text-white p-2 rounded-full">
          <span className="material-symbols-outlined text-3xl">{partner.icon}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-ink-primary dark:text-white">{partner.title}</h3>
        <p className="mt-2 text-ink-neutral-700 dark:text-ink-neutral-300 flex-grow text-sm">{partner.description}</p>
        
        {partner.isExternal ? (
          <a href={partner.link} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              {partner.cta}
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
          </a>
        ) : (
          <Link href={partner.link} className={linkClassName}>
              {partner.cta}
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        )}
      </div>
    </div>
  );
};


const CommunityPartnerships: React.FC = () => {
  return (
    <section className="py-16 md:py-28 bg-background-light dark:bg-ink-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
          {/* Large Green Card */}
          <div className="lg:row-span-2 bg-ink-accentC text-ink-primary p-8 rounded-2xl flex flex-col items-center text-center justify-between shadow-card">
            <div>
              <img 
                src="https://java-tour.com/uploads/1763409312246-551246661-yellow_and_black_ilustrative_technology_mobile_prototype.png"
                alt="Community and local opportunity illustration"
                className="w-full rounded-lg mb-6 shadow-md"
              />
              <div className="inline-block bg-white/50 text-ink-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Community
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{communityPartnershipsCopy.title}</h2>
              <p className="leading-relaxed">{communityPartnershipsCopy.subhead}</p>
            </div>
            <Link href="/why-jvto/community-standards" className="group mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-ink-primary font-semibold hover:bg-ink-primary hover:text-white transition-colors">
              Our Impact
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>

          {/* Grid for Smaller Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {communityPartners.map(partner => (
              <PartnerCard key={partner.title} partner={partner} />
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default CommunityPartnerships;