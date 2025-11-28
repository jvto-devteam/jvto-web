import React from 'react';
import SEO from './SEO';
import Breadcrumbs from './Breadcrumbs';
import { communityPartners } from '@/constants';
import { CommunityPartner } from '@/types';
import Link from "next/link";

const PartnerCard: React.FC<{ partner: CommunityPartner }> = ({ partner }) => {
  const commonClassName = "mt-4 inline-block text-sm font-semibold text-primary group-hover:underline";

  return (
    <div className="group flex flex-col p-6 bg-white dark:bg-background-dark rounded-2xl shadow-card hover:shadow-cardHover border border-ink-neutral-200 dark:border-ink-neutral-700 transition-all">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 text-primary p-3 rounded-lg">
          <span className="material-symbols-outlined text-3xl">{partner.icon}</span>
        </div>
        <h3 className="text-xl font-bold text-ink-primary dark:text-white">{partner.title}</h3>
      </div>
      <p className="mt-4 text-ink-neutral-700 dark:text-ink-neutral-200 flex-grow">{partner.description}</p>
      {partner.isExternal ? (
        <a href={partner.link} target="_blank" rel="noopener noreferrer" className={commonClassName}>
          {partner.cta} →
        </a>
      ) : (
        <Link href={partner.link} className={commonClassName}>
          {partner.cta} →
        </Link>
      )}
    </div>
  );
};

const CommunityStandardsPage = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Why JVTO', path: '/why-jvto' },
    { name: 'Community Standards', path: '/why-jvto/community-standards' },
  ];

  return (
    <>
      <SEO
        title="Community & Sustainability Standards | JVTO"
        description="Our commitment to local hiring, training, Indecon alignment, and ethical operations. See how your tour supports communities in East Java."
      />
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
          <div className="container mx-auto px-4">
            <Breadcrumbs crumbs={breadcrumbCrumbs} />
            <div className="mt-4 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-ink-primary dark:text-white">Community & Sustainability Standards</h1>
              <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200">
                Tourism should benefit the places we visit. This is our commitment to local hiring, sustainable practices, and ethical operations.
              </p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {communityPartners.map(partner => (
                    <PartnerCard key={partner.title} partner={partner} />
                ))}
            </div>

            <div className="prose dark:prose-invert max-w-none">
                <h2>Our Guiding Principles</h2>
                <ul>
                    <li><strong>Local First:</strong> We prioritize hiring and training guides, drivers, and support staff from the communities around Bromo, Ijen, and Bondowoso. This ensures your tour is led by people with authentic local knowledge and that tourism revenue directly supports local families.</li>
                    <li><strong>Fair Employment:</strong> We provide our core team with stable employment, fair wages, and ongoing professional training in safety, communication, and first aid. We invest in their careers, not just hire them for a single trip.</li>
                    <li><strong>Environmental Responsibility:</strong> As a member of the Indecon sustainable tourism network, we are committed to minimizing our impact. This includes providing reusable water solutions, managing waste responsibly on tours, and educating guests on how to respect the fragile volcanic ecosystems.</li>
                    <li><strong>Ethical Operations:</strong> We operate with full legal compliance and transparency. We do not engage in price-gouging, we respect local customs and religious sites, and we contribute to local community initiatives where possible.</li>
                </ul>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CommunityStandardsPage;