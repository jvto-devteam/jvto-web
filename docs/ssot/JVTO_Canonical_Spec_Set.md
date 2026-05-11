# JVTO Canonical Spec Set
This package contains the final canonical spec set for the JVTO website orchestration board.

## 01_foundation.yaml
```yaml
spec:
  name: "JVTO Foundation"
  version: "1.0"
  purpose: "Define the board-level foundation of the JVTO website as one unified system."

  north_star:
    summary: "Build a trust-led, package-first, support-backed, proof-owned, machine-readable website system for JVTO."
    strategic_positioning:
      - "high-trust private volcano operator"
      - "tourist-police-led authority"
      - "doctor-backed Ijen readiness"
      - "verifiable operational seriousness"
    market_context:
      - "East Java volcano travel is high-risk and high-friction."
      - "Users hesitate because of safety, legality, readiness, and operator credibility."
      - "The site must reduce this friction structurally."

  project_goal:
    primary:
      - "Make the website feel convincing and professional."
      - "Make the website easy to trust for humans."
      - "Make the website readable for AI/search systems."
      - "Unify all pages into one coherent system."
      - "Use source-of-truth mapping so proof and content do not scatter."
    non_goals:
      - "not just visual redesign"
      - "not just coding"
      - "not just SEO"
      - "not just CMS setup"

  core_working_rules:
    - "Treat the website as a system, not as isolated pages."
    - "Page role must be explicit."
    - "Trust must be structured and verifiable."
    - "Support must reduce friction."
    - "Proof must remain canonically owned."
    - "Do not let new ideas automatically change priorities."
    - "Use improve-in-place, not full replacement."

  three_layer_design_model:
    strategy:
      function:
        - "make people trust the operator"
        - "help people choose the right tour"
        - "prove the operator is real and serious"
        - "help AI/search read JVTO as a trustworthy source"
    structure:
      function:
        - "define page types"
        - "define which page is primary or supporting"
        - "define which meaning appears first"
        - "define how pages relate to each other"
    visual_design:
      function:
        - "define visual tone"
        - "define hierarchy"
        - "define typography, color, spacing, card style, and visual rhythm"

  art_direction:
    target_direction:
      - "premium expedition"
      - "trust-led tour operator"
      - "volcanic travel with operational authority"
    must_feel_like:
      - "real expedition travel"
      - "field-based authenticity"
      - "adult and calm"
      - "structured trust"
      - "serious but still travel-first"
    must_not_feel_like:
      - "generic travel blog"
      - "playful backpacker site"
      - "SaaS dashboard"
      - "luxury resort site"
      - "sterile corporate portal"

  homepage_baseline:
    role: "master visual and structural baseline"
    status: "frozen reference"
    rule:
      - "homepage is no longer the main experimentation area"
      - "other clusters inherit and adapt its language"
    section_order:
      - "hero"
      - "differentiators"
      - "destinations"
      - "route-browser"
      - "trust-section"
      - "founder-spotlight"
      - "verify-cta"

  visual_modes:
    homepage_mode:
      assigned_routes:
        - "/"
      role:
        - "main visual baseline"
        - "trust-first commercial entry"
    travel_mode:
      assigned_routes:
        - "/tours*"
        - "/destinations*"
      role:
        - "discovery"
        - "travel desire"
        - "route clarity"
    trust_mode:
      assigned_routes:
        - "/verify-jvto*"
        - "/policy*"
      role:
        - "proof"
        - "legal"
        - "archive"
        - "verification"
    hybrid_mode:
      assigned_routes:
        - "/travel-guide*"
        - "/why-jvto*"
      role:
        - "narrative"
        - "support"
        - "people"
        - "operational guidance"

  content_hierarchy:
    ordered_meaning:
      - "Why JVTO is different"
      - "Which route/package fits"
      - "What the trip actually feels like"
      - "How the operation works"
      - "Where to verify the claims"
      - "How to proceed to booking"

  success_conditions:
    user_should_conclude:
      - "JVTO is different"
      - "the difference is proven"
      - "the route/package fit is clear"
      - "trust is sufficient to proceed"

  protected_principles:
    - "homepage sells trust"
    - "tours hub sells clarity"
    - "package page sells confidence"
    - "support pages reduce friction"
    - "verify pages prove the claims"
```

