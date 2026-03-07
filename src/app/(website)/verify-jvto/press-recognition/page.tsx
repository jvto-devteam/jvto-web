import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press Recognition | JVTO Verification",
  description:
    "Media coverage and recognition received by JVTO in various publications and platforms.",
};

export default function PressRecognitionPage() {
  const docs = getDocsByGroup("pressRecognition");
  return <VerifyJvtoClient initialDocs={docs} groupTitle="Press Recognition" />;
}
