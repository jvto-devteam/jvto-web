"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Coord = [number, number, number?];

type Props = {
  coords: Coord[];
  progress: number;
  onScrub?: (p: number | null) => void;
  className?: string;
  height?: number;
};

function haversineMeters(a: Coord, b: Coord) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(s));
}

export default function ElevationChart({
  coords,
  progress,
  onScrub,
  className = "",
  height = 96,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [scrubP, setScrubP] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWidth(Math.max(0, Math.floor(w)));
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const profile = useMemo(() => {
    if (coords.length < 2) {
      return {
        dists: [0],
        elevs: [coords[0]?.[2] ?? 0],
        totalM: 0,
        minE: 0,
        maxE: 0,
      };
    }
    const dists: number[] = [0];
    const elevs: number[] = [coords[0][2] ?? 0];
    let acc = 0;
    for (let i = 1; i < coords.length; i++) {
      acc += haversineMeters(coords[i - 1], coords[i]);
      dists.push(acc);
      elevs.push(coords[i][2] ?? 0);
    }
    const minE = Math.min(...elevs);
    const maxE = Math.max(...elevs);
    return { dists, elevs, totalM: acc, minE, maxE };
  }, [coords]);

  const { dists, elevs, totalM, minE, maxE } = profile;

  const PAD_L = 28;
  const PAD_R = 8;
  const PAD_T = 8;
  const PAD_B = 16;
  const innerW = Math.max(1, width - PAD_L - PAD_R);
  const innerH = Math.max(1, height - PAD_T - PAD_B);
  const eRange = Math.max(1, maxE - minE);
  const ePad = eRange * 0.08;
  const yMin = minE - ePad;
  const yMax = maxE + ePad;
  const yRange = yMax - yMin;

  const xOf = (d: number) =>
    PAD_L + (totalM === 0 ? 0 : (d / totalM) * innerW);
  const yOf = (e: number) => PAD_T + (1 - (e - yMin) / yRange) * innerH;

  const { linePath, areaPath } = useMemo(() => {
    if (dists.length < 2 || width === 0) {
      return { linePath: "", areaPath: "" };
    }
    let lp = "";
    for (let i = 0; i < dists.length; i++) {
      const x = xOf(dists[i]);
      const y = yOf(elevs[i]);
      lp += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
    }
    const x0 = xOf(0);
    const xN = xOf(totalM);
    const yBase = PAD_T + innerH;
    const ap = `M${x0.toFixed(1)} ${yBase.toFixed(1)} ${lp.slice(1)} L${xN.toFixed(1)} ${yBase.toFixed(1)} Z`;
    return { linePath: lp, areaPath: ap };
  }, [dists, elevs, totalM, width, height, yMin, yRange]);

  const elevAt = (p: number) => {
    if (dists.length < 2) return elevs[0] ?? 0;
    const target = p * totalM;
    let lo = 0;
    let hi = dists.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (dists[mid] <= target) lo = mid;
      else hi = mid;
    }
    const span = dists[hi] - dists[lo];
    const t = span === 0 ? 0 : (target - dists[lo]) / span;
    return elevs[lo] + (elevs[hi] - elevs[lo]) * t;
  };

  const positionFromEvent = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const innerX = Math.max(PAD_L, Math.min(PAD_L + innerW, x));
    return (innerX - PAD_L) / innerW;
  };

  const handleMove = (e: React.PointerEvent) => {
    const p = positionFromEvent(e.clientX);
    setScrubP(p);
    onScrub?.(p);
  };

  const handleLeave = () => {
    setScrubP(null);
    onScrub?.(null);
  };

  const handleDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    handleMove(e);
  };

  const progX = xOf(progress * totalM);
  const scrubX = scrubP === null ? 0 : xOf(scrubP * totalM);
  const scrubE = scrubP === null ? 0 : elevAt(scrubP);
  const scrubY = scrubP === null ? 0 : yOf(scrubE);
  const scrubDistKm = scrubP === null ? 0 : (scrubP * totalM) / 1000;

  const yTickHi = maxE;
  const yTickLo = minE;

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none ${className}`}
      style={{ height }}
    >
      {width > 0 && (
        <svg
          width={width}
          height={height}
          className="block touch-none"
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          onPointerCancel={handleLeave}
        >
          <defs>
            <linearGradient id="elev-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="elev-done" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.15" />
            </linearGradient>
            <clipPath id="elev-done-clip">
              <rect x={PAD_L} y={PAD_T} width={Math.max(0, progX - PAD_L)} height={innerH} />
            </clipPath>
          </defs>

          {/* Y-axis labels */}
          <text x={4} y={PAD_T + 8} fontSize="10" fill="#6b7280">
            {Math.round(yTickHi)}m
          </text>
          <text x={4} y={PAD_T + innerH} fontSize="10" fill="#6b7280">
            {Math.round(yTickLo)}m
          </text>

          {/* X-axis label */}
          <text x={PAD_L} y={height - 2} fontSize="10" fill="#6b7280">
            0
          </text>
          <text
            x={PAD_L + innerW}
            y={height - 2}
            fontSize="10"
            fill="#6b7280"
            textAnchor="end"
          >
            {(totalM / 1000).toFixed(2)} km
          </text>

          {/* Remaining (light area) */}
          <path d={areaPath} fill="url(#elev-fill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#1e40af"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Done (darker area, clipped to progress) */}
          <g clipPath="url(#elev-done-clip)">
            <path d={areaPath} fill="url(#elev-done)" />
            <path
              d={linePath}
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>

          {/* Progress indicator */}
          {progress > 0 && (
            <line
              x1={progX}
              x2={progX}
              y1={PAD_T}
              y2={PAD_T + innerH}
              stroke="#2563eb"
              strokeWidth="1.5"
            />
          )}

          {/* Scrub indicator */}
          {scrubP !== null && (
            <>
              <line
                x1={scrubX}
                x2={scrubX}
                y1={PAD_T}
                y2={PAD_T + innerH}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={scrubX}
                cy={scrubY}
                r={4}
                fill="#ef4444"
                stroke="#fff"
                strokeWidth="1.5"
              />
            </>
          )}
        </svg>
      )}

      {scrubP !== null && width > 0 && (
        <div
          className="pointer-events-none absolute -top-1 -translate-y-full bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow whitespace-nowrap"
          style={{
            left: Math.min(
              Math.max(0, scrubX - 40),
              Math.max(0, width - 80)
            ),
          }}
        >
          {scrubDistKm.toFixed(2)} km · {Math.round(scrubE)} m
        </div>
      )}
    </div>
  );
}
