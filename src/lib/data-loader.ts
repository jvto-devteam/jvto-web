// src/lib/data-loader.ts
//
// Public API for the /verify-jvto document gallery (getAllDocs / getDocsByGroup /
// getVerificationDocs). Previously read directly from the local
// Master_Dataset_JVTO.SSOT.v3.0.json; now delegates to
// ecosystemContent/verifyEvidence.ts, which merges the presentation metadata and
// hash-fact fields that live in jvto-ekosistem (see that file's header comment for the
// merge details). All three exports are now async — the sibling-repo read is I/O.
import {
  getEcosystemVerifyEvidenceDocs,
  type Doc as EcosystemDoc,
} from "./ecosystemContent/verifyEvidence";

export type Doc = EcosystemDoc;

const groupCategoryMap: Record<string, string[]> = {
  legal: ["BusinessID", "License", "Membership"],
  policeSafety: [
    "PoliceDocs",
    "Screening",
    "Founder",
    "Credentials",
    "OpsPhoto",
  ],
  pressRecognition: ["Press"],
  historyArtifacts: ["History"],
};

export const getAllDocs = async (): Promise<Doc[]> => {
  return getEcosystemVerifyEvidenceDocs();
};

export const getDocsByGroup = async (group: string): Promise<Doc[]> => {
  const allowedCategories = groupCategoryMap[group];
  if (!allowedCategories) return [];
  const allDocs = await getAllDocs();
  return allDocs.filter((doc) => allowedCategories.includes(doc.category));
};

export const getVerificationDocs = async () => {
  const allDocs = await getAllDocs();
  const groupByCategory = (categories: string[]) =>
    allDocs.filter((doc) => categories.includes(doc.category));

  return {
    company_registration: groupByCategory(["BusinessID", "License"]),
    police_clearances: groupByCategory(["PoliceDocs"]),
    operations: groupByCategory(["OpsPhoto", "Facility"]),
    health_safety: groupByCategory(["Screening"]),
    company_history: groupByCategory(["History"]),
    press_coverage: groupByCategory(["Press"]),
    membership: groupByCategory(["Membership"]),
    founder: groupByCategory(["Founder"]),
    credentials: groupByCategory(["Credentials"]),
  };
};
