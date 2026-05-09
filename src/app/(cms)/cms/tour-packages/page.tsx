"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  Download,
  Plus
} from "lucide-react";
import Link from "@/components/website/AppLink";
import { useRouter } from 'next/navigation'


type DestinationLite = {
  id: number;
  name: string;
};

type DurationLite = {
  id: number;
  name: string | null;
  day: number | null;
  night: number | null;
};

type PackageRow = {
  id: number;
  name: string;
  start_destination_id: number | null;
  start_destination: DestinationLite | null;
  end_destination: DestinationLite | null;
  duration: DurationLite | null;
  start_from_price: number | null;
};

type TabKey = "surabaya" | "bali";

export default function CmsPackagesPage() {
  const router = useRouter()
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("surabaya");

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/packages", {
        method: "GET",
        cache: "no-store",
      });

      const text = await res.text();

      if (!res.ok) {
        let msg = "Failed to fetch packages";
        try {
          const data = JSON.parse(text);
          if (data?.message) msg = data.message;
        } catch {
          console.error("Non-JSON error response (packages):", text);
        }
        throw new Error(msg);
      }

      const data: PackageRow[] = JSON.parse(text);
      setPackages(data);
    } catch (err: any) {
      console.error("loadPackages error:", err);
      setError(err.message || "Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const formatDuration = (d: DurationLite | null) => {
    if (!d) return "-";
    // if (d.name) return d.name;
    const day = d.day ?? 0;
    const night = d.night ?? 0;
    if (!day && !night) return "-";
    if (day && night) return `${day}D ${night}N`;
    if (day) return `${day}D`;
    return `${night}N`;
  };

  const formatPrice = (price: number | null) => {
    if (price == null) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleEdit = (id: number) => {
    router.push(`/cms/tour-packages/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus package ini?")) return;

    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let msg = "Gagal menghapus package";
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Gagal menghapus package");
    }
  };

  const handleDownload = (id: number) => {
    console.log("download package", id);
    // implement PDF/Excel export di sini
  };

  // filter by search
  const searched = packages.filter((pkg) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      pkg.name.toLowerCase().includes(q) ||
      pkg.start_destination?.name.toLowerCase().includes(q) ||
      pkg.end_destination?.name.toLowerCase().includes(q)
    );
  });

  // filter by tab (start_destination_id)
  const tabFiltered = searched.filter((pkg) => {
    if (activeTab === "surabaya") {
      // Surabaya => start_destination_id = 4
      return pkg.start_destination_id === 4;
    }
    // Bali => start_destination_id = 3
    return pkg.start_destination_id === 3;
  });

  // sort by duration asc (day)
  const sorted = [...tabFiltered].sort((a, b) => {
    const da = a.duration?.day ?? 0;
    const db = b.duration?.day ?? 0;
    if (da !== db) return da - db;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Tour Packages
          </h1>
          <p className="text-sm text-slate-400">
            List paket tour dari Surabaya dan Bali (hanya yang published).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadPackages}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-700 text-[10px] text-slate-300 hover:bg-slate-900/80 transition disabled:opacity-60"
            disabled={loading}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Reload
          </button>
          <Link
          href="/cms/tour-packages/create"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-slate-950 text-sm font-medium px-3 py-2 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Tour Package Baru
          </Link>

        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
          {error}
        </div>
      )}

      <section className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5 space-y-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("surabaya")}
            className={[
              "px-3 py-1.5 text-xs rounded-md border transition",
              activeTab === "surabaya"
                ? "border-blue-500 bg-blue-500/10 text-blue-300"
                : "border-transparent text-slate-400 hover:bg-slate-900",
            ].join(" ")}
          >
            From Surabaya
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bali")}
            className={[
              "px-3 py-1.5 text-xs rounded-md border transition",
              activeTab === "bali"
                ? "border-blue-500 bg-blue-500/10 text-blue-300"
                : "border-transparent text-slate-400 hover:bg-slate-900",
            ].join(" ")}
          >
            From Bali
          </button>

          <div className="ml-auto flex items-center gap-2 rounded-md bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau destinasi..."
              className="bg-transparent outline-none flex-1 placeholder:text-slate-600 text-slate-200"
            />
          </div>
        </div>

        <div className="border border-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-slate-500 text-xs gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading packages...
            </div>
          ) : sorted.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              Tidak ada package untuk tab ini.
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">
                    No
                  </th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">
                    From
                  </th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">
                    End
                  </th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">
                    Duration
                  </th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">
                    Start From
                  </th>
                  <th className="px-3 py-2 text-right text-slate-400 font-medium">
                    Opsi
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((pkg, index) => (
                  <tr
                    key={pkg.id}
                    className="border-t border-slate-800/80 hover:bg-slate-900/60"
                  >
                    {/* No */}
                    <td className="px-3 py-2 align-top text-slate-400">
                      {index + 1}
                    </td>

                    {/* Name */}
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium text-slate-100">
                        {pkg.name}
                      </div>
                    </td>

                    {/* From */}
                    <td className="px-3 py-2 align-top text-slate-200">
                      {pkg.start_destination?.name || "-"}
                    </td>

                    {/* End */}
                    <td className="px-3 py-2 align-top text-slate-200">
                      {pkg.end_destination?.name || "-"}
                    </td>

                    {/* Duration */}
                    <td className="px-3 py-2 align-top text-slate-200">
                      {formatDuration(pkg.duration)}
                    </td>

                    {/* Start From */}
                    <td className="px-3 py-2 align-top text-slate-200">
                      {formatPrice(pkg.start_from_price)}
                    </td>

                    {/* Opsi */}
                    <td className="px-3 py-2 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(pkg.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-[11px] text-slate-200 px-2 py-1"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(pkg.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-900 bg-red-950/40 hover:bg-red-900/50 text-[11px] text-red-200 px-2 py-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
