/**
 * Milestone 0 self-test for the canonical checkout Ijen health-screening notice.
 * Covers (a) the STABLE derivation `deriveIjenRelevant` (destination route[]
 * preferred), (b) the checkout targeting `isIjenRelevantCheckout` (explicit
 * boolean, never a label substring; null/malformed → false), and (c) the
 * canonical notice wording + absence of retired wording.
 * Run: npx tsx scripts/ci/ijen-notice-selftest.ts
 */
import { IJEN_HEALTH_NOTICE } from "../../src/lib/checkout/ijenNotice";
import { deriveIjenRelevant, isIjenRelevantCheckout } from "../../src/lib/ijenRelevance";

let failed = 0;
function check(cond: boolean, label: string) {
  console.log(`  ${cond ? "ok  " : "FAIL"}  ${label}`);
  if (!cond) failed = 1;
}

console.log("[ijen-notice-selftest] deriveIjenRelevant — stable identifier (route[] preferred)");
// Renamed label with an Ijen destination route[] must still be Ijen-relevant.
check(deriveIjenRelevant("Sunrise Volcano Combo", "bromo-combo", ["Mount Bromo", "Kawah Ijen"]) === true, "route[] has Ijen → true even when name/slug lack 'ijen'");
check(deriveIjenRelevant("Ijen Blue Fire 2D1N", "ijen-blue-fire", undefined) === true, "name fallback → true");
check(deriveIjenRelevant("Bromo Sunrise", "bromo-ijen-3d2n", undefined) === true, "slug fallback → true");
check(deriveIjenRelevant("Bromo Sunrise 1D", "bromo-sunrise", ["Mount Bromo"]) === false, "non-Ijen route + name/slug → false");
check(deriveIjenRelevant("Tumpak Sewu Day Trip", "tumpak-sewu", []) === false, "empty route + non-Ijen name → false");

console.log("[ijen-notice-selftest] isIjenRelevantCheckout — explicit boolean, no label guessing");
check(isIjenRelevantCheckout({ ijenRelevant: true, packageLabel: "Ijen Blue Fire" }) === true, "Ijen product → shown");
check(isIjenRelevantCheckout({ ijenRelevant: true, packageLabel: "Bromo–Ijen Combo" }) === true, "combination product → shown");
check(isIjenRelevantCheckout({ ijenRelevant: true, packageLabel: "Sunrise Volcano Combo" }) === true, "renamed label (no 'ijen') but ijenRelevant → shown");
check(isIjenRelevantCheckout({ ijenRelevant: false, packageLabel: "Bromo Sunrise" }) === false, "non-Ijen product → hidden");
check(isIjenRelevantCheckout({ packageLabel: "Ijen Blue Fire" }) === false, "label says Ijen but no explicit flag → hidden (no substring guessing)");
check(isIjenRelevantCheckout(null) === false, "null payload → hidden");
check(isIjenRelevantCheckout(undefined) === false, "undefined payload → hidden");
check(isIjenRelevantCheckout({}) === false, "empty payload → hidden");
check(isIjenRelevantCheckout("not an object") === false, "malformed (string) → hidden");
check(isIjenRelevantCheckout({ ijenRelevant: "yes" }) === false, "malformed (truthy non-boolean) → hidden");

console.log("[ijen-notice-selftest] canonical (mandatory) wording present");
const text = `${IJEN_HEALTH_NOTICE.heading} ${IJEN_HEALTH_NOTICE.body}`.toLowerCase();
for (const needle of ["required", "must complete", "before kawah ijen crater entry", "bbksda se.1658/ksa.9/2024", "included in your package", "at your hotel"]) {
  check(text.includes(needle), `contains "${needle}"`);
}

console.log("[ijen-notice-selftest] retired wording absent");
for (const banned of ["may require", "dapat mensyarat", "travel credit", "hangus", "forfeit", "<48", "48 jam", "guarantee"]) {
  check(!text.includes(banned), `absent "${banned}"`);
}

if (failed) {
  console.log("[ijen-notice-selftest] FAIL");
  process.exit(1);
}
console.log("[ijen-notice-selftest] PASS");
