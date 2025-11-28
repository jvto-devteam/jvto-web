import React, { useMemo } from 'react';
import { useParams } from "next/navigation";
import Link from "next/link";
import TourCard from './TourCard';
import Breadcrumbs from './Breadcrumbs';
import { tourPackages } from '@/data';
import { TourPackage } from '@/types';
import SEO from './SEO';

const TourCategoryPage: React.FC = () => {
    const { city, type } = useParams<{ city?: string; type?: string }>();

    const { filteredTours, title, description, intro, toursByDuration } = useMemo(() => {
        let filtered: TourPackage[] = [];
        let pageTitle = 'All Tours';
        let pageDescription = 'Browse our hand-picked selection of tours.';
        let introText = 'Start your private East Java journey with a licensed Indonesian company, clear inclusions, and support from trained local guides. No shared buses, no surprise add-ons at midnight.';
        const lowercasedCity = city?.toLowerCase();

        if (lowercasedCity) {
            filtered = tourPackages.filter(tour => tour.originCity.toLowerCase() === lowercasedCity);
            const capitalizedCity = city!.charAt(0).toUpperCase() + city!.slice(1);
            
            if (lowercasedCity === 'surabaya') {
                pageTitle = `Private Bromo & Ijen Tours from Surabaya | JVTO`;
                pageDescription = `Private, all-inclusive tours from Surabaya to Bromo, Ijen, and Tumpak Sewu. Licensed Indonesian operator, police-led safety culture, clear inclusions, no hidden fees.`;
                introText = 'Start your private East Java journey directly from Surabaya Airport, train station, or hotel. Every JVTO tour is run only for your group with a licensed Indonesian company, clear inclusions, and support from trained local guides. No shared buses, no surprise add-ons at midnight.';
            } else if (lowercasedCity === 'bali') {
                pageTitle = `Private Ijen & Bromo Tours from Bali | JVTO`;
                pageDescription = `Private overland tours from Bali to Ijen, Bromo, and beyond. Ferry, private transport, real Ijen screening, all key permits included.`;
                introText = 'Begin on Bali and cross to East Java with a single responsible operator. We handle ferries, night transfers, Bondowoso stays, Ijen health screening, and onward routes so you avoid piecing together risky last-minute arrangements.';
            } else {
                 pageTitle = `Tours from ${capitalizedCity}`;
                 pageDescription = `Explore our curated selection of private tours starting from ${capitalizedCity}. Journey to Mount Bromo, Ijen Crater, and more.`;
            }
        } else if (type === 'short') {
            filtered = tourPackages.filter(tour => tour.durationDays <= 2);
            pageTitle = 'Short Trips (1-2 Days)';
            pageDescription = `Discover our short but impactful trips in East Java, perfect for a quick getaway. Experience iconic sights like the Bromo sunrise in just 1 or 2 days.`;
            introText = 'Perfect for a quick getaway, these tours pack major experiences into a compact schedule.';
        } else {
            filtered = tourPackages;
        }

        const grouped = {
            '1d1n': filtered.filter(t => t.durationDays === 1),
            '2d1n': filtered.filter(t => t.durationDays === 2),
            '3d2n': filtered.filter(t => t.durationDays === 3),
            '4d3n': filtered.filter(t => t.durationDays === 4),
            '5dplus': filtered.filter(t => t.durationDays >= 5),
        };

        return { filteredTours: filtered, title: pageTitle, description: pageDescription, intro: introText, toursByDuration: grouped };
    }, [city, type]);

    const breadcrumbCrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Tours', path: '/tours' },
        { name: city ? `From ${city.charAt(0).toUpperCase() + city.slice(1)}` : title, path: '#' },
    ];

    const durationHeadings: { [key: string]: string } = {
        '1d1n': '1D1N Routes',
        '2d1n': '2D1N Routes',
        '3d2n': '3D2N Routes',
        '4d3n': '4D3N Routes',
        '5dplus': '5D+ Routes',
    };

    return (
        <main className="pt-20 bg-background-light dark:bg-background-dark">
            <SEO
                title={title}
                description={description}
            />
            <header className="py-12 bg-white dark:bg-ink-primary">
                <div className="container mx-auto px-4">
                    <Breadcrumbs crumbs={breadcrumbCrumbs} />
                    <h1 className="mt-4 text-4xl md:text-5xl font-bold text-ink-primary dark:text-white">
                        {city ? `Private Volcano Tours from ${city.charAt(0).toUpperCase() + city.slice(1)}` : title}
                    </h1>
                    <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200 max-w-3xl">{intro}</p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12">
                {Object.entries(toursByDuration).map(([key, tours]) => {
                    // FIX: The `tours` variable was inferred as `unknown` because `Object.entries` can have a weak return type.
                    // Explicitly casting `tours` to `TourPackage[]` resolves the type error and allows safe access to `.length` and `.map`.
                    const tourList = tours as TourPackage[];
                    if (tourList.length === 0) return null;
                    return (
                        <section key={key} id={key} className="mb-16 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-ink-primary dark:text-white mb-8 border-b-2 border-primary pb-2">{durationHeadings[key]}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {tourList.map(tour => <TourCard key={tour.id} tour={tour} />)}
                            </div>
                        </section>
                    );
                })}

                {filteredTours.length === 0 && (
                     <div className="text-center bg-white dark:bg-ink-primary/50 p-8 rounded-2xl max-w-md mx-auto">
                        <span className="material-symbols-outlined text-5xl text-ink-primary dark:text-white">explore_off</span>
                        <h3 className="text-2xl font-bold text-ink-primary dark:text-white mt-4">No Tours Found</h3>
                        <p className="text-ink-neutral-700 dark:text-ink-neutral-200 mt-2">There are currently no tours matching this category. Please check back later or view all our tours.</p>
                         <Link href="/tours" className="mt-6 inline-block px-6 py-3 rounded-lg bg-primary text-white font-semibold">
                            View All Tours
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
};

export default TourCategoryPage;