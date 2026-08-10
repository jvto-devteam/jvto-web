"use client";

// src/app/(cms)/cms/collections/narrative-claims/page.tsx
// Narrative Claims collection — client CRUD list over the highest-precedence
// FAQ source (narrative_claims). Thin page chrome around the reusable
// <NarrativeClaimEditor> (also embedded, route-filtered, by the Route Content
// Console).
import { MessageSquare } from "lucide-react";
import NarrativeClaimEditor from "@/components/cms/NarrativeClaimEditor";

export default function NarrativeClaimsCollectionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Narrative Claims
          </h1>
          <p className="text-sm text-slate-400">
            Canonical AEO brand claims. pillar = FAQ question, core_claim = FAQ
            answer, primary_page wires it to a route. Highest FAQ precedence —
            these override canonical hardcoded and CMS FAQ.
          </p>
        </div>
      </div>

      <section className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5">
        <NarrativeClaimEditor />
      </section>
    </div>
  );
}
