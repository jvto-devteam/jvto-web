import { Suspense } from "react";
// Pastikan path import komponen di bawah ini sesuai dengan struktur folder Anda
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import Navbar from "@/components/website/Navbar";
import { getEcosystemPackagesList } from "@/lib/ecosystemContent/tourPackageDetail";
import Footer from "@/components/website/Footer";
import StickyWhatsApp from "@/components/website/LandingPage/StickyWhatsApp";
import { contactInfo } from "@/constants";
import "./website.css";
import type { Metadata } from "next";
import { Providers } from "@/app/providers";

// Fallback URL jika env tidak ada (penting untuk dev/preview)
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

export const metadata: Metadata = {
  // 1. MetadataBase sangat penting untuk mengubah link relative menjadi absolute secara otomatis
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "./",
    // Site-wide hreflang. "./" resolves against metadataBase to the current
    // path, so every page that does not declare its own `alternates` inherits
    // this — which is how the 17 tour pages, the largest section of the site,
    // ended up with a canonical but no hreflang: they set no alternates at all,
    // and a child that does set them replaces this block entirely.
    // The site is monolingual, so `en` and `x-default` point at the same URL:
    // one English version, serve it to everyone.
    languages: { en: "./", "x-default": "./" },
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

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const packages = await getEcosystemPackagesList();
  return (
    <Providers>
      <div className="bg-background-light dark:bg-background-dark text-ink-neutral-700 dark:text-ink-neutral-300">
        {/* GA optional logic */}
        {/* <Suspense>
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <GoogleAnalytics />}
        </Suspense> */}

        <div className="min-h-screen flex flex-col bg-white">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-jvto-navy focus:font-bold focus:rounded focus:shadow-lg"
          >
            Skip to main content
          </a>
          <header>
            <Navbar packageCount={packages.length} />
          </header>

          <main id="main-content" className="flex-1">{children}</main>

          <Footer />
          <StickyWhatsApp />
        </div>
      </div>
    </Providers>
  );
}
