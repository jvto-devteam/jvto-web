import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History Artifacts | JVTO Verification",
  description:
    "Historical records and artifacts related to JVTO's operations and legacy.",
};

export default function HistoryArtifactsPage() {
  const docs = getDocsByGroup("historyArtifacts");
  return <VerifyJvtoClient initialDocs={docs} groupTitle="History Artifacts" />;
}
