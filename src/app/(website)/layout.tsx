// app/(website)/layout.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import Navbar from "@/components/website/Navbar";
import "./website.css";

export const metadata: Metadata = {
  title: "JVTO – Java Volcano Tours",
  description:
    "Private tours to Bromo, Ijen, Tumpak Sewu and East Java volcano routes with JVTO.",
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
          <footer className="border-t">
            <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-500">
              © {new Date().getFullYear()} JVTO. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
