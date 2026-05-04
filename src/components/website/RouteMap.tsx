"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { FeatureCollection, GeoJsonObject } from "geojson";
import "leaflet/dist/leaflet.css";

type Bbox = [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]

interface Props {
  slug: string;
  bbox: Bbox;
  elevMinM: number;
  elevMaxM: number;
}

function FitBounds({ bbox }: { bbox: Bbox }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current) return;
    fitted.current = true;
    map.fitBounds(
      [
        [bbox[1], bbox[0]],
        [bbox[3], bbox[2]],
      ],
      { padding: [24, 24], animate: false }
    );
  }, [map, bbox]);
  return null;
}

function ElevationProfile({
  coords,
  elevMinM,
  elevMaxM,
}: {
  coords: [number, number, number][];
  elevMinM: number;
  elevMaxM: number;
}) {
  const W = 600;
  const H = 60;
  const step = Math.max(1, Math.floor(coords.length / 300));
  const sampled = coords.filter((_, i) => i % step === 0);
  const elevs = sampled.map((c) => c[2] ?? elevMinM);
  const minE = Math.min(...elevs);
  const maxE = Math.max(...elevs);
  const range = maxE - minE || 1;

  const toXY = (e: number, i: number) => {
    const x = (i / Math.max(elevs.length - 1, 1)) * W;
    const y = H - ((e - minE) / range) * (H - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const linePoints = elevs.map(toXY).join(" ");
  const fillPoints = [
    `0,${H}`,
    ...elevs.map(toXY),
    `${W},${H}`,
  ].join(" ");

  return (
    <div className="bg-slate-950 border-t border-slate-800 px-4 pt-3 pb-2">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2">
        Elevation Profile&nbsp;
        <span className="text-slate-700 font-normal normal-case tracking-normal">
          {elevMinM}m – {elevMaxM}m
        </span>
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-12"
        preserveAspectRatio="none"
      >
        <polygon
          points={fillPoints}
          fill="#B2F35F"
          opacity="0.12"
        />
        <polyline
          points={linePoints}
          fill="none"
          stroke="#B2F35F"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function RouteMap({ slug, bbox, elevMinM, elevMaxM }: Props) {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/routes/${slug}.geojson`)
      .then((r) => r.json())
      .then((data: FeatureCollection) => {
        setGeojson(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const center: [number, number] = [
    (bbox[1] + bbox[3]) / 2,
    (bbox[0] + bbox[2]) / 2,
  ];

  const coords: [number, number, number][] =
    geojson?.features?.[0]?.geometry?.type === "LineString"
      ? (geojson.features[0].geometry as any).coordinates
      : [];

  return (
    <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
      <div className="relative h-72 md:h-96">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-[400]">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 animate-pulse">
              Loading trail…
            </span>
          </div>
        )}
        <MapContainer
          center={center}
          zoom={13}
          className="h-full w-full"
          scrollWheelZoom={false}
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> © <a href="https://carto.com/" target="_blank">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {geojson && (
            <>
              <FitBounds bbox={bbox} />
              <GeoJSON
                data={geojson as GeoJsonObject}
                style={{
                  color: "#B2F35F",
                  weight: 3,
                  opacity: 0.9,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {coords.length > 0 && (
        <ElevationProfile
          coords={coords}
          elevMinM={elevMinM}
          elevMaxM={elevMaxM}
        />
      )}
    </div>
  );
}
