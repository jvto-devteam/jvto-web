"use client";

import Image from "next/image"; // Gunakan next/image di sini karena asset internal (optimasi ok)
import Link from "next/link";
import {
  ShieldCheck,
  FileCheck,
  HeartPulse,
  Users,
  Map,
  ArrowRight,
  Siren,
} from "lucide-react";
import Button from "@/components/website/UI/Button";
import ssotData from "@/lib/Master_Dataset_JVTO.SSOT.v2.1.public.ready_to_copy.json";

export default function WhyJvtoClient() {
  // Ambil data aset dari SSOT untuk gambar background/founder
  const heroImage =
    ssotData.assets_inventory.find((a) => a.slug === "jvto-hero-image")?.url ||
    "/assets/img/hero/home.webp";
  const founderImage = ssotData.assets_inventory.find(
    (a) => a.slug === "mr-sam-tourist-police-portrait",
  )?.url;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* SECTION 1: HERO - THE ANXIETY RESOLUTION */}
      {/* Mengatasi "Pre-purchase anxiety" dengan statement otoritas langsung */}
      <section className="relative h-[100vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Java Volcano Landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          {/* THE AUTHORITY SHIELD COMPONENT */}
          {/* Sesuai PDF Hal 9: "Authority Shield... clickable Verification Loop" */}
          <Link
            href="/verify-jvto"
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-900/90 border border-yellow-500/50 text-yellow-400 rounded-full text-xs font-bold uppercase tracking-widest mb-8 hover:bg-blue-800 transition-colors shadow-lg hover:shadow-yellow-500/20 group"
          >
            <ShieldCheck className="w-4 h-4" />
            Operated by Active Tourist Police
            <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
          </Link>

          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Not Just a Tour.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
              A Guardian Infrastructure.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            In the volcanic corridors of East Java, safety is not a commodity—it
            is a discipline. Experience Mount Bromo and Ijen Crater with the
            operational certainty of a police-led team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 border-none font-bold px-8 py-4 text-base"
              asChild
            >
              <Link href="/tours">Check Availability</Link>
            </Button>
            <Button
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-base"
              asChild
            >
              <Link href="/verify-jvto">Forensic Evidence Locker</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 5 PIN-POINTS (HUB NAVIGATION) */}
      {/* Sesuai PDF Hal 3: "Hub and Spoke Authority Model" */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* PIN-POINT 1: POLICE AUTHORITY */}
            <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-blue-900 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-900">
                <Siren className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Tourist Police Command
              </h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Founded by <strong>Agung Sambuko (Mr. Sam)</strong>, an active
                Tourist Police officer. We don't just follow safety protocols;
                we write them.
              </p>
              <Link
                href="/verify-jvto?tab=police_clearances"
                className="text-blue-700 font-bold text-sm flex items-center gap-2 hover:underline"
              >
                View Police Orders (SPRIN) <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* PIN-POINT 2: LEGAL LEGITIMACY */}
            <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-yellow-500 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6 text-yellow-700">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Registered & Verifiable
              </h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                No ghost operators. We are a registered PT (Limited Liability
                Company) with NIB legality and a physical HQ you can visit.
              </p>
              <Link
                href="/verify-jvto?tab=company_registration"
                className="text-yellow-700 font-bold text-sm flex items-center gap-2 hover:underline"
              >
                Audit Legal Docs (NIB) <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* PIN-POINT 3: HEALTH INNOVATION */}
            <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-red-500 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6 text-red-600">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Digital Health Screening
              </h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                We reject fake medical letters. Our proprietary digital
                screening logs your vitals before the Ijen ascent.
              </p>
              <Link
                href="/verify-jvto?tab=health_safety"
                className="text-red-600 font-bold text-sm flex items-center gap-2 hover:underline"
              >
                See Screening Protocols <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* PIN-POINT 4: TRANSPARENCY PROMISE */}
            <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-slate-500 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6 text-slate-700">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Private & All-Inclusive
              </h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                No hidden costs. No mixed groups. Agility is safety in volcanic
                terrain. We operate under a strict "Rulebook Doctrine."
              </p>
              <Link
                href="/travel-guide"
                className="text-slate-700 font-bold text-sm flex items-center gap-2 hover:underline"
              >
                Read The Rulebook <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* PIN-POINT 5: COMMUNITY & PERSONALITY */}
            <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-emerald-500 md:col-span-2 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 text-emerald-700">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    The Personality Economy
                  </h3>
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                    You don't trust faceless companies; you trust people. Meet
                    our "Legends"—specialized guides verified for Photography,
                    Safety, and Storytelling.
                  </p>
                  <Link
                    href="/why-jvto/meet-the-legends"
                    className="text-emerald-700 font-bold text-sm flex items-center gap-2 hover:underline"
                  >
                    Meet The Legends <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                {/* Visual Teaser for Team */}
                <div className="hidden md:block w-1/3 relative h-32 bg-slate-100 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Placeholder visual jika belum ada foto team spesifik di SSOT yg cocok, bisa pakai foto grup */}
                  <img
                    src={
                      ssotData.assets_inventory.find(
                        (a) => a.slug === "baratha-hotel-departure-team",
                      )?.url
                    }
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="JVTO Team"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE FOUNDER STORY TEASER (SPOKE A) */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
                {/* Menggunakan tag img untuk stabilitas, seperti di VerifyJvtoClient */}
                <img
                  src={founderImage}
                  alt="Agung Sambuko - Tourist Police"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white font-bold text-lg">
                    Agung Sambuko (Mr. Sam)
                  </p>
                  <p className="text-yellow-400 text-sm font-mono">
                    Active Tourist Police Officer
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                Origin Story
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                "I didn't start a travel agency.
                <br />I built a safety protocol."
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Witnessing the chaos of unregulated tourism as a police officer
                on the ground, I realized that international guests needed more
                than just a driver. They needed a guardian.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                JVTO evolved from a humble homestay into a specialized operator
                to bridge the gap between "Open Trip" chaos and professional
                certainty.
              </p>
              <Button
                variant="outline"
                className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                asChild
              >
                <Link href="/why-jvto/our-story">Read The Full Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION */}
      <section className="py-24 bg-slate-900 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-8">
            Stop Guessing. Start Verifying.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
            The market is full of noise. We offer signal. Check our documents,
            meet our team, and book with absolute certainty.
          </p>
          <Button
            className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 px-10 py-6 text-lg font-bold rounded-full shadow-lg shadow-yellow-500/20"
            asChild
          >
            <Link href="/tours">Secure Your Expedition</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
