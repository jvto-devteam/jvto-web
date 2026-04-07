// utils/cms.ts - CMS helper functions

export async function fetchWithError<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const statusBadgeColor = (status: boolean | string) => {
  if (typeof status === "boolean") {
    return status
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-slate-700/50 text-slate-400";
  }
  const statusMap: Record<string, string> = {
    published: "bg-emerald-500/20 text-emerald-400",
    draft: "bg-yellow-500/20 text-yellow-400",
    active: "bg-emerald-500/20 text-emerald-400",
    inactive: "bg-slate-700/50 text-slate-400",
  };
  return statusMap[status.toLowerCase()] || "bg-slate-700/50 text-slate-400";
};

export const statusLabel = (status: boolean | string) => {
  if (typeof status === "boolean") {
    return status ? "Active" : "Inactive";
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
};
