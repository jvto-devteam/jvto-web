// src/components/website/WhatItsLike.tsx
import { Compass } from "lucide-react";

interface WhatItsLikeProps {
  description: string;
}

export default function WhatItsLike({ description }: WhatItsLikeProps) {
  // Extract first 2–3 sentences as the experience-forward teaser
  const sentences = description.trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  const teaser = sentences.length > 0
    ? sentences.slice(0, 3).join(" ")
    : description.trim().slice(0, 200);

  return (
    <section className="bg-white border-b border-jvto-border py-10" aria-labelledby="whats-it-like-label">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 id="whats-it-like-label" className="text-[10px] font-black uppercase tracking-widest text-jvto-green mb-4 flex items-center gap-2">
          <Compass size={12} aria-hidden="true" /> What&#39;s It Like?
        </h2>
        <p className="text-ink-neutral-700 text-lg leading-relaxed italic">
          {teaser}
        </p>
      </div>
    </section>
  );
}
