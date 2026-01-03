// FIX: Populated constants with data for various sections of the application.
// FIX: Added 'Badge' to the import from './types'
import { HeroCopy, SectionCopy, FoundersMissionCopy, FAQ, Guide, CommunityPartner, Badge, ContactInfo } from '@/types';

export const proofLinks = {
    ahuProfile: "https://ahu.go.id/sabh/perseroan/qrcode/?kode=NDAyMzAyMDYzNTEwMjE3NF8yXzA4IEZlYnJ1YXJpIDIwMjNfMDggRmVicnVhcmkgMjAyMw==",
    nibPdf: "https://javavolcano-touroperator.com/legal/NIB-1102230032918.pdf",
    tdupPdf: "https://javavolcano-touroperator.com/legal/TDUP-1102230032918.pdf",
    officeMaps: "https://www.google.com/maps?cid=1266403973589689021",
    indecon: "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator/",
    isic: "https://javavolcano-touroperator.com/isic/student-package",
    trustpilot: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
    tripadvisor: "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
    googleMaps: "https://www.google.com/maps?cid=1266403973589689021",
    hpwkiPdf: "https://javavolcano-touroperator.com/legal/HPWKI-approval.pdf",
    sprinWalTravelPdf: "https://javavolcano-touroperator.com/legal/SPRIN-WAL-TRAVEL-2024-02-12.pdf",
    sprinPolparPdf: "https://javavolcano-touroperator.com/legal/SPRIN-POLPAR.pdf"
};


export const heroCopy: HeroCopy = {
  kicker: 'Private, all-inclusive Bromo, Ijen & Tumpak Sewu routes',
  title: 'Tourist Police-Led Private Volcano Tours in East Java',
  subhead: 'Java Volcano Tour Operator (JVTO) is a registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer. We design private, all-inclusive itineraries to Mount Bromo, Ijen Crater and Tumpak Sewu with clear safety rules, transparent pricing and real local impact.',
  ctaPrimary: 'Browse Private Tours ',
  ctaSecondary: 'Plan My Tour',
};

export const foundersMissionCopy: FoundersMissionCopy = {
  overline: "OUR FOUNDER & MISSION",
  title: "Our mission is to deliver the **safest** adventures in East Java.",
  text: "Founded and led by Agung “Mr. Sam” Sambuko, an on-duty tourism police officer in East Java and Supervisor at the Ijen Special Tourism Actors Association (HPWKI). (Operator-verified, last confirmed: October 2025).",
  cta: "Learn Our Story",
  imageUrl: "https://javavolcano-touroperator.com/founder/mr-sam-tourist-police-portrait.png"
};

export const pillarsOfTrust = [
  {
    icon: 'local_police',
    title: 'Licensed & Police-Led',
    description: 'Founded and led by an active Tourist Police officer, JVTO builds tours around real regulations, verified partners, and clear emergency procedures.',
    link: '/why-jvto/the-jvto-difference',
    cta: 'Learn More'
  },
  {
    icon: 'checklist',
    title: 'Transparent & All-Inclusive',
    description: 'Private vehicles, permits, Bromo jeep, Ijen health screening, all breakfasts, key meals, water and tour T-shirt are clearly listed in every program.',
    link: '/tours',
    cta: 'See Tours'
  },
    {
    icon: 'school',
    title: 'Community-Accountable',
    description: 'Local guides from the Ijen–Bromo region, sustainable practices with Indecon, and ISIC benefits for international students facing higher park fees.',
    link: '/why-jvto/community-standards',
    cta: 'Our Impact'
  }
];

export const toursSectionCopy: SectionCopy = {
  overline: 'Featured Private Tours',
  title: 'Unforgettable Journeys in East Java',
  subhead: 'Our most popular private, all-inclusive volcano tours. Prices are shown at checkout—with tickets, jeeps and key services included, so there are no surprises later.'
};

export const destinationsSectionCopy: SectionCopy = {
  overline: 'Explore Our World',
  title: 'Iconic Destinations of East Java',
  subhead: 'From otherworldly volcanoes to hidden waterfalls, discover the breathtaking landscapes that make our tours unforgettable.'
};

export const reviewsCopy: SectionCopy = {
    overline: 'Testimonials',
    title: 'What Our Adventurers Say',
    subhead: 'We\'re proud of our 5-star rating across multiple platforms. Read reviews from travelers who have experienced East Java with us.'
};

export const galleryCopy: SectionCopy = {
    overline: 'Visual Stories',
    title: 'Captured Moments from Our Tours',
    subhead: 'A glimpse into the stunning landscapes and unforgettable experiences that await you in East Java.'
};

export const communityPartnershipsCopy: SectionCopy = {
    overline: 'Community & Partnerships',
    title: 'Local guides, local opportunity, creating careers.',
    subhead: 'Many young people around Ijen lack stable work or access to university. JVTO trains and employs local youth as professional guides and crew, pairing local knowledge with safety standards. Your trip supports real careers in the communities you visit today.'
};

