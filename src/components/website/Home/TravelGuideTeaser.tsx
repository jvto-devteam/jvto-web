import Link from "next/link";
import { Activity, ArrowRight, BookOpen, HelpCircle, WalletCards } from "lucide-react";

const guideCards = [
  {
    href: "/travel-guide/booking-information",
    title: "Booking Information",
    copy: "Deposits, timing, and how the booking process actually works before payment.",
    Icon: WalletCards,
  },
  {
    href: "/travel-guide/ijen-health-screening",
    title: "Ijen Screening",
    copy: "Medical clearance and QR logic explained before you commit to an Ijen route.",
    Icon: Activity,
  },
  {
    href: "/travel-guide",
    title: "Prepare & Book",
    copy: "Use the support hub when you need packing, route readiness, and practical answers in one place.",
    Icon: BookOpen,
  },
  {
    href: "/contact",
    title: "Need A Human Answer?",
    copy: "If the route fits but you still have a question, contact JVTO directly before paying a deposit.",
    Icon: HelpCircle,
  },
] as const;

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
                Prepare &amp; Book
              </span>
            </div>

            <h2 className="text-3xl font-black uppercase leading-tight md:text-5xl">
              Review the route support
              <br />
              before you pay.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
              JVTO should not force guests to click around blindly after they are
              already emotionally sold. Booking information, Ijen readiness,
              safety context, and practical guidance belong close to the decision.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/travel-guide"
                className="inline-flex items-center gap-2 bg-jvto-green px-8 py-3 text-sm font-black uppercase tracking-widest text-jvto-dark transition-colors hover:bg-white"
              >
                Open Prepare &amp; Book
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/policy"
                className="inline-flex items-center gap-2 border border-white/20 px-8 py-3 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
              >
                Policies &amp; Rules
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {guideCards.map(({ href, title, copy, Icon }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-sm border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-white/8"
              >
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-green">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide transition-colors group-hover:text-jvto-green">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-300">{copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelGuideTeaser;
