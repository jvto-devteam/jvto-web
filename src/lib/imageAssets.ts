/**
 * src/lib/imageAssets.ts — Typed constants for all 54 JVTO image assets.
 * Source of truth: docs/assets/jvto_image_asset_map.json
 * Groups mirror the JSON exactly. Named lookups added for common references.
 *
 * Usage:
 *   import { CREW_PORTRAITS_BY_CODE, FOUNDER_LEADERSHIP } from '@/lib/imageAssets';
 *   const anjasPhoto = CREW_PORTRAITS_BY_CODE.anjas.url;
 */

export interface ImageAsset {
  url: string;
  alt: string;
  caption: string;
  group: string;
  recommendedPath: string;
}

// ── brand_identity (2) ────────────────────────────────────────────────────────
export const BRAND_IDENTITY: ImageAsset[] = [
  {
    url: '/assets/img/hero/home.webp',
    alt: 'Scenic view of Java volcanoes.',
    caption: 'Website Hero Image.',
    group: 'brand_identity',
    recommendedPath: 'brand_identity/01-jvto-hero-landscape.webp',
  },
  {
    url: '/assets/img/jvto-color.png',
    alt: 'Java Volcano Tour Operator Logo.',
    caption: 'JVTO Official Logo.',
    group: 'brand_identity',
    recommendedPath: 'brand_identity/02-jvto-official-logo.png',
  },
];

// ── crew_portraits (11) ───────────────────────────────────────────────────────
export const CREW_PORTRAITS: ImageAsset[] = [
  {
    url: '/uploads/1768225567764-405955176-gufron.png',
    alt: 'Photo of Gufron, a guide at Java Volcano Tour Operator.',
    caption: 'Gufron - Guide',
    group: 'crew_portraits',
    recommendedPath: 'crew_portraits/01-gufron-guide.png',
  },
  {
    url: '/uploads/1768226003889-338819579-fauzi.png',
    alt: 'Photo of Fauzi, a guide at Java Volcano Tour Operator.',
    caption: 'Fauzi - Guide',
    group: 'crew_portraits',
    recommendedPath: 'crew_portraits/02-fauzi-guide.png',
  },
  {
    url: '/uploads/1768228083285-919198019-taufik_1_.png',
    alt: 'Photo of Taufik, a guide at Java Volcano Tour Operator.',
    caption: 'Taufik - Guide',
    group: 'crew_portraits',
    recommendedPath: 'crew_portraits/03-taufik-guide.png',
  },
  {
    url: '/uploads/1768228191022-893381041-boy.png',
    alt: 'Photo of Boy (Ahboy), a guide at Java Volcano Tour Operator.',
    caption: 'Boy (Ahboy) - Guide',
    group: 'crew_portraits',
    recommendedPath: 'crew_portraits/04-boy-ahboy-guide.png',
  },
  {
    url: '/uploads/1768228514527-518051332-rendi.png',
    alt: 'Photo of Rendi, a guide at Java Volcano Tour Operator.',
    caption: 'Rendi - Guide',
    group: 'crew_portraits',
    recommendedPath: 'crew_portraits/05-rendi-guide.png',
  },
  {
    url: '/uploads/1768270364125-144711646-yandi.png',
    alt: 'Photo of Yandi, a driver at Java Volcano Tour Operator.',
    caption: 'Yandi - Driver',
    group: 'crew_portraits',
    recommendedPath: 'crew_portraits/06-yandi-driver.png',
  },
  {
    url: '/uploads/1768270423657-690185912-anjas.png',
    alt: 'Photo of Anjas, a guide at Java Volcano Tour Operator.',
    caption: 'Anjas - Guide',
    group: 'crew_portraits',
    recommendedPath: 'crew_portraits/07-anjas-guide.png',
  },
  {
    url: '/uploads/1768271545598-834784538-kiki.png',
    alt: 'Photo of Kiki, a guide at Java Volcano Tour Operator.',
    caption: 'Kiki - Guide',
    group: 'crew_portraits',
    recommendedPath: 'crew_portraits/08-kiki-guide.png',
  },
  {
    url: '/uploads/1768276791622-262250680-freddy.png',
    alt: 'Photo of Fredi, a driver at Java Volcano Tour Operator.',
    caption: 'Fredi - Driver',
    group: 'crew_portraits',
    recommendedPath: 'crew_portraits/09-fredi-driver.png',
  },
  {
    url: '/uploads/1768277053384-470130286-holili.jpg',
    alt: 'Photo of Holili, a driver at Java Volcano Tour Operator.',
    caption: 'Holili - Driver',
    group: 'crew_portraits',
    recommendedPath: 'crew_portraits/10-holili-driver.jpg',
  },
  {
    url: '/uploads/1768277336049-911840775-joyo.png',
    alt: 'Photo of Joyo, a driver at Java Volcano Tour Operator.',
    caption: 'Joyo - Driver',
    group: 'crew_portraits',
    recommendedPath: 'crew_portraits/11-joyo-driver.png',
  },
];

