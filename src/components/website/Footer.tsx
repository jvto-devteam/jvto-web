import React from "react";
import {
  ArrowRight,
  Facebook,
  FileCheck,
  Instagram,
  MapPin,
  Shield,
  Thermometer,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const trustSignals = [
  {
    icon: <Shield className="h-5 w-5 text-lime-600" />,
    title: "Tourist Police-Led",
    copy: "Private routes framed around safety, route clarity, and direct operator handling.",
  },
  {
    icon: <FileCheck className="h-5 w-5 text-lime-600" />,
    title: "Licensed Operator",
    copy: "PT Java Volcano Rendezvous with verification routes and policy paths visible before payment.",
  },
  {
    icon: <MapPin className="h-5 w-5 text-lime-600" />,
    title: "East Java Ground Team",
    copy: "Bondowoso-based operations with route coverage across Bromo, Ijen, waterfalls, and overland combinations.",
  },
  {
    icon: <Thermometer className="h-5 w-5 text-lime-600" />,
    title: "Route Conditions Matter",
    copy: "Weather, closure context, and health screening are treated as part of the decision, not afterthoughts.",
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8faf5_18%,#0f172a_18%,#020617_100%)] text-white">
      <div className="container mx-auto px-6 pt-16 pb-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-slate-900 shadow-[0_28px_70px_rgba(15,23,42,0.08)] md:p-10">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-lime-700">
              <span>Private Tours</span>
              <span className="h-1 w-1 rounded-full bg-lime-400" />
              <span>Proof Before Payment</span>
              <span className="h-1 w-1 rounded-full bg-lime-400" />
              <span>Prepare & Book Support</span>
            </div>
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <Link href="/" className="inline-flex items-center gap-3">
                  <Image
                    src="/assets/img/jvto-logo.png"
                    alt="JVTO Logo"
                    width={72}
                    height={72}
                    className="object-contain"
                  />
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                      Java Volcano Tour Operator
                    </p>
                    <h2 className="mt-2 text-2xl font-black uppercase leading-tight text-slate-900 md:text-3xl">
                      Keep the route, the proof, and the booking logic in one place.
                    </h2>
                  </div>
                </Link>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  JVTO is built for travelers who want the commercial route page and the operator proof path to stay connected. Compare trips, verify the operator, and move into booking with less guesswork.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8faf5_100%)] p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-lime-700">
                  Start with the right next step
                </p>
                <div className="mt-5 grid gap-3">
                  <Link
                    href="/tours"
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-900 transition hover:border-lime-300 hover:text-lime-700"
                  >
                    <span>Browse Private Tours</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/verify-jvto"
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-900 transition hover:border-lime-300 hover:text-lime-700"
                  >
                    <span>Open Verify JVTO</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/travel-guide/booking-information"
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-900 transition hover:border-lime-300 hover:text-lime-700"
                  >
                    <span>Read Booking Information</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trustSignals.map((signal) => (
              <div
                key={signal.title}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="inline-flex rounded-2xl bg-white/10 p-3">
                  {signal.icon}
                </div>
                <h3 className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-white">
                  {signal.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {signal.copy}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-lime-400">
              Official contact
            </p>
            <h3 className="mt-3 text-xl font-black uppercase text-white">
              PT Java Volcano Rendezvous
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Jl. Khairil Anwar No.102 A, Badean, Bondowoso, East Java 68214, Indonesia
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              WhatsApp: +62 822-4478-8833
              <br />
              Email: hello@javavolcano-touroperator.com
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-lime-400 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-lime-300"
              >
                Contact JVTO
              </Link>
              <Link
                href="/policy/privacy"
                className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:border-lime-400 hover:text-lime-300"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.18em] text-slate-200">
                Tours
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li><Link href="/tours" className="transition hover:text-lime-300">All Private Tours</Link></li>
                <li><Link href="/tours/from-surabaya" className="transition hover:text-lime-300">From Surabaya</Link></li>
                <li><Link href="/tours/from-bali" className="transition hover:text-lime-300">From Bali</Link></li>
                <li><Link href="/destinations" className="transition hover:text-lime-300">Destinations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.18em] text-slate-200">
                Trust
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li><Link href="/why-jvto" className="transition hover:text-lime-300">Why JVTO</Link></li>
                <li><Link href="/verify-jvto" className="transition hover:text-lime-300">Verify JVTO</Link></li>
                <li><Link href="/why-jvto/our-story" className="transition hover:text-lime-300">Our Story</Link></li>
                <li><Link href="/why-jvto/reviews" className="transition hover:text-lime-300">Reviews</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.18em] text-slate-200">
                Prepare
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li><Link href="/travel-guide" className="transition hover:text-lime-300">Prepare & Book</Link></li>
                <li><Link href="/travel-guide/booking-information" className="transition hover:text-lime-300">Booking Information</Link></li>
                <li><Link href="/travel-guide/ijen-health-screening" className="transition hover:text-lime-300">Ijen Screening</Link></li>
                <li><Link href="/travel-guide/weather-and-closures" className="transition hover:text-lime-300">Weather & Closures</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.18em] text-slate-200">
                Policies
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li><Link href="/policy" className="transition hover:text-lime-300">Policy Hub</Link></li>
                <li><Link href="/policy/privacy" className="transition hover:text-lime-300">Privacy</Link></li>
                <li><Link href="/student-deals/isic" className="transition hover:text-lime-300">Student Deals</Link></li>
                <li><Link href="/contact" className="transition hover:text-lime-300">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="text-xs leading-6 text-slate-400">
            <p>Copyright 2015-2026 PT. Java Volcano Rendezvous. All Rights Reserved.</p>
            <p>Popular with travelers from Singapore, Malaysia, Hong Kong, and Taiwan.</p>
          </div>

          <div className="flex gap-3">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/javavolcanotouroperator/"
              aria-label="Instagram"
              className="rounded-full border border-white/10 bg-white/5 p-3 transition hover:border-lime-400 hover:text-lime-300"
            >
              <Instagram size={16} />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.facebook.com/javavolcanotours/"
              aria-label="Facebook"
              className="rounded-full border border-white/10 bg-white/5 p-3 transition hover:border-lime-400 hover:text-lime-300"
            >
              <Facebook size={16} />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="#"
              aria-label="Twitter"
              className="rounded-full border border-white/10 bg-white/5 p-3 transition hover:border-lime-400 hover:text-lime-300"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