## 02_system_architecture.yaml
```yaml
spec:
  name: "JVTO System Architecture"
  version: "1.0"
  purpose: "Define the layered architecture, intent clusters, page roles, and system relationships."

  five_layer_architecture:
    - id: "trust-entry"
      label: "Trust Entry"
      duty: "Differentiate and prove"
      objective: "Establish JVTO as a unique, verifiable operator immediately."
      user_conclusion: "This is not a generic reseller."

    - id: "route-discovery"
      label: "Route Discovery"
      duty: "Pathway guidance"
      objective: "Guide users into the correct route family and entry path."
      user_conclusion: "I know which route path fits my logistics."

    - id: "package-conversion"
      label: "Package Conversion"
      duty: "Clarity and confidence"
      objective: "Sell packages by removing practical doubt."
      user_conclusion: "I understand what I am buying."

    - id: "operational-support"
      label: "Operational Support"
      duty: "Friction reduction"
      objective: "Answer closures, readiness, fitness, screening, and policy questions."
      user_conclusion: "I know what is required and what may affect my trip."

    - id: "proof-ownership"
      label: "Proof Ownership"
      duty: "Forensic verification"
      objective: "Keep heavy proof in canonical, auditable ownership pages."
      user_conclusion: "The claims are verifiable."

  master_systems:
    discovery_system:
      role: "Drive desire and route selection"
      includes:
        - "Homepage"
        - "Tours Hub"
        - "Destination Pages"
        - "From Surabaya"
        - "From Bali"

    package_conversion_system:
      role: "Turn package pages into self-service booking brochures"
      includes:
        - "Package Pages"
        - "Route Data"
        - "Route Seriousness"
        - "Rooming"
        - "Vehicle"
        - "Crew"
        - "Meals"
        - "Payment Summary"
        - "Verify-Before-Book"

    support_system:
      role: "Resolve readiness and operational friction"
      includes:
        - "Travel Guide"
        - "Ijen Health Screening"
        - "Weather & Closures"
        - "Packing & Fitness"
        - "Booking Information"
        - "Policy"
        - "FAQ"

    proof_system:
      role: "Keep proof canonically owned and auditable"
      includes:
        - "Verify JVTO"
        - "Legal"
        - "Police & Safety"
        - "Press & Recognition"
        - "History Artifacts"
        - "Partner Proof"

    narrative_authority_system:
      role: "Translate trust into human meaning"
      includes:
        - "Why JVTO"
        - "Founder"
        - "Our Team"
        - "Reviews synthesis"
        - "Standards"
        - "Story"

  intent_clusters:
    discovery_cluster:
      intent: "I am exploring trip options and entry logistics."
      included_pages:
        - "Homepage"
        - "Tours Hub"
        - "Destination Pages"
        - "From Surabaya"
        - "From Bali"

    trust_cluster:
      intent: "I need to know whether this operator is legitimate and authoritative."
      included_pages:
        - "Why JVTO"
        - "Verify JVTO"
        - "Reviews"
        - "Our Team"
        - "Police & Safety"
        - "History / Press / Legal"

    booking_support_cluster:
      intent: "I need to know whether I am ready to proceed."
      included_pages:
        - "Ijen Health Screening"
        - "Weather & Closures"
        - "Packing & Fitness"
        - "Booking Information"
        - "Policy"
        - "FAQ"

    contact_escalation_cluster:
      intent: "I need direct human coordination."
      included_pages:
        - "Contact JVTO"
        - "Police Escort Requests"

  page_role_matrix:
    homepage:
      job: "trust-led portal"
      must_do:
        - "show who JVTO is"
        - "show why JVTO is different"
        - "show why JVTO is trustworthy"
        - "open route selection"
        - "direct next step"

    tours_hub:
      job: "clarity seller"
      must_do:
        - "compare route families"
        - "reduce package confusion"
        - "show route fit"
        - "show route seriousness"

    destination_pages:
      job: "place-context support"
      must_do:
        - "show place character"
        - "show difficulty/context"
        - "link to routes and packages"

    package_pages:
      job: "confidence seller"
      must_do:
        - "act as standalone booking brochures"
        - "answer major buyer questions"
        - "carry practical route logic"
        - "link to support and proof when needed"

    travel_guide:
      job: "support infrastructure"
      must_do:
        - "carry readiness and field reality"
        - "support decision-making"

    policy:
      job: "rules layer"
      must_do:
        - "state booking/payment/cancellation rules"
        - "support package flow"

    why_jvto:
      job: "narrative trust owner"
      must_do:
        - "humanize authority"
        - "translate proof into believable differentiation"

    verify_jvto:
      job: "canonical proof owner"
      must_do:
        - "hold legal, police, medical, partner, and historical proof"
        - "keep verification auditable"

    contact:
      job: "human escalation"
      must_do:
        - "catch special or high-stakes cases"

  system_relationships:
    canonical_flow:
      - "Homepage opens trust"
      - "Tours and Destinations guide route discovery"
      - "Package Pages close decision through practical clarity"
      - "Support and Verify remove remaining doubt"
      - "Contact acts as final escalation"

  route_seriousness_system:
    purpose:
      - "replace generic difficulty labels"
      - "make fit assessment faster and more honest"
    signal_types:
      - "overnight"
      - "wet terrain"
      - "overland"
      - "physical intensity"
      - "Ijen-specific readiness"
    rules:
      - "use route seriousness in discovery surfaces"
      - "use route seriousness again in package pages"
      - "keep it field-based and scannable"
```

