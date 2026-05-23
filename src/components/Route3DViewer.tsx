"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import type { FeatureCollection, LineString } from "geojson";

type Props = {
  geojson: FeatureCollection;
  name: string;
  distanceKm: number;
  elevGainM: number;
  flyDurationMs?: number;
};

export default function Route3DViewer({
  geojson,
  name,
  distanceKm,
  elevGainM,
  flyDurationMs = 45000,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const animRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setTokenMissing(true);
      return;
    }
    if (!containerRef.current) return;
    mapboxgl.accessToken = token;

    const feature = geojson.features[0];
    const line = feature.geometry as LineString;
    const coords2d = line.coordinates.map(
      (c) => [c[0], c[1]] as [number, number]
    );
    const fullLine = turf.lineString(coords2d);
    const totalKm = turf.length(fullLine, { units: "kilometers" });
    const bbox = turf.bbox(geojson) as [number, number, number, number];

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      bounds: [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      fitBoundsOptions: { padding: 80, pitch: 65, bearing: 0 },
      pitch: 65,
      attributionControl: true,
      antialias: true,
    });
    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(
      new mapboxgl.ScaleControl({ unit: "metric", maxWidth: 120 }),
      "bottom-right"
    );

    map.on("load", () => {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.6 });

      map.setFog({
        color: "rgb(186, 210, 235)",
        "high-color": "rgb(36, 92, 223)",
        "horizon-blend": 0.02,
        "space-color": "rgb(11, 11, 25)",
        "star-intensity": 0.6,
      });

      map.addSource("route", {
        type: "geojson",
        lineMetrics: true,
        data: fullLine,
      });
      map.addSource("route-done", {
        type: "geojson",
        data: turf.lineString([coords2d[0], coords2d[0]]),
      });

      // Remaining trail (green) — drawn first
      map.addLayer({
        id: "route-remaining-glow",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#022c1a",
          "line-width": 9,
          "line-opacity": 0.55,
        },
      });
      map.addLayer({
        id: "route-remaining",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#22c55e",
          "line-width": 5,
          "line-opacity": 0.95,
        },
      });

      // Completed trail (blue) — drawn on top
      map.addLayer({
        id: "route-done-glow",
        type: "line",
        source: "route-done",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#0b1d3a",
          "line-width": 10,
          "line-opacity": 0.7,
        },
      });
      map.addLayer({
        id: "route-done",
        type: "line",
        source: "route-done",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#2563eb",
          "line-width": 6,
        },
      });

      const start = coords2d[0];
      const end = coords2d[coords2d.length - 1];

      new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat(start)
        .setPopup(new mapboxgl.Popup({ offset: 24 }).setText("Start"))
        .addTo(map);

      new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat(end)
        .setPopup(new mapboxgl.Popup({ offset: 24 }).setText("Finish"))
        .addTo(map);

      setReady(true);
    });

    // store derived data on the map instance for the play handler
    (map as unknown as { __route: { fullLine: typeof fullLine; totalKm: number } }).__route =
      { fullLine, totalKm };

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [geojson]);

  const stopAnim = () => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    setPlaying(false);
  };

  const togglePlay = () => {
    const map = mapRef.current;
    if (!map || !ready) return;

    if (playing) {
      stopAnim();
      return;
    }

    const ctx = (map as unknown as {
      __route: { fullLine: ReturnType<typeof turf.lineString>; totalKm: number };
    }).__route;
    if (!ctx) return;
    const { fullLine, totalKm } = ctx;

    const startProgress = progressRef.current >= 1 ? 0 : progressRef.current;
    progressRef.current = startProgress;
    const startedAt = performance.now();
    setPlaying(true);

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const remaining = 1 - startProgress;
      const p = Math.min(
        1,
        startProgress + (elapsed / flyDurationMs) * remaining
      );
      progressRef.current = p;

      const sliceKm = Math.max(0.0001, p * totalKm);
      const done = turf.lineSliceAlong(fullLine, 0, sliceKm, {
        units: "kilometers",
      });
      const doneSource = map.getSource("route-done") as mapboxgl.GeoJSONSource;
      if (doneSource) doneSource.setData(done);

      const head = turf.along(fullLine, sliceKm, { units: "kilometers" });
      const lookAhead = turf.along(
        fullLine,
        Math.min(totalKm, sliceKm + 0.05),
        { units: "kilometers" }
      );
      const bearing = turf.bearing(head, lookAhead);
      const [lng, lat] = head.geometry.coordinates as [number, number];

      map.jumpTo({
        center: [lng, lat],
        bearing,
        pitch: 72,
        zoom: 15.5,
      });

      if (p < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        animRef.current = null;
        setPlaying(false);
      }
    };

    animRef.current = requestAnimationFrame(tick);
  };

  const resetView = () => {
    const map = mapRef.current;
    if (!map) return;
    stopAnim();
    progressRef.current = 0;
    const doneSource = map.getSource("route-done") as
      | mapboxgl.GeoJSONSource
      | undefined;
    const coord0 = (geojson.features[0].geometry as LineString).coordinates[0];
    if (doneSource) {
      doneSource.setData(
        turf.lineString([
          [coord0[0], coord0[1]],
          [coord0[0], coord0[1]],
        ])
      );
    }
    const bbox = turf.bbox(geojson) as [number, number, number, number];
    map.fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      { padding: 80, pitch: 65, bearing: 0, duration: 1200 }
    );
  };

  if (tokenMissing) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white p-8 text-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Mapbox token missing
          </h2>
          <p className="text-sm text-gray-300">
            Set <code className="px-1 py-0.5 bg-gray-800 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code>{" "}
            in <code className="px-1 py-0.5 bg-gray-800 rounded">.env.local</code> and restart the
            dev server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Top-right stats card */}
      <div className="pointer-events-none absolute top-3 left-3 md:left-auto md:right-20 md:top-4 z-10">
        <div className="pointer-events-auto bg-white/95 backdrop-blur rounded-xl shadow-lg px-4 py-3 text-sm min-w-[180px]">
          <div className="font-semibold text-gray-900 truncate max-w-[220px]">
            {name}
          </div>
          <div className="mt-2 flex gap-4 text-gray-700">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500">
                Distance
              </div>
              <div className="font-semibold text-gray-900">
                {distanceKm.toFixed(2)} km
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500">
                Elev. Gain
              </div>
              <div className="font-semibold text-gray-900">{elevGainM} m</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left route card with play button */}
      <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 z-10">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-4 flex items-center gap-3">
          <button
            onClick={togglePlay}
            disabled={!ready}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white flex items-center justify-center shadow-lg flex-shrink-0 transition-colors"
            aria-label={playing ? "Pause fly-through" : "Play fly-through"}
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" />
                <rect x="14" y="5" width="4" height="14" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">{name}</div>
            <div className="text-xs text-gray-600 mt-0.5">
              {playing
                ? "Flying through route…"
                : ready
                ? "Tap play for 3D fly-through"
                : "Loading terrain…"}
            </div>
            <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${progressRef.current * 100}%` }}
              />
            </div>
          </div>
          <button
            onClick={resetView}
            disabled={!ready}
            className="text-xs px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 disabled:opacity-50"
            aria-label="Reset view"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