export const communityPartners: CommunityPartner[] = [
    {
        icon: 'groups',
        title: 'Local Guides ("local boys")',
        description: 'Your trip is led by trained locals. We invest in skills, safety, and careers.',
        cta: 'Meet the team',
        link: '/why-jvto/our-team',
        isExternal: false,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    },
    {
        icon: 'gavel',
        title: 'HPWKI Governance',
        description: 'Founder serves as Supervisor (Pengawas) at HPWKI, formalized by the Ministry of Law & Human Rights.',
        cta: 'View Approval',
        link: proofLinks.hpwkiPdf, 
        isExternal: true,
        imageUrl: 'https://images.unsplash.com/photo-1589216532372-1c2a36790049?q=80&w=400&auto=format&fit=crop',
    },
    {
        icon: 'school',
        title: 'ISIC Student Access',
        description: 'Verified ISIC cardholders get fair student pricing on select packages.',
        cta: 'Learn More',
        link: '/isic/student-package',
        isExternal: false,
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&auto=format&fit=crop',
    },
    {
        icon: 'eco',
        title: 'Indecon Network',
        description: 'Listed in Indecon’s sustainable tourism spotlight.',
        cta: 'Indecon profile',
        link: proofLinks.indecon,
        isExternal: true,
        imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=400&auto=format&fit=crop',
    }
];

export const inclusions = {
    included: [
        "Park fees & permits",
        "Private transport & driver",
        "Licensed local guide",
        "Safety gear: gas mask, trekking pole",
        "Unlimited mineral water",
        "Travel T-shirts",
        "Extra meals beyond breakfast (per itinerary)",
        "Ijen health certificate (cost included & arranged)",
    ],
    optional: [
        "Traffic Police escorts",
        "Travel insurance"
    ]
};

export const miniFaqs: FAQ[] = [
    { question: "Can I cancel or reschedule?", answer: "Yes. Cancel ≥48 hours before Day 1 for 100% JVTO Travel Credit (no expiry, transferable). Cancel <48 hours before Day 1 means the payment is forfeited. There are no cash refunds. One free reschedule is allowed if requested >48 hours before Day 1." },
    { question: "Is the Ijen medical test included?", answer: "Yes. A health certificate is mandatory by local law to hike Ijen. JVTO arranges this for you and the cost is included in all our Ijen tour packages. No extra payment is required on the spot." },
    { question: "Are your tours private or shared?", answer: "All JVTO tours are 100% private. You will have your own vehicle, driver, and guide dedicated only to your group for a more personal and flexible experience." },
    { question: "What is included in the price?", answer: "All core costs: private transport, accommodation with breakfast, all entrance fees, Bromo 4WD jeep, Ijen health screening & gear, bottled water, and a JVTO T-shirt. No surprise 'local payments' are required." },
    { question: "What happens if a volcano is closed?", answer: "If a destination is closed for safety (e.g., volcanic activity), we run an alternative-route SOP (Standard Operating Procedure) with other activities like waterfalls or cultural sites. We will brief you on the alternative plan. You will not be left without a program." },
];

export const faqsCopy: SectionCopy = {
  overline: 'Got Questions?',
  title: 'Frequently Asked Questions',
  subhead: 'Find quick answers to common questions about our tours, booking process, and what to expect.'
};

export const faqs: FAQ[] = [
  // --- Booking & Policy ---
  {
    question: 'How do I book a tour?',
    answer: 'You can book directly on our website. Select your tour, date, and group size, then proceed to the secure checkout to pay the 20% deposit. You will receive an Official E-Voucher to confirm your booking. The remaining balance is due before the tour starts.'
  },
  {
    question: 'What is your cancellation and reschedule policy?',
    answer: "Cancellations made more than 48 hours before Day 1 pickup receive 100% of the amount paid as JVTO Travel Credit. This credit never expires and can be transferred. Cancellations within 48 hours of Day 1 result in forfeiture of payment. We do not provide cash refunds. One free reschedule is permitted if requested more than 48 hours before Day 1, subject to availability."
  },
  {
    question: 'Are your tours private or shared?',
    answer: 'All our tours are private. This means you will have your own private car, driver, and guide for your group. This allows for a more personalized and flexible experience, so we can cater to your specific interests and pace.'
  },
  // --- On the Tour ---
  {
    question: 'What should I pack for a Bromo and Ijen tour?',
    answer: 'Pack warm layers, as temperatures can be near freezing (0-10°C / 32-50°F). A warm jacket, hat, and gloves are essential. Also bring comfortable hiking shoes, sunglasses, sunscreen, and a personal flashlight or headlamp (though we provide one). For waterfall treks, water shoes are recommended.'
  },
  {
    question: 'Is the Ijen medical check included?',
    answer: 'Yes. A health certificate is mandatory by local law to hike Ijen. JVTO arranges this for you and the cost is included in all our Ijen tour packages. A licensed nurse will perform the check at your hotel. No extra payment is required on the spot.'
  },
  {
    question: 'Are meals included in the tour?',
    answer: 'Our packages always include breakfast at the hotel. Other meals (lunch and dinner) are generally not included unless specifically stated in your itinerary. This gives you the flexibility to explore local food. Your guide will recommend good, clean local restaurants.'
  },
  {
    question: 'Do I need to bring cash (IDR)?',
    answer: 'Yes, we highly recommend it. While the tour is all-inclusive for major items, you will need Indonesian Rupiah (IDR) for personal expenses like meals not listed in the itinerary, optional horse riding at Bromo, souvenirs, and tips for your guide and driver.'
  },
  {
    question: 'Is it safe for a solo traveler?',
    answer: 'Absolutely. Safety is our top priority. All our tours are private, meaning you will have a dedicated, professional driver and guide. Our crew is respectful and trained to provide a safe and comfortable experience for all guests, including solo travelers.'
  },
];

