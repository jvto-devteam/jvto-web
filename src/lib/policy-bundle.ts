// Policy Bundle v2 helper — typed re-export of the synced JSON artifacts.
// Source: llm-wiki/output/website/policy-bundle/, copied via
// `npm run sync:policy-bundle`.
//
// Do not hand-edit the JSON files under src/data/policy-bundle/.
// Fix data in llm-wiki policy sources, re-run the compiler there
// (scripts/compile_policy_bundle.py --write --strict), then re-sync here.

import manifestJson from "@/data/policy-bundle/_manifest.json";
import policyBundleJson from "@/data/policy-bundle/policy-bundle.json";
import consumerBundlesJson from "@/data/policy-bundle/consumer-bundles.json";
import decisionMatrixJson from "@/data/policy-bundle/decision-matrix.json";
import customerCopyJson from "@/data/policy-bundle/customer-copy.json";
import deprecatedWordingReportJson from "@/data/policy-bundle/deprecated-wording-report.json";
import gapReportJson from "@/data/policy-bundle/gap-report.json";

// Controlled consumer vocabulary (policy-bundle/v2.0). Website is the only
// booking channel — there is no `whatsapp` booking consumer; customer_support
// is read-only.
export type PolicyBundleConsumerKey =
  | "website_checkout"
  | "booking_portal"
  | "e_voucher"
  | "invoice"
  | "policy_page"
  | "faq"
  | "customer_support";

export type CustomerCopyKey =
  | "package_guarantee_summary"
  | "before_48_full_cancellation"
  | "after_48_full_cancellation"
  | "partial_cancellation"
  | "flight_disruption"
  | "destination_force_majeure"
  | "package_transfer"
  | "package_redemption";

export type PolicyEvidence = {
  source: string;
  section: string;
  text: string;
};

export type PolicyDomain = {
  policy_id: string;
  domain: string;
  canonical_sources: string[];
  supporting_sources: string[];
  consumers: string[];
  notes: string;
  evidence: PolicyEvidence[];
  customer_copy?: Record<CustomerCopyKey, string>;
};

export type PolicyConsumerBundle = {
  consumer: string;
  policy_ids: string[];
  domains: PolicyDomain[];
};

export type PolicyConsumerBundles = Record<string, PolicyConsumerBundle>;

export type DecisionMatrixRule = {
  outcome?: string;
  cash_refund_percent?: number;
  package_credit_eligible?: boolean;
  recovery_fee_percent?: number;
  maximum_uses?: number;
  options?: string[];
  first_remedy?: string;
  second_remedy?: string;
};

export type DecisionMatrix = {
  schema_version: string;
  policy_version: string;
  effective_from: string;
  cutoff_hours: number;
  rules: Record<string, DecisionMatrixRule>;
  partial_thresholds: Record<string, number | string | boolean>;
  package_credit_locks: Record<string, number | boolean>;
  booking_scope: { allowed_sources: string[]; [k: string]: unknown };
};

export type PolicyBundleManifest = {
  schema_version: "policy-bundle/v2.0";
  generated_by: string;
  generated_at: string;
  cancellation_policy_version: string | null;
  cancellation_policy_hash: string | null;
  consumers_checked: string[];
  artifacts: string[];
  clean: true;
  [k: string]: unknown;
};

export type PolicyGapReport = {
  summary: { total: number; errors: number; warnings: number };
  findings: unknown[];
};

export type DeprecatedWordingReport = {
  checks: { deprecated: string; correct: string }[];
  summary: {
    consumers_checked: string[];
    total_findings: number;
    errors: number;
  };
  consumers: Record<
    string,
    {
      checked_policy_ids: string[];
      findings: unknown[];
      clean: boolean;
    }
  >;
};

export const policyBundleManifest = manifestJson as PolicyBundleManifest;
export const policyBundle = policyBundleJson;
export const policyConsumerBundles =
  consumerBundlesJson as PolicyConsumerBundles;
export const decisionMatrix = decisionMatrixJson as DecisionMatrix;
export const customerCopy = customerCopyJson as Record<CustomerCopyKey, string>;
export const deprecatedWordingReport =
  deprecatedWordingReportJson as DeprecatedWordingReport;
export const policyGapReport = gapReportJson as PolicyGapReport;

// The cancellation domain is YAML-canonical; this is its stable policy_id.
export const CANCELLATION_POLICY_ID = "cancellation-package-credit";

export function getPolicyConsumerBundle(
  consumer: PolicyBundleConsumerKey,
): PolicyConsumerBundle | undefined {
  return policyConsumerBundles[consumer];
}

export function getPolicyDomain(
  consumer: PolicyBundleConsumerKey,
  policyId: string,
): PolicyDomain | undefined {
  return getPolicyConsumerBundle(consumer)?.domains.find(
    (domain) => domain.policy_id === policyId,
  );
}

export function getPrimaryPolicyText(
  consumer: PolicyBundleConsumerKey,
  policyId: string,
): string {
  return getPolicyDomain(consumer, policyId)?.evidence[0]?.text ?? "";
}

/** Rule-engine-ready cancellation outcome matrix (SSOT — never recompute). */
export function getDecisionMatrix(): DecisionMatrix {
  return decisionMatrix;
}

/** Canonical customer-facing copy block for a cancellation surface. */
export function getCustomerCopy(key: CustomerCopyKey): string {
  return customerCopy[key] ?? "";
}
