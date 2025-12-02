import React from 'react';
import Link from "next/link";

const StartingPointCard: React.FC<{ title: string; description: string; to: string; imageUrl: string; }> = ({ title, description, to, imageUrl }) => (
    <Link href={to} className="group relative block bg-black rounded-2xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
        <img 
            src={imageUrl} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-60 group-hover:opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="relative h-80 flex flex-col justify-end p-6">
            <h3 className="text-2xl font-bold text-white drop-shadow-md">{title}</h3>
            <p className="mt-1 text-white/90 text-sm">{description}</p>
            <div className="mt-4 text-primary font-semibold">
                <span className="flex items-center gap-1 text-white group-hover:text-primary transition-colors">
                    Browse Tours
                    <span className="transform transition-transform group-hover:translate-x-1 material-symbols-outlined">arrow_forward</span>
                </span>
            </div>
        </div>
    </Link>
);

const StartingPointSection: React.FC = () => {
    return (
        <section className="py-16 md:py-28 bg-gradient-to-br from-ink-accentA to-ink-accentC">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">Find Your Perfect Itinerary</h2>
                <p className="mt-4 text-white/90 text-lg max-w-2xl mx-auto">Choose your starting point and duration to see the most relevant itineraries for you.</p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <StartingPointCard 
                        title="From Surabaya"
                        description="Ideal for short, efficient volcano routes and easy airport or city pickups."
                        to="/tours/from-surabaya"
                        imageUrl="https://images.unsplash.com/photo-1588704406399-6548540435b6?q=80&w=800&auto-format=fit=crop"
                    />
                    <StartingPointCard 
                        title="From Bali"
                        description="Seamless overland links to Ijen and Bromo with managed ferry crossings."
                        to="/tours/from-bali"
                        imageUrl="https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=800&auto-format=fit=crop"
                    />
                </div>
            </div>
        </section>
    );
};

export default StartingPointSection;