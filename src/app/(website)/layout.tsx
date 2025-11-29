// app/(website)/layout.tsx
import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import {contactInfo} from "@/constants";
import "./website.css";

export const metadata = {
  title: {
    default: "JVTO Tours | Private East Java Adventures",
  },
  description:
    "Private all-inclusive tours to Mount Bromo, Ijen Crater, Tumpak Sewu & more. 24/7 support from local experts.",

  // Open Graph global fallback
  openGraph: {
    type: "website",
    locale: "en_US",
    url: contactInfo.website,
    siteName: "Java Volcano Tour Operator",
    images: [
      {
        url: contactInfo.website+"/assets/img/og/default.jpg", // gambar default kalau halaman tidak punya OG sendiri
        width: 1200,
        height: 630,
        alt: "Java Volcano Tour Operator - JVTO",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    images: [contactInfo.website+"/assets/img/og/default.jpg"],
  },

  // Favicon & icons (ini tetap di sini, tidak perlu di-override per halaman)
  icons: {
    icon: ["/assets/img/favicon/favicon.ico", "/assets/img/favicon/favicon-32x32.png", "/assets/img/favicon/favicon-16x16.png"],
    apple: "/assets/img/favicon/apple-touch-icon.png",
  },

  robots: "index, follow",
};

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-background-light dark:bg-background-dark font-display text-ink-neutral-700 dark:text-ink-neutral-300 overflow-x-hidden">
        {/* GA khusus segment (website) */}
        <Suspense>
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <GoogleAnalytics />}
        </Suspense>

        <div className="min-h-screen flex flex-col bg-white">
          {/* Header / Navbar website */}
          <header>
            <Navbar />
          </header>

          {/* Konten utama */}
          <main className="flex-1">{children}</main>

          {/* Footer website */}
          <Footer />

        </div>
      </div>
    </>
  );
}
