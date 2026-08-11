import Link from "@/components/website/AppLink";
import { BookOpen, HelpCircle, ArrowRight, DollarSign, Activity, ShieldCheck } from "lucide-react";

const GUIDE_CARDS = [
  {
    href: "/travel-guide/faq",
    icon: HelpCircle,
    title: "FAQ",
    desc: "Common questions about private tours, logistics, and safety.",
  },
  {
    href: "/travel-guide/booking-information",
    icon: DollarSign,
    title: "Booking & Payments",
    desc: "Deposits, Travel Credit, and cancellation policies explained.",
  },
  {
    href: "/travel-guide/ijen-health-screening",
    icon: Activity,
    title: "Ijen Screening",
    desc: "Mandatory health checks and digital certificates for the crater hike.",
  },
  {
    href: "/travel-guide/safety-on-tours",
    icon: ShieldCheck,
    title: "Safety & Risks",
    desc: "Our police-led safety culture and risk management protocols.",
  },
];

const TravelGuideTeaser: React.FC = () => {
  return (
    <section className="py-20 bg-jvto-navy text-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-6">
              <BookOpen size={14} className="text-jvto-lime" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
                Plan First, Then Decide
              </span>
            </div>
            <h2
              className="text-3xl md:text-5xl font-black mb-6 leading-tight"
              style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
            >
              Read the Rulebook{" "}
              <span className="text-jvto-orange italic">Before You Book</span>
            </h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              You do not have to book immediately. We keep our rules transparent
              so you know exactly what to expect. Read our Travel Guide to
              understand cancellations, health screening, packing lists, and
              safety protocols before you pay a deposit.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                target="_blank"
                href="/travel-guide"
                prefetch={false}
                className="bg-jvto-orange text-white px-8 py-3 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors inline-flex items-center gap-2"
                style={{ boxShadow: "var(--shadow-jvto-orange)" }}
              >
                Open Travel Guide <ArrowRight size={14} />
              </Link>
              <Link
                target="_blank"
                href="/contact"
                prefetch={false}
                className="border border-white/30 text-white px-8 py-3 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GUIDE_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.href}
                    target="_blank"
                    href={card.href}
                    prefetch={false}
                    className="group bg-white/5 p-6 rounded-[24px] hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <Icon className="text-jvto-lime mb-4 w-6 h-6 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-base mb-2 group-hover:text-jvto-orange transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-white/50">{card.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TravelGuideTeaser;
