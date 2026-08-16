"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.437436214531!2d113.8085867759296!3d-7.916178892019881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6dce1d25a03db%3A0x11932bb44bf4e2bd!2sJava%20Volcano%20Tour%20Operator!5e0!3m2!1sen!2sid!4v1722839981585!5m2!1sen!2sid";

interface ContactMapEmbedProps {
  defer?: boolean;
}

const ContactMapEmbed: React.FC<ContactMapEmbedProps> = ({ defer = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(!defer);

  useEffect(() => {
    if (!defer || shouldLoad || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [defer, shouldLoad]);

  return (
    <div
      ref={containerRef}
      className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 h-[500px] overflow-hidden relative group"
    >
      {shouldLoad ? (
        <iframe
          src={MAP_SRC}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Java Volcano Tour Operator Location"
          className="w-full h-full rounded-2xl grayscale contrast-[1.1] group-hover:grayscale-0 transition-all duration-500"
        />
      ) : (
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-100 via-white to-slate-200 border border-slate-200 flex items-center justify-center text-center p-8">
          <div className="max-w-sm">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-green-600">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              View Our Office Location
            </h3>
            <p className="text-sm text-slate-600 mb-5">
              The map loads only when this section comes into view or when you open it manually.
            </p>
            <button
              type="button"
              onClick={() => setShouldLoad(true)}
              className="inline-flex items-center justify-center bg-jvto-navy text-white px-5 py-3 rounded-full font-bold text-sm hover:bg-black transition-colors"
            >
              Load Map
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
        <p className="text-xs font-bold text-green-600 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Java Volcano Base
        </p>
      </div>
    </div>
  );
};

export default ContactMapEmbed;
