"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Check,
  QrCode,
  X,
  MapPin,
  ArrowRight,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const IMAGES = [
  {
    src: "/screening/ijen-screening-hotel-01.jpeg",
    alt: "Nurse performing medical check at hotel",
  },
  {
    src: "/screening/ijen-screening-hotel-02.jpg",
    alt: "Health screening session at hotel lobby",
  },
  {
    src: "/screening/jvto-office-screening-1.JPG",
    alt: "Medical screening at JVTO office",
  },
  {
    src: "/screening/jvto-office-screening-2.jpg",
    alt: "Health check process at JVTO office",
  },
];

const IjenHealthScreeningSection = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i === 0 ? IMAGES.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === IMAGES.length - 1 ? 0 : i + 1));

  // Auto-play setiap 4 detik
//   useEffect(() => {
//     const timer = setInterval(next, 4000);
//     return () => clearInterval(timer);
//   }, []);

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Content Side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 mb-6">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Mandatory Requirement
                </span>
              </div>

              <h2 className="font-sans font-black text-3xl md:text-5xl text-gray-900 mb-6 leading-tight uppercase tracking-tight">
                Real Medical Check <br />
                <span className="text-jvto-green">Included</span>
              </h2>

              <p className="font-sans text-lg text-gray-600 mb-8 leading-relaxed">
                Kawah Ijen is not a walk in the park. It's a high-altitude
                volcano with sulfur gas. We include a{" "}
                <span className="font-bold text-gray-900 bg-jvto-green/10 px-1">
                  REAL screening
                </span>{" "}
                by trained medical staff to ensure your safety.
              </p>

              <ul className="space-y-4 font-sans text-gray-800 mb-10">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded bg-jvto-green flex items-center justify-center text-white mt-1">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                  <span className="font-medium">
                    Included in your package cost.
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded bg-jvto-green flex items-center justify-center text-white mt-1">
                    <QrCode className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <span className="font-medium">
                    Digital QR verification at the gate.
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded bg-red-500 flex items-center justify-center text-white mt-1">
                    <X className="w-4 h-4" strokeWidth={3} />
                  </div>
                  <span className="font-medium">
                    Reduces fake letters & avoidable accidents.
                  </span>
                </li>
              </ul>

              <div>
                <Link
                  target="_blank"
                  href="/travel-guide/ijen-health-screening"
                  className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white transition-all duration-200 bg-black hover:bg-[#8cb82b] rounded-sm uppercase tracking-widest group"
                >
                  See How It Works
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Image Carousel Side */}
            <div className="relative min-h-[300px] h-full overflow-hidden group/carousel">
              {/* Slides */}
              {IMAGES.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === current ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-l md:from-transparent md:to-transparent pointer-events-none" />

              {/* Prev / Next Buttons */}
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 group-hover/carousel:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 group-hover/carousel:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {IMAGES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    aria-label={`Go to image ${index + 1}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-all"
                  >
                    <span
                      className={`block h-2.5 w-2.5 rounded-full transition-all ${
                        index === current
                          ? "bg-white scale-125"
                          : "bg-white/60 hover:bg-white/80"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Location Label */}
              <div className="absolute bottom-6 left-6 right-6 md:right-auto bg-white/90 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-sm shadow-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-jvto-green" />
                  <p className="font-sans font-bold text-xs uppercase text-gray-900">
                    Location: Your Hotel Lobby
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IjenHealthScreeningSection;
