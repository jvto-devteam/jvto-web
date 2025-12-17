// src/app/(website)/verify-jvto/page.tsx
import type { Metadata } from "next";
import VerifyJvtoClient from "./VerifyJvtoClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Verify JVTO Documents",
  description:
    "Official licences, police clearances, operational certificates, and verification documents for Java Volcano Tour Operator.",
  openGraph: {
    title: "Verify JVTO Documents",
    description:
      "Official licences, police clearances, operational certificates, and verification documents for Java Volcano Tour Operator.",
    url: `${siteUrl}/verify-jvto`,
    siteName: "Java Volcano Tour Operator",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: `${siteUrl}/assets/img/og/verify-jvto.webp`,
        width: 1200,
        height: 630,
        alt: "Verify JVTO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verify JVTO Documents",
    description:
      "Official licences, police clearances, operational certificates, and verification documents for Java Volcano Tour Operator.",
    images: [`${siteUrl}/assets/img/og/verify-jvto.webp`],
  },
};

export default function VerifyJvtoPage() {
  return <VerifyJvtoClient />;
}
