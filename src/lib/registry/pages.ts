/**
 * Canonical page registry — single source of truth for every STATIC (website) route.
 *
 * Seeded 2026-06-12 from the filesystem route list + docs/_audit/package1-audit.md.
 * Dynamic routes ([slug]) are intentionally out of scope for PR-1.
 *
 * Field semantics:
 * - `canonical`: the URL search engines should treat as canonical for this page's
 *   intent. Duplicate-intent families (tour-from-X / tours-from-X / tours/from-X)
 *   share one canonical but keep status 'live' — NO redirects yet (GSC-gated,
 *   to be enabled in a later package once Search Console data confirms safe).
 * - `emitVia`: how JSON-LD reaches the page today. Spec target is 'combined'
 *   (PageJsonLdCombined); 'inline' = hand-rolled <JsonLd> (tours/destinations
 *   clusters); 'none' = page emits no JSON-LD (legacy hubs, booking flow).
 * - `faqSource`: 'trust-bundle' = canonical hardcoded/narrative_claims via
 *   resolveFaqsForPage; 'content' = CMS content_pages.content.faq auto-inject;
 *   'none' = no FAQPage on this route.
 * - `status`: 'live' = reachable; 'redirect' = route exists only as a redirect
 *   source (no page.tsx); 'dead' = page.tsx exists but is unreachable because a
 *   redirect fires first (next.config runs before the filesystem router).
 * - `trustClaims`: verifiable claims the page asserts; audited against llm-wiki.
 */

export type PageEntry = {
  key: string;
  route: string;
  canonical: string;
  schemaType: string[];
  faqSource: 'trust-bundle' | 'content' | 'none';
  emitVia: 'combined' | 'inline' | 'none';
  status: 'live' | 'redirect' | 'dead';
  redirectsTo?: string;
  trustClaims?: string[];
};

