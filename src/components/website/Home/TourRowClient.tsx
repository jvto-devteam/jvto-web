"use client";

import { useRef, useState, useEffect } from "react";
import { ListTourPackage } from "@/types";
import TourCardStatic from "@/components/website/TourCardStatic";

interface TourRowClientProps {
  id: string;
  title: string;
  tours: ListTourPackage[];
}

type ArrowButtonProps = {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
};

const ArrowButton = ({ direction, onClick, disabled }: ArrowButtonProps) => {
  const isLeft = direction === "left";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Scroll ${direction}`}
      tabIndex={disabled ? -1 : 0}
      className={`
        hidden md:flex
        absolute top-1/2 z-10
        ${isLeft
          ? "left-0 -translate-x-1/2 -translate-y-1/2"
          : "right-0 translate-x-1/2 -translate-y-1/2"
        }
        w-12 h-12 rounded-full
        items-center justify-center
        bg-white border border-jvto-border
        shadow-md
        transition-all duration-200
        ${disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-jvto-navy hover:border-jvto-navy hover:shadow-lg cursor-pointer group"
        }
      `}
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-5 h-5 transition-colors ${disabled ? "text-jvto-muted" : "text-jvto-navy group-hover:text-white"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isLeft
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 6 15 12 9 18" />
        }
      </svg>
    </button>
  );
};

const TourRowClient = ({ id, title, tours }: TourRowClientProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState, { passive: true });
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -(el.offsetWidth * 0.8) : el.offsetWidth * 0.8,
      behavior: "smooth",
    });
  };

  if (!tours.length) return null;

  return (
    <section
      id={id}
      className="py-6 md:py-10 scroll-mt-24 border-b border-jvto-border last:border-0"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h3 className="font-display text-body-lg md:text-subheading font-black text-jvto-navy tracking-tight">
            {title}
          </h3>
          <p className="text-jvto-muted mt-1 text-caption">
            {tours.length} private itineraries available
          </p>
        </div>

        {/* Carousel — relative wrapper so buttons are centered on the edge */}
        <div className="relative -mx-6 md:mx-0">
          <ArrowButton
            direction="left"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          />
          <ArrowButton
            direction="right"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          />

          <div
            ref={scrollRef}
            className="flex md:gap-5 gap-3 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-6 md:px-0"
          >
            {tours.map((tour, index) => (
              <div key={tour.id} className="flex-shrink-0 w-[80vw] sm:w-[350px]">
                <TourCardStatic isNewTab tour={tour} prioritizeImage={index === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourRowClient;