/** Named lookup for crew portraits by crew_members.code. */
export const CREW_PORTRAITS_BY_CODE: Record<string, ImageAsset> = {
  gufron: CREW_PORTRAITS[0],
  fauzi:  CREW_PORTRAITS[1],
  taufik: CREW_PORTRAITS[2],
  boy:    CREW_PORTRAITS[3],
  rendi:  CREW_PORTRAITS[4],
  yandi:  CREW_PORTRAITS[5],
  anjas:  CREW_PORTRAITS[6],
  kiki:   CREW_PORTRAITS[7],
  fredi:  CREW_PORTRAITS[8],
  holili: CREW_PORTRAITS[9],
  joyo:   CREW_PORTRAITS[10],
};

// ── crew_credentials (5) ─────────────────────────────────────────────────────
export const CREW_CREDENTIALS: ImageAsset[] = [
  {
    url: '/uploads/1771428489070-55145932-kta_kiki.jpg',
    alt: 'Ijen climbing license card for Kiki.',
    caption: 'Official Ijen climbing license for Kiki.',
    group: 'crew_credentials',
    recommendedPath: 'crew_credentials/01-kiki-ijen-license-card.jpg',
  },
  {
    url: '/uploads/1771428583288-513992233-kta_anjas.jpg',
    alt: 'Ijen climbing license card for Anjas.',
    caption: 'Official Ijen climbing license for Anjas.',
    group: 'crew_credentials',
    recommendedPath: 'crew_credentials/02-anjas-ijen-license-card.jpg',
  },
  {
    url: '/uploads/1771428704448-911506028-kta_taufik.jpg',
    alt: 'Ijen climbing license card for Taufik.',
    caption: 'Official Ijen climbing license for Taufik.',
    group: 'crew_credentials',
    recommendedPath: 'crew_credentials/03-taufik-ijen-license-card.jpg',
  },
  {
    url: '/uploads/1771428741674-842615436-kta_gufron.jpg',
    alt: 'Ijen climbing license card for Gufron.',
    caption: 'Official Ijen climbing license for Gufron.',
    group: 'crew_credentials',
    recommendedPath: 'crew_credentials/04-gufron-ijen-license-card.jpg',
  },
  {
    url: '/uploads/1771428760524-516116110-kta_rendi.jpg',
    alt: 'Ijen climbing license card for Rendi.',
    caption: 'Official Ijen climbing license for Rendi.',
    group: 'crew_credentials',
    recommendedPath: 'crew_credentials/05-rendi-ijen-license-card.jpg',
  },
];

/** Named lookup for KTA credentials by crew_members.code. */
export const CREW_CREDENTIALS_BY_CODE: Record<string, ImageAsset> = {
  kiki:   CREW_CREDENTIALS[0],
  anjas:  CREW_CREDENTIALS[1],
  taufik: CREW_CREDENTIALS[2],
  gufron: CREW_CREDENTIALS[3],
  rendi:  CREW_CREDENTIALS[4],
};

