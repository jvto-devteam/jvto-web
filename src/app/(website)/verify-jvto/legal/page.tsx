// src/app/(website)/verify-jvto/legal/page.tsx
import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify: Legal Documents",
  description:
    "Verify NIB, TDUP, and official business registrations of PT Java Volcano Rendezvous.",
};

export default function LegalPage() {
  const docs = getDocsByGroup("legal");
  return <VerifyJvtoClient initialDocs={docs} groupTitle="Legal Documents" />;
}