## 03_conversion_spec.yaml
```yaml
spec:
  name: "JVTO Conversion Spec"
  version: "1.0"
  purpose: "Define homepage component logic and package-page conversion blueprint."

  homepage_core_questions:
    - question: "What is this website about?"
      solved_by:
        - "Hero"
        - "H1"
        - "Subcopy"

    - question: "Why should I trust it?"
      solved_by:
        - "Trust Strip"
        - "Review cues"
        - "Founder context"
        - "Doctor/Ijen proof"
        - "MAGMA/live operational context"

    - question: "What can I choose?"
      solved_by:
        - "Route Selector"
        - "Destination Cards"
        - "Package Cards"

    - question: "What should I do next?"
      solved_by:
        - "CTA"
        - "Contact"
        - "Verify path"
        - "Explore Tours"

  homepage_components:
    hero:
      function:
        - "Create first impression"
        - "Explain core value quickly"
        - "Set brand tone"
      requirements:
        - "image-led"
        - "large clear headline"
        - "short subcopy"
        - "1-2 clear CTA"
        - "small trust cue only"

    trust_strip:
      function:
        - "Deliver fast reassurance"
        - "Show condensed trust signals"
      requirements:
        - "compact"
        - "scannable"
        - "not dominant over hero"

    destination_cards:
      function:
        - "Trigger place desire"
        - "Introduce destination character and difficulty"
      requirements:
        - "strong imagery"
        - "clear title"
        - "short descriptor"
        - "optional difficulty cue"

    route_package_cards:
      function:
        - "Help choose a route/package"
      required_fields:
        - "duration"
        - "start point"
        - "from price"
        - "physicality or route fit"
        - "CTA"
      optional_fields:
        - "Ijen included or not"
        - "route seriousness"
        - "key differentiator"

    route_selector:
      function:
        - "Reduce clicks"
        - "Branch users by origin or route family"

    trust_block:
      function:
        - "Explain why JVTO is different"
        - "Compress trust near decision"
      requirements:
        - "3-4 core reasons"
        - "structured layout"
        - "not a full legal archive"

    founder_spotlight:
      function:
        - "Humanize the brand"
        - "Show who is responsible"
        - "Reinforce authority"

    review_block:
      function:
        - "Show external validation"
        - "Demonstrate trust comes from outside the brand"

    medical_process_block:
      function:
        - "Show Ijen is handled seriously"
        - "Translate workflow into visible proof"

    live_volcano_signal:
      function:
        - "Show freshness and operational presence"

    final_cta:
      function:
        - "Close the homepage with clear next action"

    footer:
      function:
        - "Provide stable navigation and company identity"

  package_page_blueprint:
    governing_rules:
      - "product first"
      - "practicalities next"
      - "trust later"
      - "package pages act as self-service brochures"
      - "support links must reinforce, not interrupt, the flow"

    final_sequence:
      - "hero/route identity"
      - "structured route data"
      - "visual route gallery"
      - "route fit"
      - "route rhythm"
      - "hotel/rooming"
      - "vehicle/crew"
      - "meals"
      - "Ijen readiness when relevant"
      - "compact policy"
      - "payment summary"
      - "add-ons"
      - "closest alternative"
      - "Ijen proof rail when relevant"
      - "verify-before-book"
      - "FAQ"
      - "final CTA"

  conversion_phases:
    phase_1_emotion_and_desire:
      - "hero/route identity"
      - "structured route data"
      - "route seriousness"
      - "visual route gallery"
      - "route fit"

    phase_2_logic_and_operations:
      - "route rhythm"
      - "hotel and rooming"
      - "vehicle and crew"
      - "meals"
      - "Ijen readiness"
      - "compact policy"
      - "payment summary"
      - "add-ons"

    phase_3_trust_and_conversion:
      - "closest alternative"
      - "proof rail when relevant"
      - "verify-before-book"
      - "FAQ"
      - "final CTA"

  design_thesis:
    synthesis:
      - "guardian-grade trust infrastructure"
      - "package-first self-service booking clarity"
    meaning:
      - "JVTO should feel highly verifiable"
      - "JVTO should still feel clearly bookable"
      - "trust must reinforce package confidence"

  component_rules:
    - "Every homepage component must solve a specific decision problem."
    - "Every package-page block must reduce uncertainty."
    - "Do not overload homepage with archive-like proof."
    - "Do not let package pages become trust-first pages."
```