// ── field_operations (8) ─────────────────────────────────────────────────────
export const FIELD_OPERATIONS: ImageAsset[] = [
  {
    url: '/legal/office-photo.jpg',
    alt: 'Photo of JVTO office at Jl. Khairil Anwar No.102 A, Bondowoso.',
    caption: 'JVTO Bondowoso operations office.',
    group: 'field_operations',
    recommendedPath: 'field_operations/01-office-photo-jpg.jpg',
  },
  {
    url: '/ops/baratha-hotel-departure-team.jpg',
    alt: 'Team and guests lined up outside Baratha Hotel before Ijen ascent with Tourist Police support vehicle.',
    caption: 'Pre-ascent lineup at Baratha Hotel with Tourist Police support.',
    group: 'field_operations',
    recommendedPath: 'field_operations/02-baratha-hotel-departure-team-jpg.jpg',
  },
  {
    url: '/ops/group-at-jvto-office.jpg',
    alt: 'International travelers posing at JVTO Bondowoso operations office.',
    caption: 'International group visiting JVTO Bondowoso operations office.',
    group: 'field_operations',
    recommendedPath: 'field_operations/03-group-at-jvto-office-jpg.jpg',
  },
  {
    url: '/ops/guest-welcome-evening.png',
    alt: 'Evening welcome and briefing with guests at JVTO office.',
    caption: 'Evening welcome with guests at JVTO office.',
    group: 'field_operations',
    recommendedPath: 'field_operations/04-guest-welcome-evening-png.png',
  },
  {
    url: '/ops/ijen-geopark-briefing.png',
    alt: 'Tourist Police briefing at Ijen Geopark Center with local miners present.',
    caption: 'Tourist Police briefing at Ijen Geopark Information Center with local miners present.',
    group: 'field_operations',
    recommendedPath: 'field_operations/05-ijen-geopark-briefing-png.png',
  },
  {
    url: '/ops/jvto-police-escort-arrival-hotel-bondowoso-day.jpg',
    alt: 'JVTO group standing with a traffic police officer and patrol car outside the hotel in daylight after an escorted drive.',
    caption: 'Traffic Police escorted arrival at the hotel in Bondowoso — group photo with patrol car.',
    group: 'field_operations',
    recommendedPath: 'field_operations/06-jvto-police-escort-arrival-hotel-bondowoso-day-jpg.jpg',
  },
  {
    url: '/ops/jvto-police-escort-arrival-hotel-bondowoso-night.jpg',
    alt: 'Group of JVTO travelers posing with a traffic police officer in the hotel courtyard at night after an escorted transfer.',
    caption: 'Arriving in Bondowoso with a Traffic Police escort — group photo at hotel after journey.',
    group: 'field_operations',
    recommendedPath: 'field_operations/07-jvto-police-escort-arrival-hotel-bondowoso-night-jpg.jpg',
  },
  {
    url: '/ops/police-vehicle-support.jpg',
    alt: 'Police support vehicle with group prior to tour departure.',
    caption: 'Police support vehicle and group prior to departure.',
    group: 'field_operations',
    recommendedPath: 'field_operations/08-police-vehicle-support-jpg.jpg',
  },
];

// ── founder_leadership (3) ────────────────────────────────────────────────────
export const FOUNDER_LEADERSHIP: ImageAsset[] = [
  {
    url: '/founder/agung_sambuko.jpg',
    alt: 'Agung Sambuko (Mr. Sam), Founder of Java Volcano Tour Operator.',
    caption: 'Founder of JVTO and active member of the East Java Tourist Police Unit (Ditpamobvit), specializing in tourist safety and risk management.',
    group: 'founder_leadership',
    recommendedPath: 'founder_leadership/01-agung-sambuko-mr-sam.jpg',
  },
  {
    url: '/founder/mr-sam-tourist-police-portrait.png',
    alt: 'Bripka Agung Sambuko in official Tourist Police uniform, Bondowoso.',
    caption: 'Active Tourist Police leadership behind every JVTO trip.',
    group: 'founder_leadership',
    recommendedPath: 'founder_leadership/02-mr-sam-tourist-police-portrait-png.png',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Agung_Sambuko.jpg',
    alt: 'Mr. Sam, active Tourist Police officer and founder of JVTO.',
    caption: 'Active Tourist Police leadership behind every JVTO trip.',
    group: 'founder_leadership',
    recommendedPath: 'founder_leadership/03-agung-sambuko-jpg.jpg',
  },
];