export const PAGE_REGISTRY: PageEntry[] = [
  {
    key: 'home',
    route: '/',
    canonical: '/',
    schemaType: ['Service', 'WebApplication', 'AggregateRating'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'blog-hub',
    route: '/blog',
    canonical: '/travel-guide',
    schemaType: [],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'dead',
    redirectsTo: '/travel-guide',
  },
  {
    key: 'checkout',
    route: '/checkout',
    canonical: '/checkout',
    schemaType: [],
    faqSource: 'none',
    emitVia: 'none',
    status: 'live',
  },
  {
    key: 'contact',
    route: '/contact',
    canonical: '/contact',
    schemaType: [],
    faqSource: 'content',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'destinations-hub',
    route: '/destinations',
    canonical: '/destinations',
    schemaType: ['CollectionPage', 'TouristAttraction', 'ItemList'],
    faqSource: 'none',
    emitVia: 'inline',
    status: 'live',
  },
  {
    key: 'isic-student-package',
    route: '/isic/student-package',
    canonical: '/isic/student-package',
    schemaType: ['WebPage'],
    faqSource: 'content',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'my-booking',
    route: '/my-booking',
    canonical: '/my-booking',
    schemaType: [],
    faqSource: 'none',
    emitVia: 'none',
    status: 'live',
  },
  {
    key: 'policy-hub',
    route: '/policy',
    canonical: '/policy',
    schemaType: ['ItemList', 'FAQPage'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'student-deals-isic',
    route: '/student-deals/isic',
    canonical: '/isic/student-package',
    schemaType: [],
    faqSource: 'content',
    emitVia: 'combined',
    status: 'dead',
    redirectsTo: '/isic/student-package',
  },
  {
    key: 'team-hub',
    route: '/team',
    canonical: '/team',
    schemaType: ['ItemList', 'Person', 'AggregateRating'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  // ── Bali departure family: 3 live duplicate-intent routes, one canonical.
  // No redirects yet — GSC-gated, scheduled for a later package.
  {
    key: 'tour-from-bali-legacy',
    route: '/tour-from-bali',
    canonical: '/tours/from-bali',
    schemaType: [],
    faqSource: 'none',
    emitVia: 'none',
    status: 'live',
  },
  {
    key: 'tours-from-bali-legacy',
    route: '/tours-from-bali',
    canonical: '/tours/from-bali',
    schemaType: [],
    faqSource: 'none',
    emitVia: 'none',
    status: 'live',
  },
  {
    key: 'tours-from-bali',
    route: '/tours/from-bali',
    canonical: '/tours/from-bali',
    schemaType: ['CollectionPage', 'BreadcrumbList', 'ItemList'],
    faqSource: 'none',
    emitVia: 'inline',
    status: 'live',
    trustClaims: ['all-guides-kta-2024'],
  },
  // ── Surabaya departure family: same shape as Bali.
  {
    key: 'tour-from-surabaya-legacy',
    route: '/tour-from-surabaya',
    canonical: '/tours/from-surabaya',
    schemaType: [],
    faqSource: 'none',
    emitVia: 'none',
    status: 'live',
  },
  {
    key: 'tours-from-surabaya-legacy',
    route: '/tours-from-surabaya',
    canonical: '/tours/from-surabaya',
    schemaType: [],
    faqSource: 'none',
    emitVia: 'none',
    status: 'live',
  },
  {
    key: 'tours-from-surabaya',
    route: '/tours/from-surabaya',
    canonical: '/tours/from-surabaya',
    schemaType: ['CollectionPage', 'BreadcrumbList', 'ItemList'],
    faqSource: 'none',
    emitVia: 'inline',
    status: 'live',
    trustClaims: ['all-guides-kta-2024'],
  },
  {
    key: 'tours-hub',
    route: '/tours',
    canonical: '/tours',
    schemaType: ['CollectionPage', 'BreadcrumbList', 'ItemList'],
    faqSource: 'none',
    emitVia: 'inline',
    status: 'live',
  },
  {
    key: 'travel-guide-hub',
    route: '/travel-guide',
    canonical: '/travel-guide',
    schemaType: ['ItemList', 'FAQPage'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-best-time',
    route: '/travel-guide/best-time-to-visit',
    canonical: '/travel-guide/best-time-to-visit',
    schemaType: ['FAQPage', 'WebPage'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-faq',
    route: '/travel-guide/faq',
    canonical: '/travel-guide/faq',
    schemaType: ['FAQPage', 'WebPage', 'BreadcrumbList'],
    faqSource: 'content',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-police-escort',
    route: '/travel-guide/police-escort-for-groups',
    canonical: '/travel-guide/police-escort-for-groups',
    schemaType: ['FAQPage', 'WebPage'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  // ── W3g addition (2026-07 design-reference sprint): NEW page, zero competitor
  // coverage. TWA Ijen closes to all visitors the first Friday of every month
  // (since March 2019) for the "Rijik" volunteer cleanup (~100-150kg trash
  // removed per session). If W2-S7 also edits this array, this block is the
  // conflict marker — keep this entry, merge around it.
  {
    key: 'travel-guide-rijik-monthly-closure',
    route: '/travel-guide/rijik-monthly-closure',
    canonical: '/travel-guide/rijik-monthly-closure',
    schemaType: ['FAQPage', 'WebPage'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  // ── end W3g addition ──
  {
    key: 'travel-guide-what-is-included',
    route: '/travel-guide/what-is-included',
    canonical: '/travel-guide/what-is-included',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-private-tour',
    route: '/travel-guide/private-tour',
    canonical: '/travel-guide/private-tour',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-vehicle-and-luggage',
    route: '/travel-guide/vehicle-and-luggage',
    canonical: '/travel-guide/vehicle-and-luggage',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-rooming-and-accommodation',
    route: '/travel-guide/rooming-and-accommodation',
    canonical: '/travel-guide/rooming-and-accommodation',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-how-booking-works',
    route: '/travel-guide/how-booking-works',
    canonical: '/travel-guide/how-booking-works',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-payment-and-deposit',
    route: '/travel-guide/payment-and-deposit',
    canonical: '/travel-guide/payment-and-deposit',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-cancellation-travel-credit',
    route: '/travel-guide/cancellation-travel-credit',
    canonical: '/travel-guide/cancellation-travel-credit',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-booking-safety',
    route: '/travel-guide/booking-safety',
    canonical: '/travel-guide/booking-safety',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-blue-fire-and-sunrise',
    route: '/travel-guide/blue-fire-and-sunrise',
    canonical: '/travel-guide/blue-fire-and-sunrise',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-finish-in-bali',
    route: '/travel-guide/finish-in-bali',
    canonical: '/travel-guide/finish-in-bali',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-why-stay-near-ijen',
    route: '/travel-guide/why-stay-near-ijen',
    canonical: '/travel-guide/why-stay-near-ijen',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-bromo-sunrise',
    route: '/travel-guide/bromo-sunrise',
    canonical: '/travel-guide/bromo-sunrise',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'travel-guide-malang-batu',
    route: '/travel-guide/malang-batu',
    canonical: '/travel-guide/malang-batu',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'trust',
    route: '/trust',
    canonical: '/trust',
    schemaType: ['WebPage'],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'verify-jvto-hub',
    route: '/verify-jvto',
    canonical: '/verify-jvto',
    schemaType: ['DigitalDocument', 'FAQPage', 'WebPage'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'verify-history-artifacts',
    route: '/verify-jvto/history-artifacts',
    canonical: '/verify-jvto/history-artifacts',
    schemaType: ['ImageObject', 'Book', 'FAQPage', 'WebPage'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'verify-legal',
    route: '/verify-jvto/legal',
    canonical: '/verify-jvto/legal',
    schemaType: ['DigitalDocument', 'FAQPage', 'WebPage'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'verify-police-safety',
    route: '/verify-jvto/police-safety',
    canonical: '/verify-jvto/police-safety',
    schemaType: ['DigitalDocument', 'FAQPage', 'WebPage'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'verify-press-recognition',
    route: '/verify-jvto/press-recognition',
    canonical: '/verify-jvto/press-recognition',
    schemaType: ['Book', 'NewsArticle', 'Award', 'FAQPage', 'WebPage'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'why-jvto-hub',
    route: '/why-jvto',
    canonical: '/why-jvto',
    schemaType: [],
    faqSource: 'content',
    emitVia: 'combined',
    status: 'live',
  },
];
