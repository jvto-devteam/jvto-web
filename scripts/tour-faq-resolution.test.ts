/**
 * Tour FAQ resolution tests — the pure half of backlog task T05B.
 * Run: npm run test:tour-faq
 *
 * Runner: `node --test`, no jest (adding a dependency needs written approval,
 * .claude/rules/GLOBAL-CONSTRAINTS.md). Requires the TS resolver hook because
 * this file imports from src/ — see package.json's test:tour-faq. The src import
 * below carries NO file extension and must not: this is a .ts file inside
 * tsconfig's include, so an explicit ".ts" fails tsc with TS5097.
 *
 * This tests resolveVisibleTourFaqs only. It never reaches the network or the
 * filesystem: a unit test that needs ekosistem is a test that fails for the
 * wrong reason (same rule as scripts/global-entity-nodes.test.ts).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveVisibleTourFaqs,
  quickAnswerFaqs,
  packageFaqEntries,
  faqsForSurface,
} from "../src/lib/tourFaqResolution";

type SpineItem = Parameters<typeof resolveVisibleTourFaqs>[0]["spineItems"][number];

const spineItem = (over: Partial<SpineItem> = {}): SpineItem =>
  ({
    id: "tour-licensed-operator",
    question: "Is JVTO a licensed Indonesian tour operator?",
    answer: "Yes. NIB 1102230032918.",
    applies_when: "always",
    facts: [],
    source_trace: {
      generated_at: "2026-09-10T00:00:00.000Z",
      source_files: [
        "1-knowledge-and-evidence-core/tours/faq-spine/tour-spine-faq.source.json",
        "1-knowledge-and-evidence-core/organization-identity/organization.json",
      ],
      fact_keys: ["organization.nib"],
    },
    ui_meta: "Verify on /verify-jvto/legal",
    ui_link: "/verify-jvto/legal",
    ...over,
  }) as SpineItem;

const IJEN = spineItem({
  id: "tour-ijen-health-screening",
  question: "What is the Ijen health screening you mention?",
  answer: "Certificate required under BBKSDA SE.35/K2/BIDTEK.1/KSA/1/2024.",
  applies_when: "ijen_only",
});

const resolve = (over: Partial<Parameters<typeof resolveVisibleTourFaqs>[0]> = {}) =>
  resolveVisibleTourFaqs({
    spineItems: [spineItem(), IJEN],
    ijenRelevant: false,
    ijenRequirementFaqs: [],
    packageFaqs: [],
    ...over,
  });

// ── applies_when gating ───────────────────────────────────────────────────────

test("ijen_only spine item is excluded on a non-Ijen tour", () => {
  assert.deepEqual(resolve().map((f) => f.id), ["tour-licensed-operator"]);
});

test("ijen_only spine item is included on an Ijen tour", () => {
  const out = resolve({ ijenRelevant: true });
  assert.deepEqual(out.map((f) => f.id), ["tour-licensed-operator", "tour-ijen-health-screening"]);
});

test("an unknown applies_when is excluded, not guessed at", () => {
  const out = resolve({ spineItems: [spineItem({ applies_when: "someday" as never })] });
  assert.deepEqual(out, []);
});

// ── the requirements surface ──────────────────────────────────────────────────

test("requirement items appear only when Ijen, and carry the requirements surface", () => {
  const ijenRequirementFaqs = [
    {
      question: "Can children hike Ijen Crater?",
      answerSegments: [
        { text: "No. Children under " },
        { text: "10 years old", strong: true },
        { text: " are strictly prohibited." },
      ],
    },
  ];

  assert.equal(resolve({ ijenRequirementFaqs }).length, 1, "not included on a non-Ijen tour");

  const out = resolve({ ijenRelevant: true, ijenRequirementFaqs });
  const req = out.find((f) => f.id === "ijen-req-0");
  assert.ok(req, "requirement item missing on an Ijen tour");
  assert.equal(req.surface, "requirements");
  // Must equal the accordion's rendered text exactly — the parity gate compares them.
  assert.equal(req.answer, "No. Children under 10 years old are strictly prohibited.");
});

test("a malformed requirement item is dropped, never thrown on", () => {
  const ijenRequirementFaqs = [
    { question: "No segments" } as never,
    { question: "", answerSegments: [{ text: "orphan answer" }] },
    { question: "Empty segments", answerSegments: [] },
  ];
  const out = resolve({ ijenRelevant: true, ijenRequirementFaqs });
  assert.deepEqual(out.filter((f) => f.surface === "requirements"), []);
});

// ── surfaces ──────────────────────────────────────────────────────────────────

test("spine items are quick-answers, package items are their own surface", () => {
  const out = resolve({ packageFaqs: [{ question: "Q-PKG", answer: "A-PKG" }] });
  assert.deepEqual(
    out.map((f) => [f.id, f.surface]),
    [["tour-licensed-operator", "quick-answers"], ["pkg-0", "package"]],
  );
  // Package FAQs must NOT land in the open cards: 13-71 per route would bury the spine.
  assert.deepEqual(quickAnswerFaqs(out).map((f) => f.id), ["tour-licensed-operator"]);
  assert.deepEqual(packageFaqEntries(out).map((f) => f.id), ["pkg-0"]);
});

test("every item belongs to exactly one surface — nothing renders twice", () => {
  const out = resolve({
    ijenRelevant: true,
    ijenRequirementFaqs: [{ question: "R1", answerSegments: [{ text: "a" }] }],
    packageFaqs: [{ question: "P1", answer: "a" }],
  });
  const bySurface = {
    "quick-answers": quickAnswerFaqs(out).length,
    package: packageFaqEntries(out).length,
    requirements: faqsForSurface(out, "requirements").length,
  };
  assert.deepEqual(bySurface, { "quick-answers": 2, package: 1, requirements: 1 });
  // The three surfaces partition the array: sum equals total, so the parity gate's
  // per-surface counts can be trusted to add up to mainEntity.length.
  assert.equal(Object.values(bySurface).reduce((a, b) => a + b, 0), out.length);
});

test("quickAnswerFaqs excludes the other surfaces but the full array keeps them", () => {
  const out = resolve({
    ijenRelevant: true,
    ijenRequirementFaqs: [{ question: "Q-REQ", answerSegments: [{ text: "A-REQ" }] }],
    packageFaqs: [{ question: "Q-PKG", answer: "A-PKG" }],
  });
  assert.equal(out.length, 4);
  assert.deepEqual(quickAnswerFaqs(out).map((f) => f.id), [
    "tour-licensed-operator",
    "tour-ijen-health-screening",
  ]);
  // The schema array is the full one: visible == schema across BOTH surfaces.
  assert.equal(out.filter((f) => f.surface === "requirements").length, 1);
});

// ── package FAQs ──────────────────────────────────────────────────────────────

test("package FAQs are appended and carry a source trace", () => {
  const out = resolve({ packageFaqs: [{ question: "Q-PKG", answer: "A-PKG" }] });
  const pkg = out.find((f) => f.id === "pkg-0");
  assert.ok(pkg);
  assert.equal(pkg.question, "Q-PKG");
  assert.ok(pkg.sourceTrace.length > 0, "package FAQ has no provenance");
});

test("a package FAQ missing a question or answer is dropped", () => {
  const out = resolve({
    packageFaqs: [
      { question: "", answer: "A" },
      { question: "Q", answer: "" },
    ],
  });
  assert.deepEqual(out.filter((f) => f.id.startsWith("pkg-")), []);
});

// ── shape invariants ──────────────────────────────────────────────────────────

test("ids are unique across all three groups", () => {
  const out = resolve({
    ijenRelevant: true,
    ijenRequirementFaqs: [
      { question: "R1", answerSegments: [{ text: "a" }] },
      { question: "R2", answerSegments: [{ text: "b" }] },
    ],
    packageFaqs: [
      { question: "P1", answer: "a" },
      { question: "P2", answer: "b" },
    ],
  });
  assert.equal(new Set(out.map((f) => f.id)).size, out.length);
});

test("every resolved answer is non-empty — an empty Answer.text is worse than no node", () => {
  const out = resolve({
    ijenRelevant: true,
    ijenRequirementFaqs: [{ question: "R1", answerSegments: [{ text: "a" }] }],
    packageFaqs: [{ question: "P1", answer: "a" }],
  });
  assert.deepEqual(out.filter((f) => f.answer.trim() === ""), []);
});

test("an item without ui_link resolves — 1 of the 9 live items has none", () => {
  const noLink = spineItem({ id: "tour-eco-responsible", ui_link: undefined });
  const out = resolve({ spineItems: [noLink] });
  assert.equal(out.length, 1);
  assert.equal(out[0].uiLink, undefined);
  assert.equal(out[0].uiMeta, "Verify on /verify-jvto/legal");
});

test("empty everything yields an empty list, not a placeholder (G3)", () => {
  assert.deepEqual(
    resolveVisibleTourFaqs({
      spineItems: [],
      ijenRelevant: true,
      ijenRequirementFaqs: [],
      packageFaqs: [],
    }),
    [],
  );
});
