// src/app/(website)/why-jvto/reviews/reviewThemes.ts
//
// Qualitative, editorially-authored review themes for /why-jvto/reviews.
// Moved verbatim out of src/lib/jvtoReviews.ts when that module was deleted:
// everything else in it was stale review *statistics* (a hand-copied 4.91 / 203
// blend that had drifted from the sources of truth), which now come from
// getPublicAggregateRating() and getEcosystemReviewProfiles(). These themes are
// page copy, not statistics — they now live in ekosistem as
// why-jvto/reviews.source.json's `content.payload.pageContent.reviewThemes` —
// this export is kept only as the FALLBACK constant for page.tsx.
//
// NOT @type:Review schema. HTML-first content only; the individual Review nodes
// on this page are built from real DB records via getReviewsForSchema().

export interface ReviewTheme {
  themeId: string;
  theme: string;
  pattern: string;
  claimLinkage: string;
}

export const REVIEW_THEMES: ReviewTheme[] = [
  {
    themeId: 'T1',
    theme: 'Private tour quality',
    pattern: 'Guests repeatedly mention the value of having dedicated private guides and vehicles — no rush, no compromises.',
    claimLinkage: 'C2',
  },
  {
    themeId: 'T2',
    theme: 'Guide knowledge and English communication',
    pattern: 'Reviews frequently highlight English-speaking ability and route-specific knowledge of guides.',
    claimLinkage: 'C7',
  },
  {
    themeId: 'T3',
    theme: 'Ijen Blue Fire experience quality',
    pattern: 'Reviews from Ijen-route guests reference the Blue Fire experience and the health screening coordination.',
    claimLinkage: 'C4',
  },
  {
    themeId: 'T4',
    theme: 'Safety and trust',
    pattern: "Guests mention feeling safe, well-informed, and prepared — often referencing the founder's police background.",
    claimLinkage: 'C1',
  },
  {
    themeId: 'T5',
    theme: 'All-inclusive clarity and no surprises',
    pattern: 'Guests note that everything was included as described — no unexpected costs or negotiations.',
    claimLinkage: 'C3',
  },
];
