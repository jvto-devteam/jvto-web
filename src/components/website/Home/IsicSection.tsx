import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function IsicSection() {
  return (
    <section className="py-10 bg-gray-900 border-y border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Side: Icon & Text */}
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            {/* Icon Container - Clean & Modern */}
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
              <GraduationCap className="w-8 h-8 text-jvto-green" strokeWidth={2} />
            </div>
            
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Student? Have an ISIC Card?
              </h3>
              <p className="text-gray-400 font-medium mt-1 text-lg">
                We offer fair pricing and special packages for students.
              </p>
            </div>
          </div>

          {/* Right Side: Action Button */}
          <Link 
            target="_blank"
            href="/isic/student-package" 
            prefetch={false}
            className="group flex-shrink-0 inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-black transition-all duration-200 bg-lime-400 hover:bg-lime-500 rounded-lg uppercase tracking-widest"
          >
            Get Deals
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
        </div>
      </div>
    </section>
  );
}
