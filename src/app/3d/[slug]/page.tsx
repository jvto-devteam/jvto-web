import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { FeatureCollection } from "geojson";

import Route3DViewer from "@/components/Route3DViewer";

type RouteMeta = {
  slug: string;
  geojson_file: string;
  name: string | null;
  length_km: number;
  elev_gain_m: number;
};

type RouteIndex = {
  generated_at: string;
  routes: RouteMeta[];
};

function routesDir() {
  return path.join(process.cwd(), "public", "routes");
}

function loadIndex(): RouteIndex {
  const raw = fs.readFileSync(path.join(routesDir(), "index.json"), "utf8");
  return JSON.parse(raw) as RouteIndex;
}

function prettifySlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  try {
    const index = loadIndex();
    return index.routes.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = loadIndex().routes.find((r) => r.slug === slug);
  if (!meta) return { title: "Route not found" };
  const name = meta.name || prettifySlug(meta.slug);
  return {
    title: `${name} — 3D Route`,
    description: `Interactive 3D terrain view of the ${name} route (${meta.length_km} km, +${meta.elev_gain_m} m).`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let meta: RouteMeta | undefined;
  let geojson: FeatureCollection | undefined;
  try {
    const index = loadIndex();
    meta = index.routes.find((r) => r.slug === slug);
    if (!meta) return notFound();
    const geojsonRaw = fs.readFileSync(
      path.join(routesDir(), meta.geojson_file),
      "utf8"
    );
    geojson = JSON.parse(geojsonRaw) as FeatureCollection;
  } catch {
    return notFound();
  }

  if (!meta || !geojson) return notFound();

  const name = meta.name || prettifySlug(meta.slug);

  return (
    <Route3DViewer
      geojson={geojson}
      name={name}
      distanceKm={meta.length_km}
      elevGainM={meta.elev_gain_m}
    />
  );
}
