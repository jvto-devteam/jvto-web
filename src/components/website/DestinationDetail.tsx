import React, { useState } from 'react';
import Link from "next/link";
import { useParams } from "next/navigation";
import { destinationsData } from '@/data/destinations';
import { tourPackages } from '@/data';
import { destinationFaqs } from '@/data/faqs';
import SEO from './SEO';
import StructuredData from './StructuredData';
import Breadcrumbs from './Breadcrumbs';
import TourCard from './TourCard';
import { DestinationProperty, FAQ, RiskLevel, RiskProfile } from '@/types';
import DestinationFAQ from './DestinationFAQ';
import ElevationChart from './ElevationChart';
import GpxMap from './GpxMap';

const PropertyDisplay: React.FC<{ property: DestinationProperty }> = ({ property }) => (
    <div className="p-4 bg-background-light dark:bg-ink-primary rounded-lg border border-ink-neutral-200 dark:border-ink-neutral-700 h-full">
        <h4 className="font-semibold text-ink-neutral-500 dark:text-ink-neutral-400 text-sm">{property.name}</h4>
        <p className="text-lg font-bold text-ink-primary dark:text-white">{String(property.value)}</p>
        {property.description && <p className="text-sm mt-1 text-ink-neutral-700 dark:text-ink-neutral-200">{property.description}</p>}
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <section className="py-8">
    <h2 className="text-2xl font-bold text-ink-primary dark:text-white border-b-2 border-primary pb-2 mb-6">{title}</h2>
    {children}
  </section>
);

const parseBounds = (boundsStr: string): [[number, number], [number, number]] | null => {
    const parts = boundsStr.split(' ');
    if (parts.length !== 2) return null;
    const [minCoords, maxCoords] = parts;
    const [lat_min, lon_min] = minCoords.split(',').map(Number);
    const [lat_max, lon_max] = maxCoords.split(',').map(Number);
    if ([lat_min, lon_min, lat_max, lon_max].some(isNaN)) return null;
    return [[lat_min, lon_min], [lat_max, lon_max]];
};

const formatGpxMetric = (prop: DestinationProperty): { label: string; value: string } | null => {
    if (typeof prop.value !== 'number') return null;

    const roundedValue = Math.round(prop.value);

    switch (prop.propertyID) {
        case 'gpxTotalDistanceKm':
            return { label: 'Distance', value: `${prop.value.toFixed(1)} km` };
        case 'gpxElevationGainM':
            return { label: 'Elevation Gain', value: `${roundedValue} m` };
        case 'gpxElevationLossM':
            return { label: 'Elevation Loss', value: `${roundedValue} m` };
        case 'gpxMinElevationM':
            return { label: 'Min Elevation', value: `${roundedValue} m` };
        case 'gpxMaxElevationM':
            return { label: 'Max Elevation', value: `${roundedValue} m` };
        default:
            return null;
    }
};

const gpxMetricOrder = [
  'gpxTotalDistanceKm',
  'gpxElevationGainM',
  'gpxElevationLossM',
  'gpxMinElevationM',
  'gpxMaxElevationM',
];

const riskConfig: { [key in keyof RiskProfile]: { label: string; icon: string } } = {
    gasToxicity: { label: 'Gas & Toxicity', icon: 'masks' },
    floodRain: { label: 'Flood / Rain Hazard', icon: 'thunderstorm' },
    slipperyTerrain: { label: 'Slippery Terrain', icon: 'slip_shoe' },
    coldExposure: { label: 'Cold Exposure', icon: 'ac_unit' },
    crowdOverTourism: { label: 'Crowd / Over-tourism', icon: 'groups' },
};

