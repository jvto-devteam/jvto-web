import Link from "@/components/website/AppLink";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function IsicSection() {
  return (
    <section className="py-10 bg-jvto-navy border-y border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: Icon & Text */}
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              <GraduationCap className="w-8 h-8 text-jvto-lime" strokeWidth={2} />
            </div>
            <div>
              <h3
                className="text-2xl font-black text-white tracking-tight"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                Student? Have an ISIC Card?
              </h3>
              <p className="text-white/50 font-medium mt-1 text-base">
                We offer fair pricing and special packages for students.
              </p>
            </div>
          </div>

          {/* Right: CTA */}
          <Link
            target="_blank"
            href="/isic/student-package"
            prefetch={false}
            className="group flex-shrink-0 inline-flex items-center justify-center px-8 py-3 text-xs font-bold text-jvto-navy transition-all duration-200 bg-jvto-lime hover:bg-jvto-lime/90 rounded-full uppercase tracking-[0.2em]"
          >
            Get Deals
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>
      </div>
    </section>
  );
}
