// Type declarations for scripts/lib/contentDriftRules.mjs (pure ESM denylist).
export interface DriftRule {
  name: string;
  re: RegExp;
}
export interface DriftHit {
  rel: string;
  line: number;
  rule: string;
  text: string;
}
export declare const WHITELIST_MARKER: string;
export declare const RULES: DriftRule[];
export declare function truncate(text: string, max?: number): string;
export declare function scanText(content: string, rel: string): DriftHit[];