const RiskMatrix: React.FC<{ risks: RiskProfile }> = ({ risks }) => {
    const getRiskStyles = (level: RiskLevel) => {
        switch (level) {
            case 'High': return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300';
            case 'Moderate': return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
            case 'Low': return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
            default: return 'bg-ink-neutral-100 dark:bg-ink-neutral-800 text-ink-neutral-600 dark:text-ink-neutral-400';
        }
    };

    return (
        <div className="space-y-3">
            {Object.entries(risks).map(([key, level]) => {
                const config = riskConfig[key as keyof RiskProfile];
                if (!config) return null;
                return (
                    <div key={key} className="flex items-center gap-3 p-3 bg-white dark:bg-ink-primary rounded-lg border border-ink-neutral-200 dark:border-ink-neutral-700">
                        <span className="material-symbols-outlined text-primary">{config.icon}</span>
                        <span className="flex-grow font-medium text-ink-primary dark:text-white">{config.label}</span>
                        {/* FIX: The `level` variable was inferred as `unknown` because `Object.entries` has a weak return type. Explicitly casting it to `RiskLevel` resolves the type error. */}
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getRiskStyles(level as RiskLevel)}`}>
                            {level as RiskLevel}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const DestinationDetail: React.FC = () => {
    const { destinationSlug } = useParams<{ destinationSlug: string }>();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const destination = destinationsData.find(d => d.slug === destinationSlug);

    if (!destination) {
        return (
            <div className="container mx-auto px-4 py-36 text-center">
                <h1 className="text-4xl font-bold">Destination Not Found</h1>
                <p className="mt-4 text-lg">We {`couldn't`} find the destination you were looking for.</p>
                <Link href="/destinations" className="mt-8 inline-block px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-opacity-90">
                    Back to All Destinations
                </Link>
            </div>
        );
    }
    
    const handlePrev = () => setCurrentImageIndex((prev) => (prev === 0 ? destination.images.length - 1 : prev - 1));
    const handleNext = () => setCurrentImageIndex((prev) => (prev === destination.images.length - 1 ? 0 : prev + 1));
    
    const breadcrumbCrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Destinations', path: '/destinations' },
        { name: destination.name, path: `/destinations/${destination.slug}` },
    ];
    
    const gpxProps = destination.properties
        .filter(p => gpxMetricOrder.includes(p.propertyID))
        .sort((a, b) => gpxMetricOrder.indexOf(a.propertyID) - gpxMetricOrder.indexOf(b.propertyID));

    const elevationProfile = destination.gpxElevationProfile;

    const boundsProp = destination.properties.find(p => p.propertyID === 'gpxBoundingBox');
    const track = destination.gpxTrack;
    let bounds: [[number, number], [number, number]] | null = null;
    if (boundsProp && typeof boundsProp.value === 'string') {
        bounds = parseBounds(boundsProp.value);
    }

    const destinationKeywords = destination.name.toLowerCase().split(' ');
    const relatedTours = tourPackages.filter(tour => 
        tour.route.some(routeStop => destinationKeywords.some(keyword => routeStop.toLowerCase().includes(keyword)))
    );

    const faqsForDestination = destinationFaqs[destination.id] || [];

    const faqSchema = faqsForDestination.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqsForDestination.map((faq: FAQ) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.answer,
            },
        })),
    } : null;

    return (
        <>
            <SEO
                title={`${destination.name} | Destination Guide | JVTO`}
                description={destination.description}
            />
            {faqSchema && <StructuredData data={faqSchema} />}

            <main className="bg-background-light dark:bg-background-dark pt-20">
                <div className="container mx-auto px-4 py-8">
                    <header className="mb-8">
                        <Breadcrumbs crumbs={breadcrumbCrumbs} />
                        <h1 className="mt-4 text-3xl md:text-5xl font-bold text-ink-primary dark:text-white">{destination.name}</h1>
                        <p className="mt-3 text-lg text-ink-neutral-700 dark:text-ink-neutral-200 max-w-3xl">{destination.description}</p>
                    </header>

                    {/* Image Gallery */}
                    <div className="relative group/gallery mb-12">
                         <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-lg">
                            {destination.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${destination.name} view ${index + 1}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                />
                            ))}
                        </div>
                        {destination.images.length > 1 && (
                            <>
                                <button onClick={handlePrev} className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary z-10"><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
                                <button onClick={handleNext} className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary z-10"><span className="material-symbols-outlined">arrow_forward_ios</span></button>
                            </>
                        )}
                        {destination.images.length > 1 && (
                            <div className="mt-4 grid grid-cols-5 md:grid-cols-8 gap-2">
                                {destination.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`aspect-square w-full rounded-lg overflow-hidden focus:outline-none focus:ring-2 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark ${
                                    currentImageIndex === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <Section title="Destination Dossier">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <PropertyDisplay property={{ propertyID: 'type', name: 'Type', value: destination.keyInfo.type }} />
                                    <PropertyDisplay property={{ propertyID: 'phenomenon', name: 'Key Phenomenon', value: destination.keyInfo.phenomenon }} />
                                    <PropertyDisplay property={{ propertyID: 'emotion', name: 'Core Emotion', value: destination.keyInfo.coreEmotion }} />
                                    <PropertyDisplay property={{ propertyID: 'difficulty', name: 'Difficulty', value: `${destination.keyInfo.difficulty} (${destination.keyInfo.difficultyRating})` }} />
                                    <PropertyDisplay property={{ propertyID: 'elevation', name: 'Elevation', value: destination.keyInfo.elevation }} />
                                    <PropertyDisplay property={{ propertyID: 'bestSeason', name: 'Ideal Visit', value: destination.keyInfo.bestSeason }} />
                                </div>
                            </Section>

                             <Section title="Trekking & Logistics">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <PropertyDisplay property={{ propertyID: 'distance', name: 'Distance (Round Trip)', value: destination.trekkingData.distance }} />
                                    <PropertyDisplay property={{ propertyID: 'duration', name: 'Avg. Duration', value: destination.trekkingData.duration }} />
                                    <PropertyDisplay property={{ propertyID: 'terrain', name: 'Terrain', value: destination.trekkingData.terrain }} />
                                    <PropertyDisplay property={{ propertyID: 'access', name: 'Access Point', value: destination.trekkingData.access }} />
                                </div>
                            </Section>
                        </div>
                        <div className="lg:col-span-1">
                             <Section title="Risk & Safety Matrix">
                                <RiskMatrix risks={destination.risks} />
                            </Section>
                        </div>
                    </div>

                    {gpxProps.length > 0 && (
                        <Section title="GPX Data & Analytics">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                                {gpxProps.map(prop => {
                                    const formatted = formatGpxMetric(prop);
                                    if (!formatted) return null;
                                    return (
                                        <div key={prop.propertyID} className="p-3 bg-background-light dark:bg-ink-primary rounded-lg border border-ink-neutral-200 dark:border-ink-neutral-700">
                                            <p className="text-xs font-semibold uppercase text-ink-neutral-500">{formatted.label}</p>
                                            <p className="text-lg font-bold text-primary">{formatted.value}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {track && bounds && (
                                    <div>
                                        <h3 className="font-semibold text-ink-primary dark:text-white mb-2">Route Map</h3>
                                        <GpxMap track={track} bounds={bounds} />
                                    </div>
                                )}
                                {elevationProfile && elevationProfile.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-ink-primary dark:text-white mb-2">Elevation Profile</h3>
                                        <div className="p-4 bg-background-light dark:bg-ink-primary rounded-lg border border-ink-neutral-200 dark:border-ink-neutral-700">
                                            <ElevationChart data={elevationProfile} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Section>
                    )}

                    {faqsForDestination.length > 0 && (
                        <Section title="Frequently Asked Questions">
                            <DestinationFAQ faqs={faqsForDestination} />
                        </Section>
                    )}
                    
                    {relatedTours.length > 0 && (
                       <Section title={`Tours Visiting ${destination.name}`}>
                           <p className="mb-6 text-ink-neutral-700 dark:text-ink-neutral-200">Ready to experience it for yourself? Here are our all-inclusive private tours that feature this incredible destination.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedTours.map(tour => (
                                    <TourCard key={tour.id} tour={tour} />
                                ))}
                            </div>
                        </Section>
                    )}

                </div>
            </main>
        </>
    );
};

export default DestinationDetail;