## 04_trust_and_governance.yaml
```yaml
spec:
  name: "JVTO Trust and Governance"
  version: "1.0"
  purpose: "Define trust graph, machine-readable trust, operational proof, visual trust temperature, and governance logic."

  trust_graph:
    summary: "Trust is a structured system, not decorative marketing."
    objectives:
      human_trust:
        purpose: "Provide reassurance that the operator is real, capable, and accountable."
      ai_entity_trust:
        purpose: "Ensure AI/search systems read JVTO as a canonical authority."
      commercial_differentiation:
        purpose: "Prove qualifications and seriousness competitors cannot replicate."

    sub_layers:
      human_layer:
        components:
          - "Founder authority"
          - "Named crew"
          - "Operational roles"
          - "Accountability"

      forensic_layer:
        components:
          - "NIB/legal identity"
          - "Police-led context"
          - "Institutional associations"
          - "Official documents"

      medical_layer:
        components:
          - "licensed doctor"
          - "Ijen screening workflow"
          - "medical readiness logic"
          - "route consequence context"

      review_layer:
        components:
          - "independent reviews"
          - "theme-based strengths"
          - "crew-linked credibility where relevant"

      historical_layer:
        components:
          - "press"
          - "recognition"
          - "awards"
          - "historical artifacts"

      institutional_layer:
        components:
          - "ISIC"
          - "HPWKI"
          - "INDECON"
          - "other affiliations"

  machine_readable_truth:
    purpose: "Make trust legible to both humans and AI/search systems."
    required_signals:
      entity_consistency:
        - "Founder, Organization, and TravelAgency identity must remain aligned."
      structured_data:
        - "Authority, trust, and operational pages must be machine-parseable."
      machine_visible_proof:
        - "Critical proof must be visible to crawlers."
      answer_first_content:
        - "Important support pages must answer key user questions early."
      forensic_verifiability:
        - "Legal and medical trust should behave like verifiable records."
      freshness_signals:
        - "Safety-related pages should show freshness when relevant."

  ai_trust_constraints:
    - "High-risk routes require visible safety seriousness."
    - "Ijen screening must be represented as a real workflow."
    - "Operational truth must beat vague marketing."
    - "Proof must be structured, specific, and consistent."

  visual_modes_as_trust_temperature:
    travel_mode:
      job:
        - "raise desire"
        - "support fast selection"
      constraints:
        - "keep operational cues visible"
        - "do not become proof-heavy"

    trust_mode:
      job:
        - "increase auditability"
        - "signal documentary seriousness"
      constraints:
        - "use structured layouts"
        - "feel like an archive of fact"

    hybrid_mode:
      job:
        - "bridge story and operations"
      constraints:
        - "blend narrative and practical blocks"
        - "stay serious, not bloggy"

  operational_proof:
    benchmark_case: "Ijen"
    rules:
      - "do not rely on symbolic safety language only"
      - "use doctor-backed workflow as visible operational seriousness"
      - "use MAGMA and route-readiness context as structured support"
      - "use operational proof as seriousness signal"

  governance_logic:
    five_operational_checks:
      - "Preserve live data foundation"
      - "Increase trust, clarity, or booking confidence"
      - "Align with package-first logic"
      - "Use local work as reference, not blind overwrite"
      - "Validate in mirror before production"

    five_step_credibility_audit:
      - "Isolate the commercial layer"
      - "Map the asset registry"
      - "Humanize authority"
      - "Ensure machine-visible proof"
      - "Audit visual modes"

  success_conditions:
    user_level:
      - "User sees JVTO is different"
      - "User sees the difference is proven"
      - "User identifies the right package"
      - "User has enough confidence to proceed"
    system_level:
      - "The website reads as one coordinated trust system"
      - "Support reduces repeated manual questions"
      - "Proof remains canonically owned"
      - "Machine-readable trust strengthens over time"
```

