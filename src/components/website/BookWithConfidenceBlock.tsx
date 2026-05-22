// src/components/website/BookWithConfidenceBlock.tsx
import Link from "@/components/website/AppLink";
import { ShieldCheck, HeartHandshake, FileText } from "lucide-react";

const CONFIDENCE_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Safe by Design",
    description: "Police-coordinated tour operations",
    href: "/travel-guide/safety-on-tours",
  },
  {
    icon: HeartHandshake,
    title: "What's Covered",
    description: "Cancellation & refund conditions",
    href: "/policy/booking-payment-cancellation",
  },
  {
    icon: FileText,
    title: "Why JVTO?",
    description: "Credentials, team & track record",
    href: "/why-jvto/the-jvto-difference",
  },
] as const;

export default function BookWithConfidenceBlock() {
  return (
    <section className="border-t border-jvto-border pt-10 mt-10">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
        Book with Confidence
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CONFIDENCE_ITEMS.map(({ icon: Icon, title, description, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-jvto-green/40 hover:bg-jvto-green/5 transition-all group"
          >
            <Icon size={20} className="text-jvto-green shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-900 group-hover:text-jvto-green transition-colors">
                {title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
