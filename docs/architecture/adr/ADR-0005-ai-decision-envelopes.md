# ADR-0005 — AI Decision Envelopes (AI as a Controlled Consumer)

- Status: Accepted (Milestone 1)
- Date: 2026-08-05
- Context: JVTO answers high-stakes questions — price, availability, policy, safety,
  medical (Ijen health screening), refunds — where a fabricated answer is a customer or
  safety risk (handoff §27 risk "AI invents status, policy, price, or safety answer";
  leading signal "answer lacks source/tool result"). Principle P-07 (§4) makes AI a
  controlled consumer, and §2.2 explicitly forbids "an AI agent with raw database,
  repository, vector-store, margin, or PII access." The AI architecture §12 defines a
  purpose-built decision envelope and separates assistants by allowed data (§12.1). The
  medical-data boundary §13.3 keeps traveler health documents out of general AI context.
  This ADR records the envelope decision as a Milestone 1 architecture foundation even
  though customer-facing AI stays disabled until evaluation gates pass (§12.2).

- Decision: AI never receives raw access. An adapter constructs a purpose-built
  `AgentDecisionEnvelope` (§12.2) carrying `envelopeVersion`, `purpose`
  (`public-answer` | `sales` | `operations` | `content-review`), `requestId`,
  `allowedActions`, `knowledgeRelease`, optional `itineraryRelease`, scoped
  `productReadModel`/`bookingReadModel`, `policyRefs`, `safetyBoundaries`, `missingFields`,
  `humanHandoffRequired`, and `expiresAt`. The model never gets raw repository traversal,
  raw SQL results, or unrestricted vector matches (§12.2). Data that is unavailable is
  represented as `unknown` in `missingFields`, never guessed. High-stakes medical, legal,
  safety, price, availability, refund, or booking decisions route to deterministic tools
  or human approval, not free generation (§12.2). Assistant separation (§12.1) bounds
  each purpose: the public travel advisor sees published knowledge and safe status but no
  PII, internal cost, or booking mutation; operations/content copilots are role-scoped and
  cannot dump the model-training context or invent facts. Every tool call and final action
  is auditable. Customer-facing traffic remains disabled until eval gates pass (§12.2).

- Consequences:
  - Positive: the model cannot exfiltrate PII, margins, medical records, or secrets
    (§2.2, §13.1 Restricted, §13.3); "unknown" over a guess makes gaps honest and
    testable (§18.2 decision-envelope schema contract test); high-stakes answers carry a
    source/tool result or hand off to a human (§27 stop trigger).
  - Negative: every AI feature needs an adapter + read-model plumbing before it can
    answer; live gaps surface as "unknown" or handoff rather than a smooth generated
    reply; the value is unrealized until eval gates open customer traffic.
  - Forbids: giving the model raw DB/SQL/vector/repo access; letting AI author facts,
    prices, policies, availability, bookings, or payment/medical state (P-07); guessing
    missing live data; auto-answering a high-stakes question without a deterministic tool
    or human approval.

- Alternatives considered:
  1. RAG directly over the vector store / repository — rejected: unrestricted vector
     matches and raw traversal are exactly what §12.2 and §2.2 forbid; no purpose scoping
     or audit boundary.
  2. Let AI read the production DB behind a prompt guardrail — rejected: prompt-only
     guardrails do not enforce the §13.1/§13.3 data-class and medical boundaries; envelope
     construction is the enforcement point (P-07, §12.1).
  3. Enable customer-facing AI now with monitoring — rejected: §12.2 requires customer
     traffic to stay disabled until evaluation gates pass; §25.6 makes enabling public
     AI/customer traffic an owner decision.

- Handoff references: §2.2 (do-not-build AI with raw access), §4 (P-07), §12.1
  (assistant separation), §12.2 (decision envelope + rules), §13.1 (data classes), §13.3
  (medical boundary), §16 Milestone 1, §18.2 (envelope contract test), §25.6 (owner gate
  on AI/customer traffic), §27 (AI-invents-answer risk). Milestone 0 grounding:
  `domain-ownership-matrix.md` (AI runtime row), `risk-register.md`.
