import React from 'react';
import SEO from './SEO';
import Breadcrumbs from './Breadcrumbs';
import QuickQuoteForm from './QuickQuoteForm';
import { contactInfo, pillarsOfTrust } from '@/constants';
import Link from "next/link";

const TrustPoint: React.FC<{ icon: string; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary p-2 rounded-sm mt-1">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
            <h4 className="font-semibold text-ink-primary dark:text-white">{title}</h4>
            <p className="text-sm text-ink-neutral-700 dark:text-ink-neutral-200">{description}</p>
        </div>
    </div>
);

const PlanMyTripPage: React.FC = () => {
    const breadcrumbCrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Plan My Trip', path: '/plan-my-trip' },
    ];

    return (
        <>
            <SEO
                title="Plan Your Custom Trip | Quick Quote | JVTO Tours"
                description="Get a quick, all-inclusive quote for your private tour in East Java. Tell us your plans and our expert team will create a custom itinerary for you."
            />
            <div className="bg-background-light dark:bg-background-dark pt-20">
                <header className="py-12 bg-white dark:bg-ink-primary">
                    <div className="container mx-auto px-4">
                        <Breadcrumbs crumbs={breadcrumbCrumbs} />
                        <div className="mt-4 max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-black text-ink-primary dark:text-white">Plan Your Custom Trip</h1>
                            <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200">
                                Tell us your travel plans, and our team will craft a personalized, all-inclusive itinerary just for you. Get a clear quote with no hidden fees.
                            </p>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-12 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Form Section */}
                        <div className="lg:col-span-2 bg-white dark:bg-background-dark p-6 md:p-8 rounded-sm shadow-lg border border-ink-neutral-200 dark:border-ink-neutral-700">
                            <h2 className="text-2xl font-bold text-ink-primary dark:text-white mb-6 text-center">Your Trip Details</h2>
                            <QuickQuoteForm />
                        </div>

                        {/* Info & Trust Section */}
                        <div className="lg:col-span-1 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-ink-primary dark:text-white mb-4">Why Plan with JVTO?</h3>
                                <div className="space-y-6">
                                    <TrustPoint 
                                        icon={pillarsOfTrust[0].icon} 
                                        title={pillarsOfTrust[0].title}
                                        description={pillarsOfTrust[0].description} 
                                    />
                                    <TrustPoint 
                                        icon={pillarsOfTrust[1].icon} 
                                        title={pillarsOfTrust[1].title}
                                        description={pillarsOfTrust[1].description} 
                                    />
                                    <TrustPoint 
                                        icon={pillarsOfTrust[2].icon} 
                                        title={pillarsOfTrust[2].title}
                                        description={pillarsOfTrust[2].description} 
                                    />
                                </div>
                            </div>
                            
                            <div className="p-6 bg-white dark:bg-ink-primary rounded-sm border border-ink-neutral-200 dark:border-ink-neutral-700">
                                <h3 className="text-xl font-bold text-ink-primary dark:text-white mb-4">Need Help?</h3>
                                <p className="text-sm text-ink-neutral-700 dark:text-ink-neutral-200 mb-4">
                                    Our team is ready to answer your questions and help you build the perfect itinerary.
                                </p>
                                <a 
                                    href={contactInfo.whatsappLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chat_bubble</span>
                                    Chat on WhatsApp
                                </a>
                                <Link 
                                    href="/contact" 
                                    className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-sm border border-ink-neutral-300 dark:border-ink-neutral-600 text-ink-primary dark:text-white font-semibold hover:bg-ink-neutral-100 dark:hover:bg-ink-neutral-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined">email</span>
                                    More Contact Options
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default PlanMyTripPage;
