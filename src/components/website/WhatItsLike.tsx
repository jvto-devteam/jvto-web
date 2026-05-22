// src/components/website/WhatItsLike.tsx
import { Compass } from "lucide-react";

interface WhatItsLikeProps {
  description: string;
}

export default function WhatItsLike({ description }: WhatItsLikeProps) {
  // Extract first 2–3 sentences as the experience-forward teaser
  const sentences = description.split(/(?<=[.!?])\s+/);
  const teaser = sentences.slice(0, 3).join(" ");

  return (
    <section className="bg-white border-b border-slate-100 py-10">
      <div className="container mx-auto px-6 max-w-3xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-jvto-green mb-4 flex items-center gap-2">
          <Compass size={12} /> What&#39;s It Like?
        </p>
        <p className="text-slate-700 text-lg leading-relaxed italic">
          {teaser}
        </p>
      </div>
    </section>
  );
}
