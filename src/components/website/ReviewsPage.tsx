
import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import SocialProof from './SocialProof';

// NOTE: This component is not wired into any route — the live /why-jvto/reviews
// page is rendered by src/app/(website)/why-jvto/[slug]/page.tsx (DB-driven
// content.sections + BlocksRenderer). Kept only for the pre-existing
// Breadcrumbs/SocialProof usage; the `./Reviews` module it used to import no
// longer exists in this repo, which was one of the 3 documented tsc baseline
// errors (see CLAUDE.md "Things That Bite"). Removed the dead import instead
// of resurrecting an unrelated component.
const ReviewsPage: React.FC = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Why JVTO', path: '/why-jvto' },
    { name: 'Reviews', path: '/why-jvto/reviews' },
  ];

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark pt-20">
          <header className="py-12 bg-white dark:bg-ink-primary">
              <div className="container mx-auto px-4 text-center">
                  <Breadcrumbs crumbs={breadcrumbCrumbs} />
              </div>
          </header>
          <main>
              <SocialProof />
          </main>
      </div>
    </>
  );
};

export default ReviewsPage;