export const guides: Guide[] = [
    {
        id: 3,
        name: 'Agung Sambuko (Mr. Sam)',
        bio: 'As an active Tourist Police officer and JVTO\'s founder, Mr. Sam built the company on a promise of safety, integrity, and authentic local experience.',
        imageUrl: 'https://legacy.javavolcano-touroperator.com/assets/img/pages/about/agung-sambuko.jpg',
        specialties: ['Founder', 'Safety Leadership', 'Local Expertise']
    },
    {
        id: 1,
        name: 'Kiki',
        bio: 'Praised by travelers for his deep knowledge and caring attitude, Kiki is an expert guide for Ijen and Bromo. His fluency in English and passion for photography ensure a memorable and well-documented adventure.',
        imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop',
        specialties: ['Lead Guide', 'Ijen Specialist', 'Photography']
    },
    {
        id: 2,
        name: 'Gufran',
        bio: 'Gufran is a highly knowledgeable and attentive guide, known for ensuring guest safety on challenging hikes and finding the best spots for photos. Travelers appreciate his friendly demeanor and organized approach.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        specialties: ['Senior Guide', 'Bromo & Ijen', 'Guest Safety']
    },
    {
        id: 4,
        name: 'Yandi',
        bio: 'Yandi is a reliable and friendly driver-guide praised for his helpful briefings and encouragement on treks. His expertise ensures a smooth and enjoyable journey through East Java\'s diverse landscapes.',
        imageUrl: 'https://images.unsplash.com/photo-1547425260-76bc4c4006ae?q=80&w=400&auto=format&fit=crop',
        specialties: ['Driver-Guide', 'Logistics', 'Customer Care']
    }
];

// FIX: Added challengesCopy constant for use in the ChallengeBadges component.
export const challengesCopy: SectionCopy = {
  overline: 'Your Achievements',
  title: 'Challenge Badges',
  subhead: 'Track your progress and earn badges by completing tours and visiting key destinations across East Java.'
};

// FIX: Added badges constant with sample data for the ChallengeBadges component.
export const badges: Badge[] = [
    {
        name: 'Bromo Voyager',
        icon: 'volcano',
        iconBgColor: 'bg-orange-100 dark:bg-orange-900',
        iconTextColor: 'text-orange-500',
        progress: 100,
        progressBgColor: 'bg-orange-500',
    },
    {
        name: 'Ijen Pioneer',
        icon: 'hiking',
        iconBgColor: 'bg-blue-100 dark:bg-blue-900',
        iconTextColor: 'text-blue-500',
        progress: 100,
        progressBgColor: 'bg-blue-500',
    },
    {
        name: 'Waterfall Wanderer',
        icon: 'waterfall',
        iconBgColor: 'bg-cyan-100 dark:bg-cyan-900',
        iconTextColor: 'text-cyan-500',
        progress: 75,
        progressBgColor: 'bg-cyan-500',
    },
    {
        name: 'Java Explorer',
        icon: 'explore',
        iconBgColor: 'bg-green-100 dark:bg-green-900',
        iconTextColor: 'text-green-500',
        progress: 50,
        progressBgColor: 'bg-green-500',
    },
    {
        name: 'Culture Connoisseur',
        icon: 'museum',
        iconBgColor: 'bg-purple-100 dark:bg-purple-900',
        iconTextColor: 'text-purple-500',
        progress: 25,
        progressBgColor: 'bg-purple-500',
    },
    {
        name: 'East Java Master',
        icon: 'military_tech',
        iconBgColor: 'bg-yellow-100 dark:bg-yellow-900',
        iconTextColor: 'text-yellow-500',
        progress: 10,
        progressBgColor: 'bg-yellow-500',
    }
];

export const contactInfo: ContactInfo = {
  website: 'https://javavolcano-touroperator.com',
  email: 'hello@javavolcano-touroperator.com',
  whatsapp: '+62 822 4478 8833',
  whatsappLink: 'https://wa.me/6282244788833',
  officeAddress: 'Jl. Khairil Anwar No.102 A, Badean, Kec. Bondowoso, Kabupaten Bondowoso, Jawa Timur 68214, Indonesia',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.815981775797!2d113.8085867750059!3d-7.913704292102875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6dce1d25a03db%3A0x11932bb44bf4e2bd!2sJava%20Volcano%20Tour%20Operator!5e0!3m2!1sen!2sid!4v1677656254780!5m2!1sen!2sid'
};