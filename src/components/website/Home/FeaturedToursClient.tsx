"use client";

import { useRef, forwardRef } from "react";
import Link from "next/link";
import { ListTourPackage } from "@/types";
import TourCard from "../TourCard";
import {MapPin, ArrowLeft, ArrowRight } from "lucide-react";

// --- TIPE DATA ---
interface FeaturedToursClientProps {
  surabayaTours: ListTourPackage[];
  baliTours: ListTourPackage[];
}

interface TourRowProps {
  title: string;
  tours: ListTourPackage[];
  bgColor?: string; // Opsional untuk membedakan background section
}

// --- SUB-COMPONENT: TOUR CAROUSEL ROW ---
// Menggunakan forwardRef agar parent bisa melakukan scrollIntoView ke komponen ini
const TourCarouselRow = forwardRef<HTMLDivElement, TourRowProps>(
  ({ title, tours, bgColor = "bg-white" }, ref) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Logic scroll horizontal (kiri/kanan) untuk carousel
    const scroll = (direction: "left" | "right") => {
      if (scrollContainerRef.current) {
        // Scroll sebesar 80% dari lebar layar agar user masih melihat konteks item berikutnya
        const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
        scrollContainerRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    if (tours.length === 0) return null;

    return (
      <section
        ref={ref}
        className={`py-6 md:py-12 scroll-mt-24 border-b border-gray-100 last:border-0 ${bgColor}`}
      >
        <div className="container mx-auto px-6">
          {/* Header Section: Judul & Tombol Navigasi Carousel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-black uppercase text-jvto-dark tracking-wide">
                {title}
              </h3>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                {tours.length} adventures available
              </p>
            </div>

            {/* Tombol Panah Kiri/Kanan */}
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-jvto-dark hover:text-white hover:border-jvto-dark transition-all duration-300 group"
                aria-label="Scroll Left"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-jvto-dark hover:text-white hover:border-jvto-dark transition-all duration-300 group"
                aria-label="Scroll Right"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative -mx-6 md:mx-0 md:px-0">
            <div
              ref={scrollContainerRef}
              className="flex md:gap-6 gap-3 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollBehavior: "smooth" }}
            >
              {tours.map((tour,key) => (
                <div
                  key={tour.id}
                  className={` ${key == 0 ? 'ml-6' : ''} ${key+1 == tours.length ? 'mr-6' : ''} flex-shrink-0 w-[80vw] sm:w-[350px]`}
                >
                  <TourCard isNewTab={true} tour={tour} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
);

// Diperlukan displayName untuk debugging React Component dengan forwardRef
TourCarouselRow.displayName = "TourCarouselRow";

// --- MAIN CLIENT COMPONENT ---
const FeaturedToursClient = ({
  surabayaTours,
  baliTours,
}: FeaturedToursClientProps) => {
  // Ref untuk target scroll
  const surabayaRef = useRef<HTMLDivElement>(null);
  const baliRef = useRef<HTMLDivElement>(null);

  // Handler untuk scroll ke section tertentu
  const scrollToSection = (location: "surabaya" | "bali") => {
    const targetRef = location === "surabaya" ? surabayaRef : baliRef;
    
    if (targetRef.current) {
      // Offset -100px agar judul section tidak tertutup sticky header (jika ada)
      const yOffset = -100; 
      const element = targetRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* --- HERO / HEADER SECTION --- */}
      <div className="container mx-auto px-6 text-center mb-16">
        <div className="w-16 h-16 mx-auto mb-6 bg-jvto-green rounded-full flex items-center justify-center">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase mb-6">
          Start Your Route
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Choose your origin. We handle the rest: private vehicle, drivers, Bromo jeep, permits, and no shared groups.
        </p>
        {/* --- NAVIGATION BUTTONS --- */}
        <div className="flex mt-8 items-center justify-center md:gap-4 gap-2 relative z-10">
          <button
            onClick={() => scrollToSection("surabaya")}
            className="w-full sm:w-auto md:px-8 py-3 bg-white border-2 border-jvto-dark text-jvto-dark font-bold uppercase tracking-wider rounded-sm shadow-lg hover:-translate-y-1 hover:shadow-xl hover:bg-jvto-dark hover:text-white transition-all duration-300"
          >
            From Surabaya
          </button>
          
          <button
            onClick={() => scrollToSection("bali")}
            className="w-full sm:w-auto md:px-8 py-3 bg-white border-2 border-jvto-dark text-jvto-dark font-bold uppercase tracking-wider rounded-sm shadow-lg hover:-translate-y-1 hover:shadow-xl hover:bg-jvto-dark hover:text-white transition-all duration-300"
          >
            From Bali
          </button>
        </div>
      </div>

      {/* --- CONTENT SECTIONS (STACKED) --- */}
      <div>
        <TourCarouselRow
          ref={surabayaRef}
          title="Tours From Surabaya"
          tours={surabayaTours}
        />
        
        <TourCarouselRow
          ref={baliRef}
          title="Tours From Bali"
          tours={baliTours}
        />
      </div>

      {/* --- FOOTER CTA --- */}
      <div className="text-center container mx-auto px-6">
        <Link
          target="_blank"
          href="/tours"
          prefetch={false}
          className="inline-flex items-center gap-2 bg-jvto-dark text-white px-10 py-4 font-bold uppercase tracking-widest rounded-lg shadow-xl hover:bg-gray-800 hover:-translate-y-1 transition-all"
        >
          View All Tours
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedToursClient;
