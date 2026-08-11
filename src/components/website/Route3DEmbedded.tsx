"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { FeatureCollection } from "geojson";
import type { RouteStats } from "@/app/(website)/destinations/[slug]/page";

const Route3DViewer = dynamic(() => import("@/components/Route3DViewer"), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

function LoadingSkeleton() {
  return (
    <div className="h-[500px] md:h-[560px] rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-slate-400 rounded-full animate-spin mx-auto mb-3" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
          Loading 3D terrain…
        </span>
      </div>
    </div>
  );
}

function prettifySlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function Route3DEmbedded({
  slug,
  routeStats,
  geojson: geojsonProp,
}: {
  slug: string;
  routeStats: RouteStats;
  // Preferred path: geojson loaded from the DB (jvto-cms GPX upload) via the destination
  // detail query, passed straight through — no fetch needed. Falls back to the legacy
  // public/routes/{slug}.geojson static export when absent (destination not re-uploaded yet).
  geojson?: FeatureCollection | null;
}) {
  const hasGeojsonProp = geojsonProp != null;
  const [geojson, setGeojson] = useState<FeatureCollection | null>(geojsonProp ?? null);
  const [loading, setLoading] = useState(!hasGeojsonProp);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (hasGeojsonProp) return;
    if (!inView) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetch(`/routes/${slug}.geojson`)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((data: FeatureCollection) => {
        if (cancelled) return;
        setGeojson(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, inView, attempt, hasGeojsonProp]);

  if (!inView) {
    return <div ref={sentinelRef}><LoadingSkeleton /></div>;
  }

  if (error) {
    return (
      <div ref={sentinelRef} className="h-[500px] md:h-[560px] rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
        <div className="text-center text-slate-500 text-sm">
          <p className="font-semibold mb-1">Failed to load route data</p>
          <button
            onClick={() => setAttempt((n) => n + 1)}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || !geojson) {
    return <div ref={sentinelRef}><LoadingSkeleton /></div>;
  }

  return (
    <div ref={sentinelRef}>
      <Route3DViewer
        geojson={geojson}
        name={prettifySlug(slug)}
        distanceKm={routeStats.length_km}
        elevGainM={routeStats.elev_gain_m}
        mode="embedded"
        slug={slug}
      />
    </div>
  );
}