## 05_asset_routing.yaml
```yaml
spec:
  name: "JVTO Asset Routing"
  version: "1.0"
  purpose: "Define SSOT as asset-routing logic, not just content storage."

  ssot_role:
    old_reading: "data source"
    canonical_reading: "asset routing layer"
    meaning:
      - "SSOT determines where assets belong"
      - "SSOT determines canonical owner vs teaser"
      - "SSOT reduces manual placement decisions"

  asset_registry:
    required_file: "content/ssot-media-registry.ts"
    schema:
      role:
        allowed_values:
          - "brand-hero"
          - "destination-card"
          - "route-card"
          - "founder-identity"
          - "police-operations"
          - "medical-proof"
          - "legal-proof"
          - "continuity-proof"
          - "press-proof"
          - "review-platform"
      zone:
        allowed_values:
          - "homepage"
          - "tours"
          - "destinations"
          - "verify"
          - "travel-guide"
          - "people-layer"
          - "footer"
          - "social-preview"
      priority:
        allowed_values:
          - "core"
          - "high"
          - "supporting"
      render_style:
        allowed_values:
          - "hero-backdrop"
          - "bright-card"
          - "document-preview"
          - "proof-gallery"
          - "spotlight"
          - "badge-row"

  asset_distribution_rules:
    brand_hero_assets:
      primary_zones:
        - "homepage"
        - "social preview"
        - "top hubs"

    legal_assets:
      canonical_owner:
        - "verify/legal"
      teaser_zones:
        - "homepage"
        - "contact"

    medical_assets:
      canonical_owner:
        - "Ijen pages"
        - "travel-guide"
        - "Ijen route detail"

    police_founder_assets:
      canonical_owner:
        - "founder block"
        - "police-safety"
      teaser_zones:
        - "selected homepage teaser"

    review_assets:
      primary_zones:
        - "homepage banner"
        - "reviews hub"
        - "route support"

    press_media_assets:
      canonical_owner:
        - "press-recognition"
        - "founder context"
      teaser_zones:
        - "homepage limited teaser"

  cluster_distribution:
    homepage:
      role: "compression layer"
      expected_content:
        - "hero image"
        - "destination cards"
        - "route cards"
        - "Trustpilot teaser"
        - "compact MAGMA teaser"
        - "compact medical proof"
        - "founder teaser"
      forbidden:
        - "full legal archive"
        - "full press archive"
        - "heavy proof dominance"

    tours:
      role: "commercial decision layer"
      expected_content:
        - "route comparison"
        - "operational facts"
        - "price bands"
        - "physicality"
        - "route fit"
        - "Ijen requirements when relevant"

    destinations:
      role: "place-context layer"
      expected_content:
        - "visual desire"
        - "difficulty"
        - "route linkage"
        - "context"

    verify_jvto:
      role: "canonical archive owner"
      expected_content:
        - "legal"
        - "history"
        - "press"
        - "police"
        - "partner proof"

    travel_guide:
      role: "operational support owner"
      expected_content:
        - "MAGMA"
        - "screening"
        - "fitness"
        - "closures"
        - "escort"
        - "FAQ"

    why_jvto:
      role: "human and narrative trust owner"
      expected_content:
        - "story"
        - "people"
        - "standards"
        - "reviews synthesis"

  routing_rules:
    - "Every proof-heavy asset must have a canonical owner page."
    - "Teaser placement is allowed only when canonical ownership remains clear."
    - "Homepage is a teaser/compression surface, not a proof archive."
    - "Do not let travel surfaces become overloaded with proof-heavy assets."
```

