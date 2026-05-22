// src/components/website/GroupBookingCTA.tsx
import Link from "@/components/website/AppLink";
import { Users } from "lucide-react";

export default function GroupBookingCTA() {
  return (
    <div className="mt-6 rounded-xl bg-slate-900 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-jvto-green/20 flex items-center justify-center">
          <Users size={18} className="text-jvto-green" aria-hidden="true" />
        </div>
        <p className="font-black text-sm uppercase tracking-wide">
          Group of 6+?
        </p>
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-300 leading-snug">
          Police escort coordination available — no extra charge.
        </p>
      </div>
      <Link
        href="/travel-guide/police-escort-for-groups"
        className="shrink-0 text-xs font-black uppercase tracking-widest text-jvto-green hover:text-white transition-colors whitespace-nowrap"
      >
        Learn more →
      </Link>
    </div>
  );
}