/**
 * Not in the JSON asset map — appears in JVTO_SSOT_Image_Inventory.md (founder group #3).
 * Used in /verify-jvto/press-recognition (Stefan Loose citation section).
 */
export const FOUNDER_WITH_GUESTS_STEFAN_LOOSE: ImageAsset = {
  url: '/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg',
  alt: 'Agung Sambuko, founder of JVTO, standing with international guests who visited Ijen Bondowoso Homestay after reading the Stefan Loose travel guide. Agung holds the book while a guest points to the page mentioning the homestay.',
  caption: 'Founder Agung Sambuko (center) holding Stefan Loose guidebook as guests point to the entry about Ijen Bondowoso Homestay.',
  group: 'founder_leadership',
  recommendedPath: 'founder_leadership/04-founder-with-guests-stefan-loose.jpg',
};

// ── health_screening (5) ─────────────────────────────────────────────────────
export const HEALTH_SCREENING: ImageAsset[] = [
  {
    url: '/screening/ijen-screening-hotel-01.jpeg',
    alt: 'Nurse checks blood pressure during Ijen pre-ascent screening at hotel lobby.',
    caption: 'Pre-ascent health screening at partner hotel.',
    group: 'health_screening',
    recommendedPath: 'health_screening/01-ijen-screening-hotel-01-jpeg.jpeg',
  },
  {
    url: '/screening/ijen-screening-hotel-02.jpg',
    alt: 'Medical staff measure vitals for adult traveler at a hotel table.',
    caption: 'Vitals taken and logged before night ascent.',
    group: 'health_screening',
    recommendedPath: 'health_screening/02-ijen-screening-hotel-02-jpg.jpg',
  },
  {
    url: '/screening/jvto-office-screening-1.JPG',
    alt: 'Nurse checking blood pressure at JVTO office before Ijen climb.',
    caption: 'Digitally recorded, signed clearance issuance.',
    group: 'health_screening',
    recommendedPath: 'health_screening/03-jvto-office-screening-1-jpg.jpg',
  },
  {
    url: '/screening/jvto-office-screening-2.jpg',
    alt: 'Oxygen saturation check recorded into JVTO system.',
    caption: 'Screening can be done at hotel or office.',
    group: 'health_screening',
    recommendedPath: 'health_screening/04-jvto-office-screening-2-jpg.jpg',
  },
  {
    url: '/screening/print-surat-sehat-preview.png',
    alt: 'Preview of JVTO health clearance form ready for printing (PNG).',
    caption: 'Sample printout of health clearance (surat sehat) preview image.',
    group: 'health_screening',
    recommendedPath: 'health_screening/05-print-surat-sehat-preview-png.png',
  },
];

// ── history_heritage (5) ─────────────────────────────────────────────────────
export const HISTORY_HERITAGE: ImageAsset[] = [
  {
    url: '/history/booking-2015-plaque.jpg',
    alt: '2015 Booking.com Guest Review Award plaque, Ijen Bondowoso Homestay (score 9.4/10).',
    caption: 'Guesthouse era recognition (2015).',
    group: 'history_heritage',
    recommendedPath: 'history_heritage/01-booking-com-guest-review-award-2015-plaque-award-letter.jpg',
  },
  {
    url: '/history/booking-2015-shipping-label.jpg',
    alt: 'Booking.com package addressed to Ijen Bondowoso Homestay, Jl. Khairil Anwar No.102, Bondowoso.',
    caption: 'Award shipped to residential address used for the family-run guesthouse.',
    group: 'history_heritage',
    recommendedPath: 'history_heritage/02-booking-com-guest-review-award-2015-shipping-label-box.jpg',
  },
  {
    url: '/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg',
    alt: 'Mr. Sam with guests at Ijen Bondowoso Homestay, inspired by Stefan Loose travel guide.',
    caption: 'Guests visiting Ijen Bondowoso Homestay after reading the Stefan Loose guide.',
    group: 'history_heritage',
    recommendedPath: 'history_heritage/03-guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired-jpg.jpg',
  },
  {
    url: '/history/stefan-loose-ijen-bondowoso-page.png',
    alt: 'European travel handbook entry listing Ijen Bondowoso Homestay; notes tours arranged by Agung.',
    caption: 'Early third-party mention in a European travel guide.',
    group: 'history_heritage',
    recommendedPath: 'history_heritage/04-stefan-loose-ijen-bondowoso-page-png.png',
  },
  {
    url: '/history/stefan_loose_crop_enh.jpg',
    alt: 'Cropped image of a German travel guide page referencing Ijen Bondowoso Homestay and tours.',
    caption: 'Cropped/enhanced screenshot of the Stefan Loose travel guide page (for clearer reading).',
    group: 'history_heritage',
    recommendedPath: 'history_heritage/05-stefan-loose-crop-enh-jpg.jpg',
  },
];

