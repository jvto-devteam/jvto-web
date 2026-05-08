import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Link from "next/link";
import { type Metadata } from "next";
import {
  ShieldCheck,
  BookOpen,
  Star,
  Users,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Search,
  MessageCircleQuestion,
  ShieldAlert,
  Scale,
  Mountain,
  Handshake,
  Lock,
  ExternalLink,
  FileDigit,
  ChevronRight,
  Award,
  Quote,
  Fingerprint,
  Newspaper,
} from "lucide-react";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import SidebarDesktop from "./SidebarDesktop";
const siteUrl = "https://javavolcano-touroperator.com";

const defaultWhyTitle = "Why Choose Java Volcano Tour Operator";
const defaultWhyDescription =
  "Why travellers choose JVTO for private Bromo, Ijen and Tumpak Sewu tours: tourist police-led safety culture, registered Indonesian travel company, real health screening, local guides and transparent policies.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageSnapshot("/why-jvto", {
    allowDatabaseFallback: false,
  });
  const title = page.snapshot.seo.title;
  const description = page.snapshot.seo.description ?? defaultWhyDescription;
  const h1 =
    typeof page.snapshot.content.h1 === "string"
      ? page.snapshot.content.h1
      : "Why JVTO";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/why-jvto`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: siteUrl + "/assets/img/og/why-jvto.webp",
          width: 1200,
          height: 630,
          alt: h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteUrl + "/assets/img/og/why-jvto.webp"],
    },
  };
}

const trustStackCards = [
  {
    icon: ShieldAlert,
    title: "Safety Leadership & The JVTO Difference",
    desc: "Police-led safety mindset, documented operational discipline, and proof you can verify.",
    href: "/why-jvto/the-jvto-difference",
  },
  {
    icon: Scale,
    title: "Our Story: Roots Since 2015",
    desc: "Booking.com award, Stefan Loose guidebook feature, and artifacts tracing our documented history.",
    href: "/why-jvto/our-story",
  },
  {
    icon: Mountain,
    title: "Our Team: Local Crew",
    desc: "A local operations team trained for real East Java logistics.",
    href: "/why-jvto/our-team",
  },
  {
    icon: Star,
    title: "Guest Reviews (Independent Platforms)",
    desc: "Independent reviews across Tripadvisor, Trustpilot, Google, ISIC and Indecon.",
    href: "/why-jvto/reviews",
  },
  {
    icon: Handshake,
    title: "Community Standards & Partners",
    desc: "HPWKI, ISIC, INDECON partnerships plus operational ethics and cancellation rules.",
    href: "/why-jvto/community-standards",
  },
  {
    icon: Search,
    title: "Verify JVTO",
    desc: "Legal docs, safety docs, press, and history artifacts—organized for easy checking.",
    href: "/verify-jvto",
  },
];

const faqItems = [
  {
    q: "Do you mix strangers into one car?",
    a: "No. JVTO runs private tours only.",
    link: "/travel-guide/booking-information",
    linkLabel: "Booking Information",
  },
  {
    q: "What if weather or closures change the plan?",
    a: "We adapt early and communicate clearly.",
    link: "/why-jvto/the-jvto-difference",
    linkLabel: "Safety Approach",
    link2: "/travel-guide",
    linkLabel2: "Practical Rules",
  },
  {
    q: "Where can I verify legality and proof?",
    a: "Everything is organized in our Proof Library.",
    link: "/why-jvto/the-jvto-difference",
    linkLabel: "Proof Library",
  },
  {
    q: "Where are your booking/payment terms?",
    a: "Full terms are on the booking & payment policy page.",
    link: "/policy/booking-payment-cancellation",
    linkLabel: "Booking & Payment Policy",
  },
  {
    q: "How do you handle personal data?",
    a: "All data handling is documented in our privacy policy.",
    link: "/policy/privacy",
    linkLabel: "Privacy Policy",
  },
];

const proofDocs = [
  {
    title: "NIB Entity",
    img: `${siteUrl}/legal/NIB-1102230032918-preview.webp`,
    hash: "FA20DDE3...",
  },
  {
    title: "Police SPRIN",
    img: `${siteUrl}/legal/SPRIN-POLPAR.webp`,
    hash: "03C8578D...",
  },
  {
    title: "Health Screening",
    img: `${siteUrl}/screening/ijen-screening-hotel-01.webp`,
    hash: "C52194BB...",
  },
  {
    title: "HPWKI License",
    img: `${siteUrl}/uploads/1763205255605-141795118-kiki.webp`,
    hash: "CA1FB1A4...",
  },
];

export default async function WhyJvtoPage() {
  const page = await getPublicPageSnapshot("/why-jvto", {
    allowDatabaseFallback: false,
  });
  const heroH1 =
    typeof page.snapshot.content.h1 === "string"
      ? page.snapshot.content.h1
      : defaultWhyTitle;
  const whyJVTOSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": "https://javavolcano-touroperator.com/#organization",
        name: "Java Volcano Tour Operator (JVTO)",
        alternateName: "JVTO",
        url: "https://javavolcano-touroperator.com",
        description:
          "Registered Indonesian travel company based in Bondowoso and led by an active Tourist Police officer.",
        logo: "https://javavolcano-touroperator.com/assets/img/jvto-logo.png",
        image: [
          siteUrl + "/assets/img/jvto-logo.png",
          siteUrl + "/assets/img/hero/home.webp",
        ],
        email: "hello@javavolcano-touroperator.com",
        telephone: "+62 822-4478-8833",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Jl. Khairil Anwar No.102 A, Badean, Kec. Bondowoso, Kabupaten Bondowoso, Jawa Timur 68214",
          postalCode: "68214",
          addressLocality: "Bondowoso",
          addressRegion: "East Java",
          addressCountry: "ID",
        },
        areaServed: [
          { "@type": "AdministrativeArea", name: "East Java" },
          { "@type": "Country", name: "Indonesia" },
          { "@type": "City", name: "Surabaya" },
          { "@type": "Place", name: "Bali" },
        ],
        identifier: [
          {
            "@type": "PropertyValue",
            name: "Business and tourism licence number",
            value: "1102230032918",
          },
        ],
        sameAs: [
          "https://maps.app.goo.gl/Hw9NjJdSRTuwWj6HA",
          "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
          "https://www.trustpilot.com/review/javavolcano-touroperator.com",
        ],
        founder: {
          "@type": "Person",
          name: "Agung Sambuko",
          alternateName: "Mr. Sam",
          jobTitle: "Tourist Police Officer",
          image:
            "https://javavolcano-touroperator.com/founder/mr-sam-tourist-police-portrait.png",
          description:
            "Founder of JVTO and active member of the East Java Tourist Police Unit (Ditpamobvit).",
          memberOf: {
            "@type": "GovernmentOrganization",
            name: "Indonesian National Police",
            subOrganization: {
              "@type": "GovernmentOrganization",
              name: "Ditpamobvit (Directorate of Vital Object Security)",
            },
            sameAs: [
              "https://www.wikidata.org/wiki/Q3103954",
              "https://polri.go.id/",
            ],
          },
          knowsAbout: [
            "TouristSafety",
            "EastJavaTourism",
            "VolcanoTrekking",
            "LogisticsManagement",
          ],
        },
        priceRange: "IDR 1.000.000 - IDR 9.050.000",
        geo: {
          "@type": "GeoCoordinates",
          latitude: -7.9161788,
          longitude: 113.8085868,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+62 822-4478-8833",
            email: "hello@javavolcano-touroperator.com",
            contactType: "customer support",
          },
        ],
        foundingDate: "2016-01-01",
        currenciesAccepted: "IDR",
        paymentAccepted: ["Credit Card", "Bank Transfer"],
      },
      {
        "@type": "WebSite",
        "@id": "https://javavolcano-touroperator.com/#website",
        url: "https://javavolcano-touroperator.com",
        name: "Java Volcano Tour Operator",
        inLanguage: "en",
        publisher: {
          "@id": "https://javavolcano-touroperator.com/#organization",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://javavolcano-touroperator.com/why-jvto#webpage",
        url: "https://javavolcano-touroperator.com/why-jvto",
        name: "Why Choose Java Volcano Tour Operator",
        inLanguage: "en",
        isPartOf: { "@id": "https://javavolcano-touroperator.com/#website" },
        about: { "@id": "https://javavolcano-touroperator.com/#organization" },
        breadcrumb: {
          "@id": "https://javavolcano-touroperator.com/why-jvto#breadcrumb",
        },
        datePublished: "2025-12-05",
        dateModified: "2025-12-05",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://javavolcano-touroperator.com/why-jvto#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://javavolcano-touroperator.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Why Choose Java Volcano Tour Operator",
            item: "https://javavolcano-touroperator.com/why-jvto",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://javavolcano-touroperator.com/why-jvto#faq",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <style>{`
        :root {
          --brand: #9fce33;
          --brand-dark: #7aaa1a;
          --brand-dim: rgba(159,206,51,0.12);
          --brand-border: rgba(159,206,51,0.30);
          --ink: #0c0e09;
          --ink-mid: #1a1e12;
          --ink-soft: #2a3020;
          --text-muted: #6b7a55;
          --text-faint: #4a5535;
          --surface: #f5f7f0;
          --surface-2: #edf0e6;
          --card-bg: #ffffff;
          --border: #dde3d0;
        }

        // @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

        .jvto-page { font-family: 'DM Sans', sans-serif; }
        .jvto-page h1, .jvto-page h2, .jvto-page h3 { //font-family: 'Syne', sans-serif; }
        .jvto-page .mono { font-family: 'JetBrains Mono', monospace; }

        /* ── Hero ── */
        .hero-section {
          position: relative;
          background: var(--ink);
          color: #fff;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
        }
        .hero-bg img {
          width: 100%; height: 100%; object-fit: cover;
          opacity: 0.15; filter: grayscale(100%) contrast(1.1);
        }
        .hero-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(12,14,9,0.3) 0%, rgba(12,14,9,0.85) 60%, #0c0e09 100%);
        }
        .hero-noise {
          position: absolute; inset: 0; z-index: 1; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 128px 128px;
        }
        .hero-grid-line {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image: linear-gradient(rgba(159,206,51,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(159,206,51,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .hero-inner {
          position: relative; z-index: 10;
          max-width: 1200px; margin: 0 auto; padding: 5rem 2rem 4rem;
        }
        @media (min-width: 1024px) { .hero-inner { padding: 7rem 2rem 5rem; } }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.35rem 0.9rem; border-radius: 999px;
          background: rgba(159,206,51,0.12); border: 1px solid rgba(159,206,51,0.35);
          color: var(--brand); font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 1.75rem;
        }
        .hero-h1 {
          font-size: clamp(2.4rem, 6vw, 5.5rem);
          font-weight: 800; line-height: 1.02;
          letter-spacing: -0.03em; margin-bottom: 1.5rem;
        }
        .hero-h1 span {
          background: linear-gradient(95deg, var(--brand) 0%, #c8e86a 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-lede {
          max-width: 600px; color: rgba(255,255,255,0.6);
          line-height: 1.7; font-size: 1.05rem; margin-bottom: 0.75rem;
        }
        .hero-lede strong { color: rgba(255,255,255,0.9); font-weight: 500; }
        .hero-contacts {
          font-size: 0.78rem; color: rgba(255,255,255,0.35); margin-bottom: 2.5rem;
          display: flex; flex-wrap: wrap; gap: 0.5rem 1.25rem;
        }
        .hero-contacts a { color: var(--brand); text-decoration: none; }
        .hero-contacts a:hover { text-decoration: underline; }

        .hero-ctas { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 3.5rem; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.85rem 1.75rem; border-radius: 0.75rem; font-weight: 700;
          //font-family: 'Syne', sans-serif; 
          font-size: 0.9rem;
          background: var(--brand); color: var(--ink);
          border: none; cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(159,206,51,0.35);
        }
        .btn-primary:hover { background: #b2de3d; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(159,206,51,0.45); }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.85rem 1.75rem; border-radius: 0.75rem; font-weight: 700;
          // font-family: 'Syne', sans-serif; 
          font-size: 0.9rem;
          background: transparent; color: #fff;
          border: 1px solid rgba(255,255,255,0.18); cursor: pointer; text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.35); }

        /* Trust bar */
        .trust-bar {
          border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(0,0,0,0.35); backdrop-filter: blur(12px);
          padding: 1.25rem 2rem;
        }
        .trust-bar-inner { max-width: 1200px; margin: 0 auto; }
        .trust-bar-label {
          text-align: center; font-size: 0.62rem; color: rgba(255,255,255,0.2);
          text-transform: uppercase; letter-spacing: 0.15em;
          font-family: 'JetBrains Mono', monospace; margin-bottom: 1rem;
        }
        .trust-bar-items {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem 3rem;
          opacity: 0.45; transition: opacity 0.4s;
        }
        .trust-bar-items:hover { opacity: 1; }
        .trust-bar-item { display: flex; align-items: center; gap: 0.45rem; color: #fff; font-weight: 700; font-size: 0.85rem; }

        /* ── Section shared ── */
        .section-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .section-header { text-align: center; margin-bottom: 3.5rem; }
        .section-eyebrow {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.14em; color: var(--brand);
          font-family: 'JetBrains Mono', monospace; margin-bottom: 0.75rem;
        }
        .section-h2 { font-size: clamp(1.6rem, 3vw, 2.5rem); font-weight: 800; letter-spacing: -0.02em; color: var(--ink); margin-bottom: 0.75rem; }
        .section-sub { color: var(--text-muted); font-size: 1rem; max-width: 520px; margin: 0 auto; line-height: 1.65; }

        /* ── Trust Stack ── */
        .trust-stack-section { padding: 6rem 0; background: var(--surface); }
        .trust-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
        @media (min-width: 640px) { .trust-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .trust-grid { grid-template-columns: repeat(3, 1fr); } }

        .trust-card {
          background: var(--card-bg); border: 1px solid var(--border); border-radius: 1.25rem;
          padding: 1.75rem; text-decoration: none; color: inherit; display: block;
          transition: box-shadow 0.25s, border-color 0.25s, transform 0.2s;
          position: relative; overflow: hidden;
        }
        .trust-card::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          background: linear-gradient(135deg, var(--brand-dim) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .trust-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.1); border-color: var(--brand-border); transform: translateY(-2px); }
        .trust-card:hover::before { opacity: 1; }

        .trust-card-icon {
          width: 3rem; height: 3rem; border-radius: 0.75rem;
          background: var(--ink); display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem; transition: background 0.25s;
        }
        .trust-card:hover .trust-card-icon { background: var(--brand); }
        .trust-card-icon svg { width: 1.4rem; height: 1.4rem; color: var(--brand); transition: color 0.25s; }
        .trust-card:hover .trust-card-icon svg { color: var(--ink); }

        .trust-card-title {
          // font-family: 'Syne', sans-serif; 
          font-size: 0.95rem; font-weight: 700;
          color: var(--ink); margin-bottom: 0.5rem; line-height: 1.35;
          transition: color 0.2s;
        }
        .trust-card:hover .trust-card-title { color: var(--brand-dark); }
        .trust-card-desc { font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem; }
        .trust-card-cta {
          display: flex; align-items: center; gap: 0.3rem; font-size: 0.78rem;
          font-weight: 700; color: var(--brand-dark); 
          // font-family: 'Syne', sans-serif;
          letter-spacing: 0.02em; transition: gap 0.2s;
        }
        .trust-card:hover .trust-card-cta { gap: 0.5rem; }

        /* ── Press Section ── */
        .press-section {
          background: var(--ink); color: #fff;
          padding: 6rem 0; border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative; overflow: hidden;
        }
        .press-section::before {
          content: ''; position: absolute; top: 0; right: 0;
          width: 40%; height: 100%;
          background: radial-gradient(ellipse at top right, rgba(159,206,51,0.06), transparent 60%);
          pointer-events: none;
        }
        .press-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: center; }
        @media (min-width: 1024px) { .press-grid { grid-template-columns: 5fr 7fr; } }

        .press-eyebrow { display: flex; align-items: center; gap: 0.4rem; color: var(--brand); font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; font-family: 'JetBrains Mono', monospace; margin-bottom: 1.25rem; }
        .press-h2 { font-size: clamp(2rem, 4vw, 3.25rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.025em; margin-bottom: 1.25rem; }
        .press-body { color: rgba(255,255,255,0.5); line-height: 1.75; margin-bottom: 2rem; font-size: 0.95rem; }

        .press-quote {
          position: relative; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09); border-left: 3px solid var(--brand);
          border-radius: 0.875rem; padding: 1.5rem; margin-bottom: 2rem;
        }
        .press-quote-icon { position: absolute; top: 1rem; right: 1.25rem; opacity: 0.15; }
        .press-quote p { color: rgba(255,255,255,0.85); font-style: italic; font-size: 0.95rem; line-height: 1.7; margin-bottom: 0.75rem; }
        .press-quote footer { font-size: 0.65rem; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: 0.12em; font-family: 'JetBrains Mono', monospace; }

        .btn-outline-brand {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.8rem 1.5rem; border-radius: 0.75rem; font-weight: 700;
          // font-family: 'Syne', sans-serif; 
          font-size: 0.875rem;
          background: transparent; color: var(--brand);
          border: 1.5px solid var(--brand); cursor: pointer; text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .btn-outline-brand:hover { background: var(--brand); color: var(--ink); }

        /* Browser mockup */
        .browser-stack { position: relative; }
        .browser-frame {
          background: #1a1e12; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.875rem; overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.6);
        }
        .browser-frame.main { position: relative; z-index: 20; transform: rotate(-1.5deg); transition: transform 0.5s; }
        .browser-frame.main:hover { transform: rotate(0deg); }
        .browser-frame.back {
          position: absolute; bottom: -2.5rem; right: -2rem;
          width: 72%; z-index: 10; transform: rotate(2.5deg);
          opacity: 0.7; transition: opacity 0.3s, z-index 0s;
        }
        .browser-frame.back:hover { opacity: 1; z-index: 30; }
        .browser-bar {
          background: #0c0e09; padding: 0.6rem 1rem;
          display: flex; align-items: center; gap: 0.625rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .browser-dots { display: flex; gap: 0.35rem; }
        .browser-dots span { width: 0.625rem; height: 0.625rem; border-radius: 50%; display: block; }
        .browser-url {
          flex: 1; background: #1a1e12; border-radius: 0.3rem;
          padding: 0.2rem 0.6rem; font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem; color: rgba(255,255,255,0.35); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .browser-img { width: 100%; height: auto; display: block; opacity: 0.85; transition: opacity 0.3s; }
        .browser-frame:hover .browser-img { opacity: 1; }
        .browser-footer {
          background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
          padding: 0.4rem 0.875rem;
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .browser-hash { display: flex; align-items: center; gap: 0.3rem; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: rgba(255,255,255,0.3); }
        .browser-date { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; background: rgba(159,206,51,0.12); color: var(--brand); padding: 0.15rem 0.5rem; border-radius: 0.25rem; }

        /* ── Verify Section ── */
        .verify-section { padding: 5rem 0; background: var(--card-bg); }
        .verify-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: start; }
        @media (min-width: 1024px) { .verify-grid { grid-template-columns: 5fr 7fr; } }
        .verify-h2 { font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 800; letter-spacing: -0.02em; color: var(--ink); margin-bottom: 0.875rem; }
        .verify-body { color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; }
        .verify-links { display: flex; flex-direction: column; gap: 0.625rem; }
        .verify-link {
          display: flex; align-items: center; gap: 0.875rem;
          padding: 1rem 1.125rem; border-radius: 0.875rem;
          background: var(--surface); border: 1px solid var(--border);
          text-decoration: none; color: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .verify-link:hover { border-color: var(--brand-border); background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .verify-link-check { color: var(--brand); flex-shrink: 0; }
        .verify-link-text { flex: 1; }
        .verify-link-title { font-weight: 700; font-size: 0.85rem; color: var(--ink);
        // font-family: 'Syne', sans-serif; 
        display: block; }
        .verify-link-note { font-size: 0.75rem; color: var(--text-muted); }
        .verify-link-arrow { color: var(--text-muted); flex-shrink: 0; transition: transform 0.2s, color 0.2s; }
        .verify-link:hover .verify-link-arrow { transform: translateX(3px); color: var(--brand-dark); }

        /* ── Proof Locker ── */
        .proof-section { padding: 5rem 0; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .proof-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1.5rem; margin-bottom: 2.5rem; }
        .proof-h2 { font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 800; letter-spacing: -0.02em; color: var(--ink); margin-bottom: 0.5rem; }
        .proof-sub { color: var(--text-muted); font-size: 0.875rem; }
        .btn-sm-ghost {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.6rem 1.25rem; border-radius: 0.625rem; font-weight: 700;
          // font-family: 'Syne', sans-serif; 
          font-size: 0.78rem;
          background: var(--card-bg); border: 1px solid var(--border);
          color: var(--ink); text-decoration: none; white-space: nowrap;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .btn-sm-ghost:hover { border-color: var(--brand-border); box-shadow: 0 2px 12px rgba(0,0,0,0.08); }

        .proof-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        @media (min-width: 768px) { .proof-grid { grid-template-columns: repeat(4, 1fr); } }
        .proof-card {
          background: var(--card-bg); border: 1px solid var(--border); border-radius: 0.875rem;
          padding: 0.75rem; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.25s;
        }
        .proof-card:hover { border-color: var(--brand-border); box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
        .proof-img-wrap {
          background: var(--surface-2); border-radius: 0.5rem; overflow: hidden;
          height: 9rem; display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.75rem; position: relative; border: 1px solid var(--border);
        }
        @media (min-width: 768px) { .proof-img-wrap { height: 12rem; } }
        .proof-img-wrap img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; transition: opacity 0.25s, transform 0.3s; }
        .proof-card:hover .proof-img-wrap img { opacity: 1; transform: scale(1.03); }
        .proof-img-placeholder { position: absolute; color: #b0bca0; }
        .proof-title { 
        // font-family: 'Syne', sans-serif; 
        font-weight: 700; font-size: 0.8rem; color: var(--ink); margin-bottom: 0.3rem; }
        .proof-hash { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--text-muted); background: var(--surface); padding: 0.25rem 0.5rem; border-radius: 0.3rem; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* ── FAQ ── */
        .faq-section { padding: 6rem 0; background: var(--card-bg); }
        .faq-list { max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.875rem; }
        .faq-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: 1rem;
          padding: 1.5rem; display: flex; gap: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .faq-card:hover { background: #fff; border-color: var(--brand-border); box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .faq-icon-wrap {
          width: 2.5rem; height: 2.5rem; flex-shrink: 0; border-radius: 0.625rem;
          background: var(--brand); display: flex; align-items: center; justify-content: center;
        }
        .faq-icon-wrap svg { width: 1.1rem; height: 1.1rem; color: var(--ink); }
        .faq-q { 
        // font-family: 'Syne', sans-serif; 
        font-weight: 700; font-size: 0.9rem; color: var(--ink); margin-bottom: 0.375rem; }
        .faq-a { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.875rem; line-height: 1.6; }
        .faq-links { display: flex; flex-wrap: wrap; gap: 0.625rem; }
        .faq-link {
          display: inline-flex; align-items: center; gap: 0.3rem;
          font-size: 0.75rem; font-weight: 700; color: var(--brand-dark);
          text-decoration: none; 
          // font-family: 'Syne', sans-serif; 
          letter-spacing: 0.01em;
          transition: color 0.15s;
        }
        .faq-link:hover { color: var(--brand); }
        .faq-link svg { width: 0.8rem; height: 0.8rem; }

        /* ── Footer CTA ── */
        .footer-cta {
          background: var(--ink); color: #fff; padding: 5.5rem 2rem;
          border-top: 1px solid rgba(255,255,255,0.06); text-align: center;
          position: relative; overflow: hidden;
        }
        .footer-cta::before {
          content: ''; position: absolute;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(159,206,51,0.07), transparent 70%);
          pointer-events: none;
        }
        .footer-cta-inner { position: relative; z-index: 1; margin: 0 auto; }
        .footer-cta-h2 { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 800; letter-spacing: -0.025em; margin-bottom: 0.75rem; }
        .footer-cta-sub { color: rgba(255,255,255,0.4); font-size: 1rem; margin-bottom: 2.5rem; line-height: 1.6; }
        .footer-cta-btns { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; margin-bottom: 4rem; }
        .btn-dark {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.85rem 1.75rem; border-radius: 0.75rem; font-weight: 700;
          // font-family: 'Syne', sans-serif; 
          font-size: 0.9rem;
          background: rgba(255,255,255,0.07); color: #fff;
          border: 1px solid rgba(255,255,255,0.12); text-decoration: none;
          transition: background 0.2s;
        }
        .btn-dark:hover { background: rgba(255,255,255,0.12); }
        .footer-meta { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: rgba(255,255,255,0.18); border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.5rem; }
      `}</style>

      <div className="flex min-h-screen bg-background">
        <SidebarDesktop currentPath="/why-jvto" />
        <PageJsonLdCombined pageRow={page.pageRow} />

        <main className="pt-24 w-full jvto-page">
          {/* ══════════ HERO ══════════ */}
          <section className="hero-section">
            <div className="hero-bg">
              <img
                src={`${siteUrl}/assets/img/hero/home-optimized.webp`}
                alt="East Java volcano"
                decoding="async"
              />
              <div className="hero-bg-overlay" />
            </div>
            <div className="hero-noise" />
            <div className="hero-grid-line" />

            <div className="hero-inner">
              <div className="hero-badge">
                <ShieldCheck size={14} />
                Police-Led Expedition Standard
              </div>
              <h1 className="hero-h1">
                {heroH1}
              </h1>
              <p className="hero-lede">
                JVTO is a registered Indonesian tour operator based in
                Bondowoso, East Java. We specialize in private volcano
                trips—Bromo, Ijen, and selected extensions.
              </p>
              <p className="hero-lede">
                In a landscape where volcanic nature is uncertain, JVTO sells{" "}
                <strong>operational certainty</strong>—built on disciplined
                safety, documented proof, and local execution.
              </p>
              <div className="hero-contacts">
                <a
                  href="https://javavolcano-touroperator.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  javavolcano-touroperator.com
                </a>
                <span>·</span>
                <a
                  href="https://wa.me/6282244788833"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp +6282244788833
                </a>
                <span>·</span>
                <a href="mailto:hello@javavolcano-touroperator.com">
                  hello@javavolcano-touroperator.com
                </a>
              </div>
              <div className="hero-ctas">
                <Link href="/travel-guide" className="btn-primary">
                  <BookOpen size={17} /> Read Travel Guide
                </Link>
                <Link href="/verify-jvto" className="btn-ghost">
                  <Lock size={17} /> Verify Our Documents
                </Link>
              </div>
            </div>

            <div className="trust-bar">
              <div className="trust-bar-inner">
                <p className="trust-bar-label">
                  Audited across independent platforms &amp; recognized by
                  global bodies
                </p>
                <div className="trust-bar-items">
                  {[
                    { Icon: Star, label: "Trustpilot 4.8" },
                    { Icon: Award, label: "TripAdvisor 5.0" },
                    { Icon: CheckCircle2, label: "ISIC Partner" },
                    { Icon: ShieldCheck, label: "HPWKI Member" },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="trust-bar-item">
                      <Icon size={15} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══════════ TRUST STACK ══════════ */}
          <section id="trust-stack" className="trust-stack-section">
            <div className="section-inner">
              <div className="section-header">
                <div className="section-eyebrow">
                  <span>◆</span> Verification Registry
                </div>
                <h2 className="section-h2">The JVTO Trust Stack</h2>
                <p className="section-sub">
                  Navigate our proof library. Marketing promises are cheap;
                  operational discipline is verifiable.
                </p>
              </div>
              <div className="trust-grid">
                {trustStackCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <Link key={i} href={card.href} className="trust-card">
                      <div className="trust-card-icon">
                        <Icon />
                      </div>
                      <div className="trust-card-title">{card.title}</div>
                      <div className="trust-card-desc">{card.desc}</div>
                      <div className="trust-card-cta">
                        Explore Proof <ChevronRight size={14} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ══════════ ANSWER BLOCKS — 9 Narrative Claims ══════════ */}
          {/* AEO: visible crawlable Q&A from canonical narrative_claims — bridges schema ↔ copy gap */}
          <section
            id="9-verifiable-claims"
            className="bg-slate-950 border-t border-slate-800 py-16"
          >
            <div className="container mx-auto px-6">
              <div className="text-center mb-10">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-3">
                  Verifiable Claims — Not Marketing
                </p>
                <h2 className="text-white font-bold text-2xl md:text-3xl leading-snug">
                  9 Reasons, Each With a Proof Page
                </h2>
                <p className="text-slate-500 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
                  Every claim below links to the page where JVTO's evidence is concentrated.
                  No claim appears here without a corresponding verifiable source.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allClaims
                  .filter((c) => c.pillar && c.core_claim)
                  .map((claim, i) => {
                    const hooks = (claim.evidence_hooks as Array<{
                      type: string;
                      label: string;
                      route?: string;
                      url?: string;
                    }>) || [];
                    const pageLinks = hooks.filter((h) => h.type === "page" || h.type === "policy");
                    const primaryLink = pageLinks[0];
                    return (
                      <article
                        key={claim.id}
                        className="border border-slate-800 rounded-lg p-5 bg-slate-900/50 flex flex-col"
                        // data-* for AI crawlers to parse claim + answer programmatically
                        data-claim-id={claim.id}
                        data-claim-pillar={claim.pillar}
                      >
                        {/* Claim number + pillar */}
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-[9px] font-black text-jvto-green bg-jvto-green/10 px-1.5 py-0.5 rounded-sm shrink-0 mt-0.5">
                            {claim.id}
                          </span>
                          <h3 className="text-white text-sm font-bold leading-snug">
                            {claim.pillar}
                          </h3>
                        </div>

                        {/* Core claim answer */}
                        <p className="text-slate-400 text-xs leading-relaxed flex-1 mb-4">
                          {claim.core_claim as string}
                        </p>

                        {/* Evidence links */}
                        {primaryLink && (
                          <Link
                            href={primaryLink.route ?? "/why-jvto"}
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-jvto-green hover:text-white transition-colors uppercase tracking-widest mt-auto"
                          >
                            {primaryLink.label} →
                          </Link>
                        )}
                      </article>
                    );
                  })}
              </div>
            </div>
          </section>

          {/* ══════════ PRESS / MEDIA ══════════ */}
          <section className="press-section">
            <div className="section-inner">
              <div className="press-grid md:!grid !block">
                {/* Left */}
                <div>
                  <div className="press-eyebrow">
                    <Newspaper size={13} /> National Media Verification
                  </div>
                  <h2 className="press-h2">
                    Duty First,
                    <br />
                    Business Second.
                  </h2>
                  <p className="press-body">
                    Our commitment to safety isn't a company SOP. Our founder,
                    Bripka Agung Sambuko, was covered by national media
                    (Detik.com) for his dedication as a Tourist Police officer
                    keeping visitors safe in the extreme conditions of Kawah
                    Ijen.
                  </p>
                  <div className="press-quote">
                    <Quote size={36} className="press-quote-icon" />
                    <p>
                      "The important thing is that the people who travel are
                      safe."
                    </p>
                    <footer>— Bripka Agung Sambuko (Detik News)</footer>
                  </div>
                  <a
                    href="https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="btn-outline-brand"
                  >
                    Read Original Article <ExternalLink size={14} />
                  </a>
                </div>

                {/* Right: Browser mockups */}
                <div
                  className="browser-stack mt-5 md:mt-0"
                  style={{ paddingBottom: "3.5rem" }}
                >
                  <div className="browser-frame main">
                    <div className="browser-bar">
                      <div className="browser-dots">
                        <span style={{ background: "#ff5f57" }} />
                        <span style={{ background: "#febc2e" }} />
                        <span style={{ background: "#28c840" }} />
                      </div>
                      <div className="browser-url">
                        news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso...
                      </div>
                    </div>
                    <img
                      className="browser-img"
                      src={`${siteUrl}/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.webp`}
                      alt="Detik.com article screenshot"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="browser-footer">
                      <span className="browser-hash">
                        <Fingerprint size={11} /> SHA-256: B257B7...
                      </span>
                      <span className="browser-date">14 Mar 2021</span>
                    </div>
                  </div>

                  <div className="browser-frame back">
                    <div
                      className="browser-bar"
                      style={{ padding: "0.4rem 0.75rem" }}
                    >
                      <span className="browser-url" style={{ flex: 1 }}>
                        Radar Jember: Polpar Formation
                      </span>
                    </div>
                    <img
                      className="browser-img"
                      style={{
                        height: "10rem",
                        objectFit: "cover",
                        objectPosition: "top",
                      }}
                      src={`${siteUrl}/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.webp`}
                      alt="Radar Jember screenshot"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════ VERIFY IN 60s ══════════ */}
          <section
            id="how-to-verify-us-in-60-seconds"
            className="verify-section"
          >
            <div className="section-inner">
              <div className="verify-grid">
                <div>
                  <div
                    className="section-eyebrow"
                    style={{
                      justifyContent: "flex-start",
                      marginBottom: "0.875rem",
                    }}
                  >
                    <span>◆</span> Due Diligence
                  </div>
                  <h2 className="verify-h2">
                    How to verify us
                    <br />
                    in 60 seconds
                  </h2>
                  <p className="verify-body">
                    Open our Proof Library. Check the legal documents first,
                    then the safety and history artifacts. Everything is
                    organized for quick scanning—no guesswork required.
                  </p>
                </div>
                <div className="verify-links">
                  {[
                    {
                      label: "Start here: The JVTO Difference",
                      href: "/why-jvto/the-jvto-difference",
                      note: "Safety leadership overview & proof index",
                    },
                    {
                      label: "Quick checklist: How Proof Works",
                      href: "/why-jvto/the-jvto-difference#how-proof-works",
                      note: "Step-by-step verification guide",
                    },
                    {
                      label: "Full Proof Library",
                      href: "/verify-jvto",
                      note: "Legal docs, licenses, press, history",
                    },
                  ].map((item, i) => (
                    <Link key={i} href={item.href} className="verify-link">
                      <CheckCircle2 size={18} className="verify-link-check" />
                      <span className="verify-link-text">
                        <span className="verify-link-title">{item.label}</span>
                        <span className="verify-link-note">{item.note}</span>
                      </span>
                      <ArrowRight size={16} className="verify-link-arrow" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══════════ PROOF LOCKER ══════════ */}
          <section className="proof-section">
            <div className="section-inner">
              <div className="proof-header">
                <div>
                  <h2 className="proof-h2">Don't Guess. Verify.</h2>
                  <p className="proof-sub">
                    In an industry of ghost operators, we publish credentials
                    with cryptographic proofs.
                  </p>
                </div>
                <Link href="/verify-jvto" className="btn-sm-ghost">
                  <Lock size={14} /> Enter Proof Library
                </Link>
              </div>
              <div className="proof-grid">
                {proofDocs.map((doc, i) => (
                  <div key={i} className="proof-card">
                    <div className="proof-img-wrap">
                      <img
                        src={doc.img}
                        alt={doc.title}
                        loading="lazy"
                        decoding="async"
                      />
                      <FileDigit size={28} className="proof-img-placeholder" />
                    </div>
                    <div className="proof-title">{doc.title}</div>
                    <span className="proof-hash">SHA-256: {doc.hash}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════ FAQ ══════════ */}
          <section
            id="quick-answers-with-the-right-link"
            className="faq-section"
          >
            <div className="section-inner">
              <div className="section-header">
                <div className="section-eyebrow">
                  <span>◆</span> Quick Answers
                </div>
                <h2 className="section-h2">FAQ</h2>
                <p className="section-sub">
                  Short answers here. Full details live on the owner page or
                  policy page.
                </p>
              </div>
              <div className="faq-list">
                {faqItems.map((item, i) => (
                  <div key={i} className="faq-card">
                    <div className="faq-icon-wrap">
                      <MessageCircleQuestion />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="faq-q">{item.q}</div>
                      <div className="faq-a">{item.a}</div>
                      <div className="faq-links">
                        <Link href={item.link} className="faq-link">
                          {item.linkLabel} <ArrowRight />
                        </Link>
                        {item.link2 && (
                          <Link href={item.link2} className="faq-link">
                            {item.linkLabel2} <ArrowRight />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════ FOOTER CTA ══════════ */}
          <footer className="footer-cta">
            <div className="footer-cta-inner">
              <h2 className="footer-cta-h2">
                Ready for Operational Certainty?
              </h2>
              <p className="footer-cta-sub">
                Private tours. Verified credentials. Local execution.
              </p>
              <div className="footer-cta-btns">
                <Link
                  href="/travel-guide/booking-information"
                  className="btn-primary"
                >
                  How to Book <ArrowRight size={17} />
                </Link>
                <a
                  href="https://wa.me/6282244788833"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dark"
                >
                  WhatsApp Mr. Sam &amp; Team
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
