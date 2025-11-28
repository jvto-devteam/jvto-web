import React, { useRef, useMemo, useState } from 'react';
import Link from "next/link";
import { TourPackage } from '@/types';
import { tourPackages } from '@/data';
import TourCard from './TourCard';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
            isActive
                ? 'bg-primary text-white shadow-sm'
                : 'bg-transparent text-ink-neutral-700 dark:text-ink-neutral-200 hover:bg-white dark:hover:bg-ink-neutral-700/50'
        }`}
    >
        {label}
    </button>
);

const TourCarouselRow = React.forwardRef<HTMLElement, { title: string; tours: TourPackage[] }>(
    ({ title, tours }, ref) => {
        const scrollContainerRef = useRef<HTMLDivElement>(null);

        const scroll = (direction: 'left' | 'right') => {
            if (scrollContainerRef.current) {
                const scrollAmount = scrollContainerRef.current.offsetWidth * 0.9;
                scrollContainerRef.current.scrollBy({
                    left: direction === 'left' ? -scrollAmount : scrollAmount,
                    behavior: 'smooth',
                });
            }
        };

        if (tours.length === 0) return null;

        return (
            <section ref={ref} className="py-8 scroll-mt-24">
                <header className="mb-8 md:flex md:items-center md:justify-between">
                    <h3 className="text-2xl font-bold text-ink-primary dark:text-white">{title}</h3>
                    <div className="hidden md:flex items-center gap-2 mt-4 md:mt-0">
                        <button
                            aria-label={`Scroll ${title} left`}
                            onClick={() => scroll('left')}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-background-dark shadow-md hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <button
                            aria-label={`Scroll ${title} right`}
                            onClick={() => scroll('right')}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-background-dark shadow-md hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </header>
                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-4 scroll-snap-x snap-mandatory scrollbar-hide"
                    >
                        {tours.map(tour => (
                            <div key={tour.id} className="snap-start flex-shrink-0 w-80 md:w-[24rem]">
                                 <TourCard tour={tour} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }
);
TourCarouselRow.displayName = "TourCarouselRow";

const EnhancedTourSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState('surabaya');
    const surabayaRef = useRef<HTMLElement>(null);
    const baliRef = useRef<HTMLElement>(null);

    const surabayaTours = useMemo(() => tourPackages.filter(t => t.originCity.toLowerCase() === 'surabaya'), []);
    const baliTours = useMemo(() => tourPackages.filter(t => t.originCity.toLowerCase() === 'bali'), []);

    const handleTabClick = (origin: 'surabaya' | 'bali') => {
        setActiveTab(origin);
        const ref = origin === 'surabaya' ? surabayaRef : baliRef;
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };
    
    return (
        <section className="py-16 md:py-28 bg-background-light dark:bg-background-dark">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-12 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-ink-primary dark:text-white">Start Your Private Route</h2>
                    <p className="mt-2 text-ink-neutral-500 dark:text-ink-neutral-300">
                        Choose where you start. We handle the rest — private vehicle, drivers, Bromo jeep, Ijen health screening, selected meals, permits, and logistics. No shared groups. No last-minute add-ons.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
                        <div className="flex items-center gap-1 p-1 bg-ink-neutral-100 dark:bg-background-dark rounded-full shadow-inner">
                            <TabButton label="From Surabaya" isActive={activeTab === 'surabaya'} onClick={() => handleTabClick('surabaya')} />
                            <TabButton label="From Bali" isActive={activeTab === 'bali'} onClick={() => handleTabClick('bali')} />
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto">
                    <TourCarouselRow ref={surabayaRef} title="Tours from Surabaya" tours={surabayaTours} />
                    <TourCarouselRow ref={baliRef} title="Tours from Bali" tours={baliTours} />

                    <div className="mt-12 text-center">
                        <Link href="/tours" className="inline-block px-6 py-2 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors">
                            View All Tours
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EnhancedTourSection;