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
  // ── Geographic market landing pages (GEO/AEO GAP-09). Server Components using
  // PageJsonLdCombined + canonical market FAQs (resolveFaqs) + a Product/Offer
  // ItemList passed via extraSchemas (buildMarketSchemas).
  {
    key: 'markets-singapore',
    route: '/markets/singapore',
    canonical: '/markets/singapore',
    schemaType: ['ItemList', 'FAQPage', 'WebPage'],
    faqSource: 'trust-bundle',
    emitVia: 'combined',
    status: 'live',
  },
  {
    key: 'markets-malaysia',
    route: '/markets/malaysia',
    canonical: '/markets/malaysia',
    schemaType: ['ItemList', 'FAQPage', 'WebPage'],
    faqSource: 'trust-bundle',
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
    canonical: '/why-jvto/our-team',
    schemaType: [],
    faqSource: 'none',
    emitVia: 'combined',
    status: 'dead',
    redirectsTo: '/why-jvto/our-team',
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
