import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { homepageFinalCtaDoctrine } from "@/lib/homepage/homepageDoctrine";

const HomeFinalCta: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#101820] py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(160,188,78,0.16),transparent_30%)]" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-jvto-green">
          {homepageFinalCtaDoctrine.eyebrow}
        </p>
        <h2 className="mt-4 text-4xl font-black uppercase leading-tight md:text-6xl">
          {homepageFinalCtaDoctrine.lines[0]}
          <br />
          {homepageFinalCtaDoctrine.lines[1]}
          <br />
          <span className="text-jvto-green">{homepageFinalCtaDoctrine.lines[2]}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-300">
          {homepageFinalCtaDoctrine.copy}
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href={homepageFinalCtaDoctrine.actions[0].href}
            className="inline-flex items-center justify-center gap-2 bg-jvto-green px-7 py-4 text-sm font-black uppercase tracking-widest text-jvto-dark transition-colors hover:bg-white"
          >
            <Search className="h-4 w-4" />
            {homepageFinalCtaDoctrine.actions[0].label}
          </Link>
          <Link
            href={homepageFinalCtaDoctrine.actions[1].href}
            className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
          >
            {homepageFinalCtaDoctrine.actions[1].label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFinalCta;
