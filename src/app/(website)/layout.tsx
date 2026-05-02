import { Suspense } from "react";
// Pastikan path import komponen di bawah ini sesuai dengan struktur folder Anda
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import { contactInfo } from "@/constants";
import "./website.css";
import type { Metadata } from "next";
import { Providers } from "../providers";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  FOUNDER_SCHEMA,
  DOCTOR_SCHEMA,
  BBKSDA_REGULATION_SCHEMA,
  DEFINED_TERMS,
} from "@/lib/schemas/entityGraph";

// Fallback URL jika env tidak ada (penting untuk dev/preview)
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

export const metadata: Metadata = {
  // 1. MetadataBase sangat penting untuk mengubah link relative menjadi absolute secara otomatis
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "./",
  },

  // Open Graph global fallback (Akan dipakai jika halaman anak TIDAK mendefinisikan OG Image)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Java Volcano Tour Operator",
    images: [
      {
        url: "/assets/img/og/default.jpg", // Karena ada metadataBase, ini otomatis jadi absolute URL
        width: 1200,
        height: 630,
        alt: "Java Volcano Tour Operator - JVTO",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    // Gunakan full URL untuk aman di Twitter
    images: [`${siteUrl}/assets/img/og/default.jpg`],
  },

  icons: {
    icon: [
      "/assets/img/favicon/favicon.ico",
      "/assets/img/favicon/favicon-32x32.png",
      "/assets/img/favicon/favicon-16x16.png",
    ],
    apple: "/assets/img/favicon/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Global entity graph: Founder + Doctor + BBKSDA + 9 DefinedTerms (NIB/TDUP/HPWKI/KTA/POLPAR/BBKSDA/SE1658 + 2 brand-custom JVTO_TRAVEL_CREDIT/JVTO_FOC_SCHEME). */}
      {/* Stable @id refs available on every (website) page; per-page schemas cross-reference via @id, no re-inject. */}
      {/* Organization schema is NOT injected here: live's per-page PageJsonLdCombined handles it via getOrganizationProfile DB-driven. */}
      <JsonLd data={FOUNDER_SCHEMA} />
      <JsonLd data={DOCTOR_SCHEMA} />
      <JsonLd data={BBKSDA_REGULATION_SCHEMA} />
      {Object.values(DEFINED_TERMS).map((term) => (
        <JsonLd key={term["@id"]} data={term} />
      ))}
      <Providers>
        <div className="bg-background-light dark:bg-background-dark font-display text-ink-neutral-700 dark:text-ink-neutral-300">
          {/* GA optional logic */}
          {/* <Suspense>
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <GoogleAnalytics />}
        </Suspense> */}

          <div className="min-h-screen flex flex-col bg-white">
            <header>
              <Navbar />
            </header>

            <main className="flex-1">{children}</main>

            <Footer />
          </div>
        </div>
      </Providers>
    </>
  );
}
