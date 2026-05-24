// src/components/website/Home/HomeTrustStrip.tsx
import { ShieldCheck, Star, FileText, MapPin } from "lucide-react";

const CREDENTIALS = [
  { Icon: ShieldCheck, text: "Tourist Police (POLPAR)" },
  { Icon: Star, text: "Trustpilot 4.8★ · 51 Reviews" },
  { Icon: FileText, text: "NIB 1102230032918" },
  { Icon: MapPin, text: "Physical Office · Bondowoso" },
] as const;

export default function HomeTrustStrip() {
  return (
    <div className="bg-jvto-off border-b border-jvto-navy/10">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 py-4 px-6">
        {CREDENTIALS.map(({ Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2 text-sm font-semibold text-jvto-navy/80"
          >
            <Icon size={16} className="text-jvto-green flex-shrink-0" aria-hidden="true" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
