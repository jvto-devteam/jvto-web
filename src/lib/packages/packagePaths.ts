import { url } from "@/lib/site";

type PackageSlugInput = string | string[] | null | undefined;

export function normalizePackageSlug(input: PackageSlugInput): string {
  if (Array.isArray(input)) {
    input = input.join("/");
  }

  if (!input) return "";

  return input
    .replace(/\\/g, "/")
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/{2,}/g, "/");
}

export function getPackagePath(input: PackageSlugInput): string {
  const normalized = normalizePackageSlug(input);
  return normalized ? `/${normalized}` : "/";
}

export function getPackageUrl(input: PackageSlugInput): string {
  return url(getPackagePath(input));
}

export function buildPackageLookupSlug(
  slugParam: string,
  prefix: string,
): string {
  const normalizedSlug = normalizePackageSlug(slugParam);
  const normalizedPrefix = normalizePackageSlug(prefix);

  if (!normalizedSlug) return normalizedPrefix;
  if (normalizedSlug.startsWith("tours/")) return normalizedSlug;

  return `${normalizedPrefix}/${normalizedSlug}`;
}
