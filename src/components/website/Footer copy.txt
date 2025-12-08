import React from 'react';
import Link from "next/link";
import { contactInfo, proofLinks } from '@/constants';
import Logo from './Logo';

const exploreLinks = [
    { name: 'All Tours', href: '/tours' },
    { name: 'Tours from Surabaya', href: '/tours/from-surabaya' },
    { name: 'Tours from Bali', href: '/tours/from-bali' },
    { name: 'All Destinations', href: '/destinations' },
    // { name: 'Sitemap', href: '/sitemap' },
];

const aboutLinks = [
    { name: 'Why Choose JVTO', href: '/why-jvto' },
    { name: 'Our Story', href: '/why-jvto/our-story' },
    { name: 'The JVTO Difference', href: '/why-jvto/the-jvto-difference' },
    { name: 'Our Team', href: '/why-jvto/our-team' },
    { name: 'Community Standards', href: '/why-jvto/community-standards' },
    { name: 'Reviews', href: '/why-jvto/reviews' },
    { name: 'Verify JVTO', href: '/verify-jvto' },
];

const supportLinks = [
    { name: 'Travel Guide', href: '/travel-guide' },
    { name: 'FAQ', href: '/travel-guide/faq' },
    { name: 'Booking Information', href: '/travel-guide/booking-information' },
    { name: 'ISIC Student Deals', href: '/isic/student-package' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/travel-guide/privacy' },
    { name: 'Terms of Service', href: '/travel-guide/terms' },
];


const verificationLinks = [
  { name: 'Verify AHU (PT)', href: proofLinks.ahuProfile },
  { name: 'Verify NIB License', href: proofLinks.nibPdf },
  { name: 'Verify TDUP License', href: proofLinks.tdupPdf },
  { name: 'Office on Google Maps', href: proofLinks.officeMaps },
  { name: 'Indecon Profile', href: proofLinks.indecon },
  { name: 'ISIC Partner Page', href: proofLinks.isic },
  { name: 'Google Reviews', href: proofLinks.googleMaps },
  { name: 'TripAdvisor Reviews', href: proofLinks.tripadvisor },
  { name: 'Trustpilot Reviews', href: proofLinks.trustpilot },
];


// Reusable SVG Icon for social links
const SocialIcon: React.FC<{ path: string; name: string; }> = ({ path, name }) => (
    <a href="#" className="text-ink-neutral-500 dark:text-ink-neutral-400 hover:text-primary dark:hover:text-white transition-colors">
        <span className="sr-only">{name}</span>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d={path} />
        </svg>
    </a>
);


const Footer: React.FC = () => {
  return (
    <footer className="bg-background-light dark:bg-ink-primary text-ink-neutral-700 dark:text-ink-neutral-200 border-t border-ink-neutral-200 dark:border-white/10">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          {/* Column 1 & 2: Brand & Social */}
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 text-ink-neutral-500 dark:text-ink-neutral-400 text-sm max-w-xs">
              JVTO is a licensed, locally based operator with transparent policies, public reviews, and verifiable contact details.
            </p>
            <div className="mt-6 flex space-x-4">
               <SocialIcon name="Instagram" path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281-.073-1.689-.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
               <SocialIcon name="Facebook" path="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
               <SocialIcon name="YouTube" path="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.897 3.434 0 4.815 0 8.748v6.504c0 3.933.897 5.314 4.385 5.564 3.6.245 11.626.246 15.23 0 3.488-.25 4.385-1.631 4.385-5.564V8.748c0-3.933-.897-5.314-4.385-5.564zM9.545 15.568V7.928l6.109 3.82-6.109 3.82z" />
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-ink-primary dark:text-white tracking-wider uppercase">Explore</h4>
            <ul className="mt-4 space-y-2">
              {exploreLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-ink-neutral-500 dark:text-ink-neutral-400 hover:text-primary dark:hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-ink-primary dark:text-white tracking-wider uppercase">About JVTO</h4>
            <ul className="mt-4 space-y-2">
              {aboutLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-ink-neutral-500 dark:text-ink-neutral-400 hover:text-primary dark:hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-ink-primary dark:text-white tracking-wider uppercase">Support</h4>
            <ul className="mt-4 space-y-2">
              {supportLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-ink-neutral-500 dark:text-ink-neutral-400 hover:text-primary dark:hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
           <div>
            <h4 className="text-base font-semibold text-ink-primary dark:text-white tracking-wider uppercase">Verification</h4>
            <ul className="mt-4 space-y-2">
              {verificationLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-ink-neutral-500 dark:text-ink-neutral-400 hover:text-primary dark:hover:text-white transition-colors">
                    <span>{link.name}</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-neutral-200 dark:border-white/10 text-sm text-ink-neutral-500 dark:text-ink-neutral-400">
            <h4 className="font-semibold text-ink-primary dark:text-white">PT Java Volcano Rendezvous</h4>
            <p><strong>Business & Tourism Licence (NIB/TDUP):</strong> 1102230032918</p>
            <p>{contactInfo.officeAddress}</p>
            <p><strong>Email:</strong> {contactInfo.email} · <strong>WhatsApp:</strong> {contactInfo.whatsapp}</p>
        </div>

        <div className="mt-8 pt-8 border-t border-ink-neutral-200 dark:border-white/10 text-center text-sm text-ink-neutral-500 dark:text-ink-neutral-500">
          <p>&copy; {new Date().getFullYear()} JVTO Tours. All Rights Reserved.</p>
          <div className="mt-2 space-x-4">
              <Link href="/travel-guide/privacy" className="hover:text-primary dark:hover:text-white transition-colors">Privacy Policy</Link>
              <span>&middot;</span>
              <Link href="/travel-guide/terms" className="hover:text-primary dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;