import type { QaPair } from '@/lib/tourFaqs';

// Canonical Q&A for /travel-guide/weather-and-closures.
// Registered 2026-07 (W3g design-reference restyle sprint) — previously this route had
// no canonical-hardcoded FAQ registered, so it fell through to CMS content.faq (empty
// without a DB row). This file promotes it to source 2 (canonical) per resolveFaqs.ts
// precedence, and folds in the Rijik monthly-closure fact (see also the dedicated
// /travel-guide/rijik-monthly-closure page and RIJIK_FAQS) so the fact surfaces on both
// the deep-dive page and the general weather/closures hub.
export const WEATHER_AND_CLOSURES_FAQS: QaPair[] = [
  {
    question: 'What triggers a closure at Bromo, Ijen, or Tumpak Sewu?',
    answer:
      'JVTO follows official PVMBG (Indonesian volcanology agency) alerts without exception — if PVMBG raises the alert status for Bromo or Ijen, we do not enter the restricted zone. Other closure triggers include heavy rainfall causing flash-flood risk at Tumpak Sewu, and scheduled conservation or cultural closures known in advance.',
  },
  {
    question: 'Does Kawah Ijen close on a regular schedule?',
    answer:
      'Yes. Since March 2019, TWA Ijen has closed to all visitors on the first Friday of every month for "Rijik" — a scheduled cleanup day when volunteers remove an estimated 100–150 kg of trash from the crater area. This is a fixed conservation closure, separate from unscheduled PVMBG volcanic-activity closures. JVTO checks this calendar before confirming Ijen-inclusive itineraries so guests are never caught out by it. Read more: Rijik monthly closure.',
  },
  {
    question: 'Does JVTO cancel tours automatically during rainy season?',
    answer:
      'No. JVTO operates year-round and rainy season is not an automatic cancellation trigger. Go/no-go decisions are based on real-time BMKG (weather) and PVMBG (volcanic activity) data reviewed the evening before each tour, not a blanket seasonal rule.',
  },
  {
    question: 'What happens to my booking if part of the tour is closed?',
    answer:
      'If a primary site is closed, JVTO substitutes a comparable same-day alternative where possible — for example, a closed Ijen may be replaced with Bromo and Madakaripura. Where a closure makes the program unworkable, JVTO reschedules the affected portion or issues JVTO Package Credit per the Booking, Payment & Cancellation Policy. Cash refunds are not standard practice; cancellations convert to Lifetime Package Credit.',
  },
  {
    question: 'When is the best season for reliable weather at Bromo and Ijen?',
    answer:
      'Dry season, roughly April through October, offers the most reliable conditions for clear Bromo sunrises and Ijen night hikes. Wet season (November–March) does not stop tours — JVTO continues to monitor conditions and adjust itineraries based on real-time forecasts rather than the calendar alone.',
  },
];
