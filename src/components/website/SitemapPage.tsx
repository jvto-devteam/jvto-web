

import React from 'react';
import Link from "@/components/website/AppLink";
import Breadcrumbs from './Breadcrumbs';
import SEO from './SEO';
import { tourPackages } from '@/data';

const mainSections = [
    { name: 'Home', href: '/' },
    { name: 'All Tours', href: '/tours' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Travel Guide', href: '/travel-guide' },
    { name: 'Contact', href: '/contact' },
];

const tourCategories = [
    { name: 'Tours from Surabaya', href: '/tours/from-surabaya' },
    { name: 'Tours from Bali', href: '/tours/from-bali' },
    { name: 'Short Trips (1-2 Days)', href: '/tours/duration/short' },
];

const whyJvtoSubsections = [
    { name: 'Our Story', href: '/why-jvto/our-story' },
    { name: 'The JVTO Difference', href: '/why-jvto/the-jvto-difference' },
    { name: 'Reviews', href: '/why-jvto/reviews' },
];


const SitemapPage: React.FC = () => {
    const breadcrumbCrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Sitemap', path: '/sitemap' },
    ];

    return (
        <>
            <SEO
                title="Sitemap | JVTO Tours"
                description="Navigate our website with ease. Find links to all our tours, destinations, travel guides, and company information on our sitemap page."
            />
            <div className="bg-background-light dark:bg-ink-primary pt-20">
                <header className="py-12 bg-white dark:bg-background-dark">
                    <div className="container mx-auto px-4">
                        <Breadcrumbs crumbs={breadcrumbCrumbs} />
                        <div className="text-center mt-4">
                            <h1 className="text-4xl md:text-5xl font-black text-ink-primary dark:text-white">Sitemap</h1>
                            <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200 max-w-2xl mx-auto">An overview of our {`website's`} structure and pages.</p>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-12 md:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
                        
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-ink-primary dark:text-white border-b-2 border-primary pb-2">Main Pages</h2>
                            <ul className="space-y-2">
                                {mainSections.map(link => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-ink-neutral-700 dark:text-ink-neutral-200 hover:text-primary transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="space-y-4">
                             <h2 className="text-2xl font-bold text-ink-primary dark:text-white border-b-2 border-primary pb-2">Why JVTO</h2>
                             <ul className="space-y-2">
                                <li>
                                    <Link href="/why-jvto" className="font-semibold text-ink-neutral-700 dark:text-ink-neutral-200 hover:text-primary transition-colors">Why Choose JVTO</Link>
                                </li>
                                {whyJvtoSubsections.map(link => (
                                     <li key={link.href} className="ml-4">
                                        <Link href={link.href} className="text-ink-neutral-700 dark:text-ink-neutral-200 hover:text-primary transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                             </ul>
                        </div>
                        
                        <div className="space-y-4 md:col-span-2">
                            <h2 className="text-2xl font-bold text-ink-primary dark:text-white border-b-2 border-primary pb-2">Our Tours</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-ink-primary dark:text-white mb-2">Tour Categories</h3>
                                    <ul className="space-y-2">
                                        {tourCategories.map(link => (
                                            <li key={link.href}>
                                                <Link href={link.href} className="text-ink-neutral-700 dark:text-ink-neutral-200 hover:text-primary transition-colors">{link.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-ink-primary dark:text-white mb-2">All Tour Packages</h3>
                                    <ul className="space-y-2">
                                        {tourPackages.map(tour => (
                                            <li key={tour.id}>
                                                <Link href={`/tours/${tour.slug}`} className="text-ink-neutral-700 dark:text-ink-neutral-200 hover:text-primary transition-colors">{tour.label}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
};

export default SitemapPage;