// ── legal_business_identity (2) ───────────────────────────────────────────────
export const LEGAL_BUSINESS_IDENTITY: ImageAsset[] = [
  {
    url: '/legal/NIB-1102230032918-preview.png',
    alt: 'Preview of NIB certificate (PNG).',
    caption: 'NIB 1102230032918 preview image.',
    group: 'legal_business_identity',
    recommendedPath: 'legal_business_identity/01-nib-1102230032918-preview-png.png',
  },
  {
    url: '/legal/NIB-1102230032918-preview.webp',
    alt: 'Preview of NIB certificate (WebP).',
    caption: 'NIB 1102230032918 preview image (WebP).',
    group: 'legal_business_identity',
    recommendedPath: 'legal_business_identity/02-nib-1102230032918-preview-webp.webp',
  },
];

// ── legal_membership (2) ──────────────────────────────────────────────────────
export const LEGAL_MEMBERSHIP: ImageAsset[] = [
  {
    url: '/legal/HPWKI-approval-preview.png',
    alt: 'Preview of HPWKI approval document (PNG).',
    caption: 'HPWKI approval letter preview image.',
    group: 'legal_membership',
    recommendedPath: 'legal_membership/01-hpwki-approval-preview-png.png',
  },
  {
    url: '/legal/HPWKI-approval-preview.webp',
    alt: 'Preview of HPWKI approval document (WebP).',
    caption: 'HPWKI approval letter preview image (WebP).',
    group: 'legal_membership',
    recommendedPath: 'legal_membership/02-hpwki-approval-preview-webp.webp',
  },
];

// ── legal_tourism_license (2) ─────────────────────────────────────────────────
export const LEGAL_TOURISM_LICENSE: ImageAsset[] = [
  {
    url: '/legal/TDUP-1102230032918-preview.png',
    alt: 'Preview of TDUP licence (PNG).',
    caption: 'TDUP licence preview image.',
    group: 'legal_tourism_license',
    recommendedPath: 'legal_tourism_license/01-tdup-1102230032918-preview-png.png',
  },
  {
    url: '/legal/TDUP-1102230032918-preview.webp',
    alt: 'Preview of TDUP licence (WebP).',
    caption: 'TDUP licence preview image (WebP).',
    group: 'legal_tourism_license',
    recommendedPath: 'legal_tourism_license/02-tdup-1102230032918-preview-webp.webp',
  },
];

// ── partner_validation (1) ────────────────────────────────────────────────────
export const PARTNER_VALIDATION: ImageAsset[] = [
  {
    url: '/partner/screensot-isic-page-jvto.png',
    alt: 'Screenshot of JVTO listing on the official ISIC student discount directory.',
    caption: '',
    group: 'partner_validation',
    recommendedPath: 'partner_validation/01-international-student-identity-card.png',
  },
];

