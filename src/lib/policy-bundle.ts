// Policy Bundle v1 helper — typed re-export of the synced JSON artifacts.
// Source: llm-wiki/output/website/policy-bundle/, copied via
// `npm run sync:policy-bundle`.
//
// Do not hand-edit the JSON files under src/data/policy-bundle/.
// Fix data in llm-wiki policy sources, re-run the compiler there
// (scripts/compile_policy_bundle.py --write --strict), then re-sync here.

import manifestJson from "@/data/policy-bundle/_manifest.json";
import policyBundleJson from "@/data/policy-bundle/policy-bundle.json";
import consumerBundlesJson from "@/data/policy-bundle/consumer-bundles.json";
import deprecatedWordingReportJson from "@/data/policy-bundle/deprecated-wording-report.json";
import gapReportJson from "@/data/policy-bundle/gap-report.json";

export type PolicyBundleConsumerKey = "checkout" | "invoice" | "whatsapp";

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
};

export type PolicyConsumerBundle = {
  consumer: PolicyBundleConsumerKey;
  policy_ids: string[];
  domains: PolicyDomain[];
};

export type PolicyConsumerBundles = Record<
  PolicyBundleConsumerKey,
  PolicyConsumerBundle
>;

export type PolicyBundleManifest = {
  schema_version: "policy-bundle/v1.0";
  generated_by: string;
  generated_at: string;
  dry_run: boolean;
  source_hashes: Record<string, string>;
  policy_domains: number;
  deprecated_checks: number;
  consumers_checked: PolicyBundleConsumerKey[];
  artifacts: string[];
  sync_contract: {
    recommended_consumer: string;
    source_path: string;
    target_path: string;
    required_gate: {
      schema_version: "policy-bundle/v1.0";
      clean: true;
    };
    required_files: string[];
    consumer_entrypoint: string;
    consumer_keys: PolicyBundleConsumerKey[];
    validation_files: string[];
    failure_rule: string;
  };
  clean: true;
};

export type PolicyGapReport = {
  summary: { total: number; errors: number; warnings: number };
  findings: unknown[];
};

export type DeprecatedWordingReport = {
  checks: { deprecated: string; correct: string }[];
  summary: {
    consumers_checked: PolicyBundleConsumerKey[];
    total_findings: number;
    errors: number;
  };
  consumers: Record<
    PolicyBundleConsumerKey,
    {
      checked_policy_ids: string[];
      findings: unknown[];
      clean: boolean;
    }
  >;
};

export const policyBundleManifest =
  manifestJson as PolicyBundleManifest;
export const policyBundle = policyBundleJson;
export const policyConsumerBundles =
  consumerBundlesJson as PolicyConsumerBundles;
export const deprecatedWordingReport =
  deprecatedWordingReportJson as DeprecatedWordingReport;
export const policyGapReport = gapReportJson as PolicyGapReport;

export function getPolicyConsumerBundle(
  consumer: PolicyBundleConsumerKey,
): PolicyConsumerBundle {
  return policyConsumerBundles[consumer];
}

export function getPolicyDomain(
  consumer: PolicyBundleConsumerKey,
  policyId: string,
): PolicyDomain | undefined {
  return getPolicyConsumerBundle(consumer).domains.find(
    (domain) => domain.policy_id === policyId,
  );
}

export function getPrimaryPolicyText(
  consumer: PolicyBundleConsumerKey,
  policyId: string,
): string {
  return getPolicyDomain(consumer, policyId)?.evidence[0]?.text ?? "";
}
