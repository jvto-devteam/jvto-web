import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { foundersMissionCopy } from "@/constants";

interface FoundersMissionProps {
  onCtaClick: (ctaId: string, ctaText: string, section: string) => void;
}

// Helper to render title with highlighted word from **word** syntax
const renderTitle = (title: string) => {
  const parts = title.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={index} className="text-primary">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
};

const FoundersMission: React.FC<FoundersMissionProps> = ({ onCtaClick }) => {
  return (
    <section className="py-16 md:py-28 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="w-full order-1 md:order-2 flex items-center justify-center">
            <img
              src={foundersMissionCopy.imageUrl}
              alt="JVTO Founder, Mr. Sam"
              className="object-contain w-full h-auto max-h-[600px] rounded-lg shadow-lg"
            />
          </div>

          {/* Content */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <p className="font-semibold tracking-widest text-primary uppercase">
              {foundersMissionCopy.overline}
            </p>

            <div className="w-16 h-0.5 bg-primary mt-3 mb-5 mx-auto md:mx-0" />

            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-ink-primary dark:text-white">
              {renderTitle(foundersMissionCopy.title)}
            </h2>

            <p className="mt-6 text-ink-neutral-700 dark:text-ink-neutral-300 leading-relaxed max-w-prose mx-auto md:mx-0">
              {foundersMissionCopy.text}
            </p>

            {/* CTA */}
            <div className="mt-10">
              <Link
                href="/why-jvto/our-story"
                onClick={() =>
                  onCtaClick(
                    "why_story",
                    foundersMissionCopy.cta,
                    "founders_mission"
                  )
                }
                className="group inline-flex items-center gap-3 px-6 py-3 bg-primary rounded-lg text-white font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
              >
                <span>{foundersMissionCopy.cta}</span>
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersMission;
