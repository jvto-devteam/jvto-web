/**
 * Milestone 0 self-test for the canonical checkout Ijen health-screening notice.
 * Asserts (a) canonical wording present, (b) product targeting (Ijen-only), and
 * (c) absence of retired wording. Run: npx tsx scripts/ci/ijen-notice-selftest.ts
 */
import { isIjenPackageLabel, IJEN_HEALTH_NOTICE } from "../../src/lib/checkout/ijenNotice";

let failed = 0;
function check(cond: boolean, label: string) {
  if (cond) {
    console.log(`  ok    ${label}`);
  } else {
    console.log(`  FAIL  ${label}`);
    failed = 1;
  }
}

const text = `${IJEN_HEALTH_NOTICE.heading} ${IJEN_HEALTH_NOTICE.body}`.toLowerCase();

console.log("[ijen-notice-selftest] product targeting");
check(isIjenPackageLabel("Ijen Blue Fire 2D1N") === true, "Ijen label → shown");
check(isIjenPackageLabel("Ijen Bromo Combo 3D2N") === true, "Ijen combo → shown");
check(isIjenPackageLabel("Bromo Sunrise 1D") === false, "non-Ijen label → hidden");
check(isIjenPackageLabel("Tumpak Sewu Day Trip") === false, "non-Ijen label → hidden");
check(isIjenPackageLabel(null) === false && isIjenPackageLabel(undefined) === false, "null/undefined → hidden");

console.log("[ijen-notice-selftest] canonical (mandatory) wording present");
// Mandatory framing + supporting authority + included/at-hotel, per docs/CANONICAL_FACTS.md.
for (const needle of ["required", "must complete", "before kawah ijen crater entry", "bbksda se.1658/ksa.9/2024", "included in your package", "at your hotel"]) {
  check(text.includes(needle), `contains "${needle}"`);
}

console.log("[ijen-notice-selftest] retired wording absent");
// Conditional health wording + retired cancellation wording must never appear.
for (const banned of ["may require", "dapat mensyarat", "travel credit", "hangus", "forfeit", "<48", "48 jam", "guarantee"]) {
  check(!text.includes(banned), `absent "${banned}"`);
}

if (failed) {
  console.log("[ijen-notice-selftest] FAIL");
  process.exit(1);
}
console.log("[ijen-notice-selftest] PASS");
