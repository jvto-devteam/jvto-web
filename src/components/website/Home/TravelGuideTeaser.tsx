import Link from "next/link";
import { Activity, ArrowRight, BookOpen, HelpCircle, WalletCards } from "lucide-react";
import { homepageSupportGatewayDoctrine } from "@/lib/homepage/homepageDoctrine";

const iconMap = {
  wallet: WalletCards,
  activity: Activity,
  book: BookOpen,
  help: HelpCircle,
} as const;

const TravelGuideTeaser: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#121a22] py-20 text-white">
      <div className="absolute inset-y-0 right-0 w-1/2 translate-x-20 skew-x-12 bg-jvto-green/5" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 text-jvto-green">
              <BookOpen className="h-7 w-7" />
              <span className="text-sm font-bold uppercase tracking-[0.24em]">
                {homepageSupportGatewayDoctrine.eyebrow}
              </span>
            </div>

            <h2 className="text-3xl font-black uppercase leading-tight md:text-5xl">
              {homepageSupportGatewayDoctrine.title}
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
              {homepageSupportGatewayDoctrine.copy}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {homepageSupportGatewayDoctrine.actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={
                    action.variant === "primary"
                      ? "inline-flex items-center gap-2 bg-jvto-green px-8 py-3 text-sm font-black uppercase tracking-widest text-jvto-dark transition-colors hover:bg-white"
                      : "inline-flex items-center gap-2 border border-white/20 px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
                  }
                >
                  {action.label}
                  {action.variant === "primary" ? <ArrowRight className="h-4 w-4" /> : null}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {homepageSupportGatewayDoctrine.cards.map((card) => {
              const Icon = iconMap[card.icon];
              return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-sm border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-white/8"
              >
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-green">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide transition-colors group-hover:text-jvto-green">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-300">{card.copy}</p>
              </Link>
            )})}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelGuideTeaser;
