import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Police Authority & Safety Protocols | JVTO Verification",
  description:
    "Forensic evidence of Tourist Police integration, health screening, and operational safety.",
};

export default function PoliceSafetyPage() {
  const docs = getDocsByGroup("policeSafety");
  return <VerifyJvtoClient initialDocs={docs} groupTitle="Police & Safety" />;
}
