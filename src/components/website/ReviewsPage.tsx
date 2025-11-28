
import React from 'react';
import Reviews from './Reviews';
import { reviewsCopy } from '@/constants';
import Breadcrumbs from './Breadcrumbs';
import SocialProof from './SocialProof';
import SEO from './SEO';

const ReviewsPage: React.FC = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Why JVTO', path: '/why-jvto' },
    { name: 'Reviews', path: '/why-jvto/reviews' },
  ];

  return (
    <>
      <SEO
          title="Reviews & Testimonials | JVTO Tours"
          description="Read reviews from travelers who have experienced East Java with us. See why we have 5-star ratings on Google, TripAdvisor, and other platforms."
      />
      <div className="bg-background-light dark:bg-background-dark pt-20">
          <header className="py-12 bg-white dark:bg-ink-primary">
              <div className="container mx-auto px-4 text-center">
                  <Breadcrumbs crumbs={breadcrumbCrumbs} />
              </div>
          </header>
          <main>
              <Reviews copy={reviewsCopy} />
              <SocialProof />
          </main>
      </div>
    </>
  );
};

export default ReviewsPage;