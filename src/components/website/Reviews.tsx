// FIX: Implemented the Reviews component to resolve the 'not a module' error in App.tsx.
import React from 'react';
import { SectionCopy, Review } from '@/types';
import { reviews } from '@/data';

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    
    const PlatformDisplay = () => {
        let icon = 'reviews';
        let platformName = 'Review';
        let color = 'text-gray-500';

        switch (review.platform) {
            case 'google':
                icon = 'travel_explore';
                platformName = 'Google';
                color = 'text-blue-500';
                break;
            case 'tripadvisor':
                icon = 'rate_review';
                platformName = 'TripAdvisor';
                color = 'text-green-500';
                break;
            case 'trustpilot':
                icon = 'verified';
                platformName = 'Trustpilot';
                color = 'text-teal-500';
                break;
            case 'facebook':
                icon = 'thumb_up';
                platformName = 'Facebook';
                color = 'text-indigo-600';
                break;
        }

        return (
            <div className={`flex items-center gap-1.5 text-xs mt-1.5 ${color} dark:opacity-80`}>
                <span className="material-symbols-outlined text-sm">{icon}</span>
                <span className="font-semibold">on {platformName}</span>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-background-dark p-6 rounded-2xl shadow-card hover:shadow-cardHover h-full flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
             <h3 className="font-bold text-lg text-ink-primary dark:text-white line-clamp-2" title={review.title}>{review.title}</h3>
            <div className="flex items-center mt-2">
                {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
                 {[...Array(5 - review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-ink-neutral-300 dark:text-ink-neutral-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
            </div>
            <div className="relative mt-4 flex-grow">
                <span className="absolute -top-2 -left-3 text-6xl text-ink-neutral-200 dark:text-ink-neutral-700 font-serif opacity-50 z-0">“</span>
                <p className="text-ink-neutral-700 dark:text-ink-neutral-200 relative z-10">{review.text}</p>
            </div>
            <div className="mt-auto pt-4 flex items-center">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                <div>
                    <p className="font-bold text-ink-primary dark:text-white">{review.name}</p>
                    <p className="text-sm text-ink-neutral-500 dark:text-ink-neutral-200">{review.location} · {review.date}</p>
                    <PlatformDisplay />
                </div>
            </div>
        </div>
    );
};

interface ReviewsProps {
  copy: SectionCopy;
}

const Reviews: React.FC<ReviewsProps> = ({ copy }) => {
  return (
    <section className="py-12 md:py-24 bg-background-light dark:bg-ink-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-wide uppercase">{copy.overline}</p>
          <h2 className="text-3xl font-bold text-ink-primary dark:text-white mt-1">{copy.title}</h2>
          <p className="mt-2 text-ink-neutral-500 dark:text-ink-neutral-200 max-w-2xl mx-auto">{copy.subhead}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;