// ── police_authority_documents (4) ────────────────────────────────────────────
export const POLICE_AUTHORITY_DOCUMENTS: ImageAsset[] = [
  {
    url: '/legal/SPRIN-POLPAR.png',
    alt: "Image of 'SPRIN POLPAR' Tourist Police assignment letter (PNG).",
    caption: 'Tourist Police assignment letter (SPRIN POLPAR) image copy.',
    group: 'police_authority_documents',
    recommendedPath: 'police_authority_documents/01-sprin-polpar-png.png',
  },
  {
    url: '/legal/SPRIN-POLPAR.webp',
    alt: "Scanned 'SPRIN POLPAR' Tourist Police assignment letter (WebP).",
    caption: 'Tourist Police assignment letter (SPRIN POLPAR) preview image.',
    group: 'police_authority_documents',
    recommendedPath: 'police_authority_documents/02-sprin-polpar-webp.webp',
  },
  {
    url: '/legal/SPRIN-WAL-TRAVEL-2024-02-12.png',
    alt: "Image of 'SPRIN WAL-TRAVEL' travel order dated 2024-02-12 (PNG).",
    caption: 'Police travel order (SPRIN WAL-TRAVEL), 12 Feb 2024 image copy.',
    group: 'police_authority_documents',
    recommendedPath: 'police_authority_documents/03-sprin-wal-travel-2024-02-12-png.png',
  },
  {
    url: '/legal/SPRIN-WAL-TRAVEL-2024-02-12.webp',
    alt: "Scanned travel order 'SPRIN WAL-TRAVEL' dated 2024-02-12 (WebP).",
    caption: 'Police travel order (SPRIN WAL-TRAVEL), 12 Feb 2024 preview image.',
    group: 'police_authority_documents',
    recommendedPath: 'police_authority_documents/04-sprin-wal-travel-2024-02-12-webp.webp',
  },
];

// ── press_mentions (3) ────────────────────────────────────────────────────────
export const PRESS_MENTIONS: ImageAsset[] = [
  {
    url: '/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png',
    alt: "Screenshot of Detik.com article 'Suka Duka Polisi Pariwisata Bondowoso: Tegakkan Prokes Sambil Lawan Dingin' showing date line and article header.",
    caption: 'Press mention screenshot (Detik.com) with founder name variant in Tourist Police context.',
    group: 'press_mentions',
    recommendedPath: 'press_mentions/01-detik-polisi-pariwisata-bondowoso.png',
  },
  {
    url: '/press/screenshot-bbksda-pelatihan-pemandu-kawah-ijen.png',
    alt: 'Screenshot of BBKSDA Jatim article on HPWKI guide safety training.',
    caption: 'BBKSDA Jatim official training article: HPWKI members participate in Ijen guide safety training (SAR & emergency first aid).',
    group: 'press_mentions',
    recommendedPath: 'press_mentions/02-screenshot-bbksda-pelatihan-pemandu-kawah-ijen-png.png',
  },
  {
    url: '/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png',
    alt: "Screenshot of Radar Jember article 'Polpar Dibentuk untuk Mendukung Ijen Geopark' showing date line and article header.",
    caption: 'Press mention screenshot (Radar Jember) about Tourist Police formation for Ijen Geopark.',
    group: 'press_mentions',
    recommendedPath: 'press_mentions/03-screenshot-radarjember-polpar-ijen-geopark.png',
  },
];

// ── uncertain (1) ─────────────────────────────────────────────────────────────
export const UNCERTAIN: ImageAsset[] = [
  {
    url: '/screening/bbksda/bbksda-ticket-terms-screenshot.jpeg',
    alt: '',
    caption: '',
    group: 'uncertain',
    recommendedPath: 'uncertain/01-bbksda-ticket-terms-screenshot.jpeg',
  },
];

// ── All groups flat summary (for iteration / sitemap use) ─────────────────────
export const ALL_IMAGE_ASSETS: ImageAsset[] = [
  ...BRAND_IDENTITY,
  ...CREW_PORTRAITS,
  ...CREW_CREDENTIALS,
  ...FIELD_OPERATIONS,
  ...FOUNDER_LEADERSHIP,
  FOUNDER_WITH_GUESTS_STEFAN_LOOSE,
  ...HEALTH_SCREENING,
  ...HISTORY_HERITAGE,
  ...LEGAL_BUSINESS_IDENTITY,
  ...LEGAL_MEMBERSHIP,
  ...LEGAL_TOURISM_LICENSE,
  ...PARTNER_VALIDATION,
  ...POLICE_AUTHORITY_DOCUMENTS,
  ...PRESS_MENTIONS,
  ...UNCERTAIN,
];
