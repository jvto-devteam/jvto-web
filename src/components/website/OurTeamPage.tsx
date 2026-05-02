import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import MeetYourGuides from './MeetYourGuides';
import { guides } from '@/constants';

const OurTeamPage = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Why JVTO', path: '/why-jvto' },
    { name: 'Our Team', path: '/why-jvto/our-team' },
  ];

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
          <div className="container mx-auto px-4">
            <Breadcrumbs crumbs={breadcrumbCrumbs} />
            <div className="mt-4 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-black text-ink-primary dark:text-white">Meet Our Team</h1>
              <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200">
                Our guides are local experts from the communities around Ijen and Bromo. We invest in their training and provide sustainable careers, ensuring your journey is guided by people with deep, authentic knowledge of the region.
              </p>
            </div>
          </div>
        </header>

        <main>
          {/* Reusing the MeetYourGuides component for consistency */}
          <MeetYourGuides />
        </main>
      </div>
    </>
  );
};

export default OurTeamPage;
