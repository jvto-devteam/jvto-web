"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import type { FeatureCollection, LineString } from "geojson";

import ElevationChart from "./ElevationChart";

type Props = {
  geojson: FeatureCollection;
  name: string;
  distanceKm: number;
  elevGainM: number;
  flyDurationMs?: number;
};

type Coord3 = [number, number, number?];

function shortestAngleDelta(from: number, to: number) {
  let d = ((to - from + 540) % 360) - 180;
  if (d === -180) d = 180;
  return d;
}

export default function Route3DViewer({
  geojson,
  name,
  distanceKm,
  elevGainM,
  flyDurationMs = 60000,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const animRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const playingRef = useRef(false);
  const smoothedBearingRef = useRef<number | null>(null);
  const smoothedPitchRef = useRef<number>(68);
  const lastCameraUpdateRef = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);

  const coords3d = useMemo<Coord3[]>(() => {
    const line = geojson.features[0].geometry as LineString;
    return line.coordinates.map(
      (c) => [c[0], c[1], c[2]] as Coord3
    );
  }, [geojson]);

  // Pre-compute cumulative distance, gain, and per-segment gradient for stats
  // sampling and pitch easing during fly-through.
  const profile = useMemo(() => {
    const cumDistKm: number[] = [0];
    const cumGainM: number[] = [0];
    const gradientPerSeg: number[] = [0];
    let dAcc = 0;
    let gAcc = 0;
    for (let i = 1; i < coords3d.length; i++) {
      const a = coords3d[i - 1];
      const b = coords3d[i];
      const segKm = turf.distance(
        [a[0], a[1]],
        [b[0], b[1]],
        { units: "kilometers" }
      );
      dAcc += segKm;
      const dz = (b[2] ?? 0) - (a[2] ?? 0);
      if (dz > 0) gAcc += dz;
      cumDistKm.push(dAcc);
      cumGainM.push(gAcc);
      // gradient sin(angle), bounded; segKm in km → meters
      const segM = segKm * 1000;
      gradientPerSeg.push(
        segM > 1 ? Math.max(-0.6, Math.min(0.6, dz / segM)) : 0
      );
    }
    return {
      cumDistKm,
      cumGainM,
      gradientPerSeg,
      totalKm: dAcc,
      totalGainM: Math.round(gAcc),
    };
  }, [coords3d]);

  // Look up current cumulative distance + elevation gain at a given progress
  // (0..1) via binary search on `cumDistKm`.
  const sampleAtProgress = useCallback(
    (p: number) => {
      const arr = profile.cumDistKm;
      if (arr.length < 2) {
        return { km: 0, gainM: 0, gradient: 0 };
      }
      const targetKm = p * profile.totalKm;
      let lo = 0;
      let hi = arr.length - 1;
      while (lo < hi - 1) {
        const mid = (lo + hi) >> 1;
        if (arr[mid] <= targetKm) lo = mid;
        else hi = mid;
      }
      const span = arr[hi] - arr[lo];
      const t = span === 0 ? 0 : (targetKm - arr[lo]) / span;
      const gainM =
        profile.cumGainM[lo] +
        (profile.cumGainM[hi] - profile.cumGainM[lo]) * t;
      const gradient = profile.gradientPerSeg[hi] ?? 0;
      return { km: targetKm, gainM, gradient };
    },
    [profile]
  );

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setTokenMissing(true);
      return;
    }
    if (!containerRef.current) return;
    mapboxgl.accessToken = token;

    const coords2d = coords3d.map(
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
      map.addSource("scrub-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

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
      map.addLayer({
        id: "scrub-point-halo",
        type: "circle",
        source: "scrub-point",
        paint: {
          "circle-radius": 12,
          "circle-color": "#ef4444",
          "circle-opacity": 0.25,
        },
      });
      map.addLayer({
        id: "scrub-point",
        type: "circle",
        source: "scrub-point",
        paint: {
          "circle-radius": 6,
          "circle-color": "#ef4444",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
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

    (map as unknown as {
      __route: { fullLine: ReturnType<typeof turf.lineString>; totalKm: number };
    }).__route = { fullLine, totalKm };

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [geojson, coords3d]);

  const stopAnim = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    playingRef.current = false;
    setPlaying(false);
  }, []);

  const togglePlay = () => {
    const map = mapRef.current;
    if (!map || !ready) return;

    if (playingRef.current) {
      stopAnim();
      return;
    }

    const ctx = (map as unknown as {
      __route: { fullLine: ReturnType<typeof turf.lineString>; totalKm: number };
    }).__route;
    if (!ctx) return;
    const { fullLine, totalKm } = ctx;

    // Bearing smoothing parameters
    const lookAheadKm = Math.max(0.15, totalKm * 0.05);
    const bearingLerp = 0.12;
    const pitchLerp = 0.05;
    const cameraThrottleMs = 33; // ~30 fps for camera; geometry still 60+ fps

    const startProgress = progressRef.current >= 1 ? 0 : progressRef.current;
    progressRef.current = startProgress;
    setProgress(startProgress);
    const startedAt = performance.now();
    playingRef.current = true;
    setPlaying(true);

    // Seed smoothed bearing/pitch from current state if first run, otherwise keep
    // the carried-over value so resuming from pause is continuous.
    if (smoothedBearingRef.current === null) {
      const head0 = turf.along(fullLine, Math.max(0.0001, startProgress * totalKm), {
        units: "kilometers",
      });
      const ahead0 = turf.along(
        fullLine,
        Math.min(totalKm, startProgress * totalKm + lookAheadKm),
        { units: "kilometers" }
      );
      smoothedBearingRef.current = turf.bearing(head0, ahead0);
    }
    lastCameraUpdateRef.current = 0;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const remaining = 1 - startProgress;
      const p = Math.min(
        1,
        startProgress + (elapsed / flyDurationMs) * remaining
      );
      progressRef.current = p;
      setProgress(p);

      const sliceKm = Math.max(0.0001, p * totalKm);

      // Geometry update every frame for buttery progress line.
      const done = turf.lineSliceAlong(fullLine, 0, sliceKm, {
        units: "kilometers",
      });
      const doneSource = map.getSource("route-done") as mapboxgl.GeoJSONSource;
      if (doneSource) doneSource.setData(done);

      // Camera update throttled to ~30 fps so each easeTo can interpolate.
      if (now - lastCameraUpdateRef.current >= cameraThrottleMs) {
        lastCameraUpdateRef.current = now;

        const head = turf.along(fullLine, sliceKm, { units: "kilometers" });
        const lookAhead = turf.along(
          fullLine,
          Math.min(totalKm, sliceKm + lookAheadKm),
          { units: "kilometers" }
        );
        const instantBearing = turf.bearing(head, lookAhead);

        // Exponential smoothing with shortest-angle wraparound
        const prevBearing = smoothedBearingRef.current ?? instantBearing;
        const delta = shortestAngleDelta(prevBearing, instantBearing);
        const nextBearing = prevBearing + delta * bearingLerp;
        smoothedBearingRef.current = nextBearing;

        // Pitch tied to terrain gradient (positive → climb → pitch up)
        const { gradient } = sampleAtProgress(p);
        const targetPitch = 68 + gradient * 12; // ~62..76 typical
        const boundedTarget = Math.max(60, Math.min(78, targetPitch));
        smoothedPitchRef.current =
          smoothedPitchRef.current +
          (boundedTarget - smoothedPitchRef.current) * pitchLerp;

        // Third-person framing: place camera center behind the head along
        // the reverse bearing so the head sits ~upper-third of the screen.
        const camCenter = turf.destination(head, 0.25, nextBearing + 180, {
          units: "kilometers",
        });
        const [lng, lat] = camCenter.geometry.coordinates as [number, number];

        map.easeTo({
          center: [lng, lat],
          bearing: nextBearing,
          pitch: smoothedPitchRef.current,
          zoom: 15,
          duration: 200,
          easing: (t) => t,
        });
      }

      if (p < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        animRef.current = null;
        playingRef.current = false;
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
    setProgress(0);
    smoothedBearingRef.current = null;
    smoothedPitchRef.current = 68;
    const doneSource = map.getSource("route-done") as
      | mapboxgl.GeoJSONSource
      | undefined;
    const scrubSource = map.getSource("scrub-point") as
      | mapboxgl.GeoJSONSource
      | undefined;
    const coord0 = coords3d[0];
    if (doneSource) {
      doneSource.setData(
        turf.lineString([
          [coord0[0], coord0[1]],
          [coord0[0], coord0[1]],
        ])
      );
    }
    if (scrubSource) {
      scrubSource.setData({ type: "FeatureCollection", features: [] });
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

  const handleScrub = useCallback(
    (p: number | null) => {
      const map = mapRef.current;
      if (!map || !ready) return;
      const ctx = (map as unknown as {
        __route?: {
          fullLine: ReturnType<typeof turf.lineString>;
          totalKm: number;
        };
      }).__route;
      if (!ctx) return;
      const { fullLine, totalKm } = ctx;

      const scrubSource = map.getSource("scrub-point") as
        | mapboxgl.GeoJSONSource
        | undefined;
      const doneSource = map.getSource("route-done") as
        | mapboxgl.GeoJSONSource
        | undefined;

      if (p === null) {
        if (scrubSource) {
          scrubSource.setData({ type: "FeatureCollection", features: [] });
        }
        return;
      }

      if (playingRef.current) stopAnim();

      const sliceKm = Math.max(0.0001, p * totalKm);
      const head = turf.along(fullLine, sliceKm, { units: "kilometers" });
      if (scrubSource) scrubSource.setData(head);

      progressRef.current = p;
      setProgress(p);
      if (doneSource) {
        const done = turf.lineSliceAlong(fullLine, 0, sliceKm, {
          units: "kilometers",
        });
        doneSource.setData(done);
      }
    },
    [ready, stopAnim]
  );

  if (tokenMissing) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white p-8 text-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Mapbox token missing</h2>
          <p className="text-sm text-gray-300">
            Set{" "}
            <code className="px-1 py-0.5 bg-gray-800 rounded">
              NEXT_PUBLIC_MAPBOX_TOKEN
            </code>{" "}
            in{" "}
            <code className="px-1 py-0.5 bg-gray-800 rounded">.env.local</code>{" "}
            and restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  const sample = sampleAtProgress(progress);
  const showProgressStats = playing || progress > 0;
  const statDistance = showProgressStats ? sample.km : distanceKm;
  const statGain = showProgressStats ? Math.round(sample.gainM) : elevGainM;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Top-right stats card */}
      <div className="pointer-events-none absolute top-3 left-3 md:left-auto md:right-20 md:top-4 z-10">
        <div className="pointer-events-auto bg-white/95 backdrop-blur rounded-xl shadow-lg px-4 py-3 text-sm min-w-[200px]">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-gray-900 truncate max-w-[200px]">
              {name}
            </div>
            {showProgressStats && (
              <span className="text-[9px] uppercase tracking-wider text-blue-600 font-semibold">
                live
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-4 text-gray-700">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500">
                Distance
              </div>
              <div className="font-semibold text-gray-900 tabular-nums">
                {statDistance.toFixed(1)}
                <span className="text-xs text-gray-500"> km</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500">
                Elev. Gain
              </div>
              <div className="font-semibold text-gray-900 tabular-nums">
                {statGain}
                <span className="text-xs text-gray-500"> m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left route card with play button + elevation chart */}
      <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[28rem] z-10">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-4">
          {/* Elevation chart — visible by default on desktop, toggle on mobile */}
          <div
            className={`${chartOpen ? "block" : "hidden"} md:block mb-3`}
            aria-hidden={!chartOpen}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] uppercase tracking-wide text-gray-500">
                Elevation Profile
              </div>
              <div className="text-[10px] text-gray-500">
                {Math.round(progress * 100)}%
              </div>
            </div>
            <ElevationChart
              coords={coords3d}
              progress={progress}
              onScrub={handleScrub}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              disabled={!ready}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white flex items-center justify-center shadow-lg flex-shrink-0 transition-colors"
              aria-label={playing ? "Pause fly-through" : "Play fly-through"}
            >
              {playing ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
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
            </div>
            <button
              onClick={() => setChartOpen((v) => !v)}
              className="md:hidden text-xs px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
              aria-label="Toggle elevation profile"
              aria-expanded={chartOpen}
            >
              {chartOpen ? "Hide profile" : "Show profile"}
            </button>
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
    </div>
  );
}