## 06_execution_and_readiness.yaml
```yaml
spec:
  name: "JVTO Execution and Readiness"
  version: "1.0"
  purpose: "Define improve-in-place execution, rollout order, consistency pass, and implementation readiness."

  method:
    name: "improve-in-place"
    meaning:
      - "Do not rebuild the live website from zero."
      - "Use the live site and live data foundation as baseline."
      - "Use local work as UX and trust reference."
      - "Upgrade gradually."

  priority_order:
    - "package pages"
    - "tours hub"
    - "homepage"
    - "trust/support cluster"
    - "technical search layer"
    - "content system"
    - "future expansion"

  rollout_sequence:
    - step: 1
      action: "freeze homepage as baseline"
    - step: 2
      action: "build asset registry"
    - step: 3
      action: "align tours to Travel Mode"
    - step: 4
      action: "align destinations to Travel Mode"
    - step: 5
      action: "align verify-jvto to Trust Mode"
    - step: 6
      action: "align travel-guide and why-jvto to Hybrid Mode"
    - step: 7
      action: "run final consistency pass"
    - step: 8
      action: "run global copy pass"
    - step: 9
      action: "consider content-system/data-layer work"

  final_consistency_pass:
    objective:
      - "close remaining gaps"
      - "make all clusters feel like one voice"
    remaining_pages:
      - "community-standards"
      - "booking-information"
      - "safety-on-tours"
      - "faq"
      - "police-escort-for-groups"
    audit_targets:
      - "spacing"
      - "copy length"
      - "CTA consistency"
      - "cross-cluster rhythm"

  phased_readiness:
    phase_a_foundation:
      goal:
        - "audit ownership"
        - "map UX improvements to live data model"
        - "define page models"
        - "define cluster architecture"

    phase_b_core_upgrade:
      goal:
        - "upgrade package pages"
        - "upgrade tours hub"
        - "upgrade homepage"

    phase_c_technical_optimization:
      goal:
        - "implement schema"
        - "implement canonical rules"
        - "implement AI-readable trust exposure"

    phase_d_content_system:
      goal:
        - "implement content ownership"
        - "implement editable sections"
        - "implement media governance"

    phase_e_expansion:
      goal:
        - "extend to blog"
        - "extend to guides"
        - "extend to help-center growth"

  do_not_do:
    - "do not let brainstorming change priority automatically"
    - "do not do CMS-first work before board stability"
    - "do not rewrite all copy before structural and visual consistency"
    - "do not scatter proof without canonical ownership"
    - "do not overwrite live behavior blindly with local work"

  readiness_signals:
    board_is_stable_when:
      - "page roles are clear"
      - "clusters feel consistent"
      - "asset ownership is controlled"
      - "package-first flow is stable"
      - "support and proof systems are readable"
```

## 99_appendix_context.yaml
```yaml
spec:
  name: "JVTO Appendix Context"
  version: "1.0"
  purpose: "Hold supporting context that should not control the core specs."

  working_terminology:
    working_implementation:
      meaning:
        - "active build workspace"
        - "real code"
        - "runnable"
        - "testable"
        - "deployable"
        - "not automatically final art direction"

    frontend_visual_redesign:
      meaning:
        - "the implementation layer for visual presentation"
        - "includes color, typography, hierarchy, spacing, card treatment, hero treatment, CTA style, and alignment"

    final_art_direction:
      meaning:
        - "the final aesthetic lock"
        - "not yet automatically complete just because the system is working"

  internal_build_layers:
    - "content and trust architecture"
    - "UI implementation"
    - "visual system"
    - "production-ready behavior"

  reference_search_framework:
    purpose:
      - "use references by component, not by entire site only"
      - "evaluate references by function, not just by beauty"
    note:
      - "This framework is supportive only and must not override the core board."

  supportive_examples:
    - "component-level inspiration"
    - "example rendering logic"
    - "example card patterns"
    - "example CTA structures"
```
