"use client";

import { useEffect, useState, FormEvent, useMemo } from "react";
import {
  Loader2,
  Save,
  ArrowLeft,
  MapPin,
  Clock,
  Tag,
  FileText,
  Plus,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Info,
  ShieldAlert,
  ChevronLeft,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AssetsSelectorField } from "@/components/assets/AssetsSelectorField";
import { SearchableSelect } from "@/components/form/SearchableSelect";

type AddonOption = {
  id: number;
  name: string;
  price: number | null;
  is_transport: boolean | null;
  transport_type: string | null;
  is_per_person: boolean | null;
};

type Destination = {
  id: number;
  name: string;
};

type Duration = {
  id: number;
  name: string | null;
  day: number | null;
  night: number | null;
};

type PriceTierOption = {
  id: number;
  name: string | null;
  min_pax: number | null;
  max_pax: number | null;
};

type PriceTierInput = {
  price_tier_id: number | "";
  price: number | "";
};

type ItemInclude = {
  id: number;
  item: string;
};

type ItemExclude = {
  id: number;
  item: string;
};

type ActivityOption = {
  id: number;
  name: string;
};

type HotelOption = {
  id: number;
  name: string;
};

type ItineraryDayForm = {
  day_no: number;
  activity_start_id: number | "";
  activity_end_id: number | "";
  title: string;
  activity: string;
  hotel_id: number | "";
  meal_breakfast: boolean;
  meal_lunch: boolean;
  meal_dinner: boolean;
};

type FormState = {
  code: string;
  slug: string;
  name: string;
  short_label: string;
  start_destination_id: number | "";
  end_destination_id: number | "";
  duration_id: number | "";
  description: string;
  physicality: string;
  includes: number[];
  excludes: number[];
  addons: number[];
  asset_ids: number[];
  primary_asset_id: number | null;
};

const emptyForm: FormState = {
  code: "",
  slug: "",
  name: "",
  short_label: "",
  start_destination_id: "",
  end_destination_id: "",
  duration_id: "",
  description: "",
  physicality: "",
  includes: [],
  excludes: [],
  addons: [],
  asset_ids: [],
  primary_asset_id: null,
};

const emptyPriceRow: PriceTierInput = {
  price_tier_id: "",
  price: "",
};

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Route & Duration" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Inclusions & Addons" },
  { id: 5, label: "Gallery" },
  { id: 6, label: "Itinerary" },
];

export default function CmsPackageCreatePage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [durations, setDurations] = useState<Duration[]>([]);
  const [priceTierOptions, setPriceTierOptions] = useState<PriceTierOption[]>(
    []
  );
  const [priceRows, setPriceRows] = useState<PriceTierInput[]>([emptyPriceRow]);
  const [includeOptions, setIncludeOptions] = useState<ItemInclude[]>([]);
  const [excludeOptions, setExcludeOptions] = useState<ItemExclude[]>([]);
  const [addonOptions, setAddonOptions] = useState<AddonOption[]>([]);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [itineraryDays, setItineraryDays] = useState<ItineraryDayForm[]>([]);

  const [loadingMaster, setLoadingMaster] = useState(true);
  const [masterError, setMasterError] = useState<string | null>(null);

  const [step, setStep] = useState<number>(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);

  // --- Load master data ---
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setLoadingMaster(true);
        setMasterError(null);
        const [
          destRes,
          durRes,
          tierRes,
          incRes,
          excRes,
          addonRes,
          actRes,
          hotelRes,
        ] = await Promise.all([
          fetch("/api/destinations", { cache: "no-store" }),
          fetch("/api/durations", { cache: "no-store" }),
          fetch("/api/price-tiers", { cache: "no-store" }),
          fetch("/api/item-includes", { cache: "no-store" }),
          fetch("/api/item-excludes", { cache: "no-store" }),
          fetch("/api/addons", { cache: "no-store" }),
          fetch("/api/activities", { cache: "no-store" }),
          fetch("/api/hotels", { cache: "no-store" }),
        ]);

        const destText = await destRes.text();
        const durText = await durRes.text();
        const tierText = await tierRes.text();
        const incText = await incRes.text();
        const excText = await excRes.text();
        const addonText = await addonRes.text();
        const actText = await actRes.text();
        const hotelText = await hotelRes.text();

        if (!destRes.ok) {
          let msg = "Failed to load origin/end cities.";
          try {
            const data = JSON.parse(destText);
            if (data?.message) msg = data.message;
          } catch {
            console.error(
              "Non-JSON error response (destinations):",
              destText.substring(0, 200)
            );
          }
          throw new Error(msg);
        }

        if (!durRes.ok) {
          let msg = "Failed to load durations.";
          try {
            const data = JSON.parse(durText);
            if (data?.message) msg = data.message;
          } catch {
            console.error(
              "Non-JSON error response (durations):",
              durText.substring(0, 200)
            );
          }
          throw new Error(msg);
        }

        if (!tierRes.ok) {
          let msg = "Failed to load price tiers.";
          try {
            const data = JSON.parse(tierText);
            if (data?.message) msg = data.message;
          } catch {
            console.error(
              "Non-JSON error response (price-tiers):",
              tierText.substring(0, 200)
            );
          }
          throw new Error(msg);
        }

        if (!incRes.ok) {
          let msg = "Failed to load package includes.";
          try {
            const data = JSON.parse(incText);
            if (data?.message) msg = data.message;
          } catch {
            console.error(
              "Non-JSON error response (item-includes):",
              incText.substring(0, 200)
            );
          }
          throw new Error(msg);
        }

        if (!excRes.ok) {
          let msg = "Failed to load package excludes.";
          try {
            const data = JSON.parse(excText);
            if (data?.message) msg = data.message;
          } catch {
            console.error(
              "Non-JSON error response (item-excludes):",
              excText.substring(0, 200)
            );
          }
          throw new Error(msg);
        }

        if (!addonRes.ok) {
          let msg = "Failed to load addons.";
          try {
            const data = JSON.parse(addonText);
            if (data?.message) msg = data.message;
          } catch {
            console.error(
              "Non-JSON error response (addons):",
              addonText.substring(0, 200)
            );
          }
          throw new Error(msg);
        }

        if (!actRes.ok) {
          let msg = "Failed to load activities.";
          try {
            const data = JSON.parse(actText);
            if (data?.message) msg = data.message;
          } catch {
            console.error(
              "Non-JSON error response (activities):",
              actText.substring(0, 200)
            );
          }
          throw new Error(msg);
        }

        if (!hotelRes.ok) {
          let msg = "Failed to load hotels.";
          try {
            const data = JSON.parse(hotelText);
            if (data?.message) msg = data.message;
          } catch {
            console.error(
              "Non-JSON error response (hotels):",
              hotelText.substring(0, 200)
            );
          }
          throw new Error(msg);
        }

        const destData: any[] = JSON.parse(destText);
        const durData: any[] = JSON.parse(durText);
        const tierData: any[] = JSON.parse(tierText);
        const incData: any[] = JSON.parse(incText);
        const excData: any[] = JSON.parse(excText);
        const addonData: any[] = JSON.parse(addonText);
        const actData: any[] = JSON.parse(actText);
        const hotelData: any[] = JSON.parse(hotelText);

        const filteredDest = destData
          .map((d) => ({
            id: Number(d.id),
            name: d.name as string,
          }))
          .filter((d) => d.id === 3 || d.id === 4);

        setDestinations(filteredDest);

        setDurations(
          durData
            .map((d) => ({
              id: Number(d.id),
              name: d.name as string | null,
              day: d.day as number | null,
              night: d.night as number | null,
            }))
            .sort((a, b) => {
              const da = a.day ?? 0;
              const db = b.day ?? 0;
              if (da !== db) return da - db;
              return (a.id || 0) - (b.id || 0);
            })
        );

        setPriceTierOptions(
          tierData
            .map((t) => ({
              id: Number(t.id),
              name: t.name ?? null,
              min_pax: t.min_pax ?? null,
              max_pax: t.max_pax ?? null,
            }))
            .sort((a, b) => (a.min_pax ?? 0) - (b.min_pax ?? 0))
        );

        setIncludeOptions(
          incData
            .map((it) => ({
              id: Number(it.id),
              item: String(it.item),
            }))
            .sort((a, b) => a.id - b.id)
        );

        setExcludeOptions(
          excData
            .map((it) => ({
              id: Number(it.id),
              item: String(it.item),
            }))
            .sort((a, b) => a.id - b.id)
        );

        setAddonOptions(
          addonData
            .map((a) => ({
              id: Number(a.id),
              name: String(a.name),
              price:
                typeof a.price === "number"
                  ? a.price
                  : a.price == null
                  ? null
                  : Number(a.price),
              is_transport: !!a.is_transport,
              transport_type: a.transport_type ?? null,
              is_per_person: !!a.is_per_person,
            }))
            .sort((a, b) => a.id - b.id)
        );

        setActivities(
          actData
            .map((a) => ({
              id: Number(a.id),
              name: a.activity_name || a.name,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );

        setHotels(
          hotelData
            .map((h) => ({
              id: Number(h.id),
              name: h.name as string,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (err: any) {
        console.error("loadMasterData error:", err);
        setMasterError(err.message || "Failed to load master data.");
      } finally {
        setLoadingMaster(false);
      }
    };

    loadMasterData();
  }, []);

  // --- Auto-generate itinerary days when duration changes ---
  useEffect(() => {
    if (!form.duration_id) {
      setItineraryDays([]);
      return;
    }

    const durationIdNumber =
      typeof form.duration_id === "number"
        ? form.duration_id
        : Number(form.duration_id);

    const selectedDuration = durations.find((d) => d.id === durationIdNumber);

    const totalDays = selectedDuration?.day ?? 1;

    setItineraryDays((prev) => {
      const next: ItineraryDayForm[] = [];

      for (let i = 1; i <= totalDays; i++) {
        const existing = prev.find((d) => d.day_no === i);
        if (existing) {
          next.push(existing);
        } else {
          next.push({
            day_no: i,
            activity_start_id: "",
            activity_end_id: "",
            title: `Day ${i}`,
            activity: "",
            hotel_id: "",
            meal_breakfast: false,
            meal_lunch: false,
            meal_dinner: false,
          });
        }
      }

      return next;
    });
  }, [form.duration_id, durations]);

  const markEdited = () => {
    if (!hasEdited) setHasEdited(true);
  };

  const addPriceRow = () => {
    markEdited();
    setPriceRows((prev) => [...prev, { ...emptyPriceRow }]);
  };

  const removePriceRow = (index: number) => {
    markEdited();
    setPriceRows((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)
    );
  };

  const updatePriceRow = (index: number, partial: Partial<PriceTierInput>) => {
    markEdited();
    setPriceRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...partial } : row))
    );
  };

  const updateItineraryDay = (
    day_no: number,
    partial: Partial<ItineraryDayForm>
  ) => {
    markEdited();
    setItineraryDays((prev) =>
      prev.map((day) => {
        if (day.day_no !== day_no) return day;

        const merged = { ...day, ...partial };

        const startAct =
          typeof merged.activity_start_id === "number"
            ? activities.find((a) => a.id === merged.activity_start_id)
            : null;
        const endAct =
          typeof merged.activity_end_id === "number"
            ? activities.find((a) => a.id === merged.activity_end_id)
            : null;

        if (startAct || endAct) {
          const startName = startAct?.name ?? "";
          const endName = endAct?.name ?? "";
          merged.title = [startName, endName].filter(Boolean).join(" - ");
        }

        return merged;
      })
    );
  };

  // --- Price tiers cleaned (for summary & submission) ---
  const cleanPriceTiers = useMemo(() => {
    return priceRows
      .map((row) => ({
        price_tier_id:
          typeof row.price_tier_id === "number"
            ? row.price_tier_id
            : row.price_tier_id === ""
            ? null
            : Number(row.price_tier_id),
        price:
          typeof row.price === "number"
            ? row.price
            : row.price === ""
            ? null
            : Number(row.price),
      }))
      .filter(
        (r) =>
          r.price_tier_id &&
          Number.isFinite(r.price_tier_id) &&
          r.price &&
          Number.isFinite(r.price) &&
          r.price > 0
      );
  }, [priceRows]);

  const priceSummary = useMemo(() => {
    if (cleanPriceTiers.length === 0) return null;
    const prices = cleanPriceTiers.map((p) => p.price as number);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  }, [cleanPriceTiers]);

  const filledItineraryDaysCount = useMemo(() => {
    return itineraryDays.filter((day) => {
      const activity_start_id =
        typeof day.activity_start_id === "number"
          ? day.activity_start_id
          : day.activity_start_id === ""
          ? null
          : Number(day.activity_start_id);

      const activity_end_id =
        typeof day.activity_end_id === "number"
          ? day.activity_end_id
          : day.activity_end_id === ""
          ? null
          : Number(day.activity_end_id);

      const hotel_id =
        typeof day.hotel_id === "number"
          ? day.hotel_id
          : day.hotel_id === ""
          ? null
          : Number(day.hotel_id);

      const activity = day.activity.trim() || null;

      const hasContent =
        activity_start_id ||
        activity_end_id ||
        activity ||
        hotel_id ||
        day.meal_breakfast ||
        day.meal_lunch ||
        day.meal_dinner;

      return !!hasContent;
    }).length;
  }, [itineraryDays]);

  const currentDuration = useMemo(() => {
    if (!form.duration_id) return null;
    const id =
      typeof form.duration_id === "number"
        ? form.duration_id
        : Number(form.duration_id);
    return durations.find((d) => d.id === id) ?? null;
  }, [form.duration_id, durations]);

  // --- Step validation ---
  const validateStep = (targetStep: number): boolean => {
    setError(null);

    const name = form.name.trim();

    if (targetStep >= 2) {
      if (!name) {
        setError("Please fill in the package name before continuing.");
        setStep(1);
        return false;
      }
    }

    if (targetStep >= 3) {
      if (!form.start_destination_id || !form.end_destination_id) {
        setError("Please select both departure and end city.");
        setStep(2);
        return false;
      }
      if (!form.duration_id) {
        setError("Please select duration.");
        setStep(2);
        return false;
      }
    }

    if (targetStep >= 4) {
      if (cleanPriceTiers.length === 0) {
        setError(
          "At least one price tier with price > 0 is required before continuing."
        );
        setStep(3);
        return false;
      }
    }

    return true;
  };

  const goToStep = (target: number) => {
    if (target > step) {
      if (!validateStep(target)) return;
    }
    setStep(target);
  };

  const handleBackClick = () => {
    if (hasEdited) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to go back?"
      );
      if (!confirmLeave) return;
    }
    router.back();
  };

  // --- Submit handler ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateStep(STEPS.length)) {
      return;
    }

    const name = form.name.trim();
    if (!name) {
      setError("Package name is required.");
      return;
    }

    setSaving(true);

    const cleanItineraryDays = itineraryDays
      .map((day) => {
        const activity_start_id =
          typeof day.activity_start_id === "number"
            ? day.activity_start_id
            : day.activity_start_id === ""
            ? null
            : Number(day.activity_start_id);

        const activity_end_id =
          typeof day.activity_end_id === "number"
            ? day.activity_end_id
            : day.activity_end_id === ""
            ? null
            : Number(day.activity_end_id);

        const hotel_id =
          typeof day.hotel_id === "number"
            ? day.hotel_id
            : day.hotel_id === ""
            ? null
            : Number(day.hotel_id);

        const title = day.title.trim() || `Day ${day.day_no}`;
        const activity = day.activity.trim() || null;

        const hasContent =
          activity_start_id ||
          activity_end_id ||
          activity ||
          hotel_id ||
          day.meal_breakfast ||
          day.meal_lunch ||
          day.meal_dinner;

        if (!hasContent) return null;

        return {
          day_no: day.day_no,
          activity_start_id,
          activity_end_id,
          title,
          activity,
          hotel_id,
          meal_breakfast: day.meal_breakfast,
          meal_lunch: day.meal_lunch,
          meal_dinner: day.meal_dinner,
        };
      })
      .filter(Boolean) as any[];

    try {
      const payload = {
        code: form.code.trim() || null,
        slug: form.slug.trim() || null,
        name,
        short_label: form.short_label.trim() || null,
        start_destination_id:
          typeof form.start_destination_id === "number"
            ? form.start_destination_id
            : Number(form.start_destination_id),
        end_destination_id:
          typeof form.end_destination_id === "number"
            ? form.end_destination_id
            : Number(form.end_destination_id),
        duration_id:
          typeof form.duration_id === "number"
            ? form.duration_id
            : Number(form.duration_id),
        description: form.description.trim() || null,
        physicality: form.physicality.trim() || null,
        price_tiers: cleanPriceTiers,
        includes: form.includes,
        excludes: form.excludes,
        addons: form.addons,
        asset_ids: form.asset_ids,
        primary_asset_id: form.primary_asset_id,
        itinerary_days: cleanItineraryDays,
      };

      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok) {
        let msg = "Failed to create package.";
        try {
          const data = JSON.parse(text);
          if (data?.message) msg = data.message;
        } catch {
          console.error(
            "Non-JSON error response (create package):",
            text.substring(0, 200)
          );
        }
        throw new Error(msg);
      }

      setSuccess("Package created successfully.");
      setForm(emptyForm);
      setPriceRows([emptyPriceRow]);
      setItineraryDays([]);
      setHasEdited(false);
      setStep(1);
    } catch (err: any) {
      console.error("create package error:", err);
      setError(err.message || "Failed to create package.");
    } finally {
      setSaving(false);
    }
  };

  // --- Render helpers ---

  const renderStepHeader = () => {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
              <Tag className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-50">
                Create Tour Package
              </h1>
              <p className="text-sm text-slate-400">
                Guide your customers through a complete tour experience: route,
                pricing, inclusions, photos, and daily itinerary.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBackClick}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 text-xs font-medium px-3 py-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          {STEPS.map((s, idx) => {
            const isActive = s.id === step;
            const isCompleted = s.id < step;
            const isClickable = s.id <= step + 0; // allow going back freely, forward validated

            return (
              <div key={s.id} className="flex items-center gap-2">
                {idx > 0 && (
                  <div className="h-px w-6 bg-slate-700/70" aria-hidden />
                )}
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => goToStep(s.id)}
                  className={[
                    "inline-flex items-center gap-2 px-2 py-1 rounded-full border text-[11px] transition",
                    isActive
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                      : isCompleted
                      ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-200"
                      : "border-slate-700 bg-slate-950/60 text-slate-400",
                    !isClickable ? "opacity-50 cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  <span className="h-4 w-4 rounded-full flex items-center justify-center text-[10px] border border-current">
                    {isCompleted ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      s.id
                    )}
                  </span>
                  <span>{s.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-start gap-2 text-[12px] text-slate-200">
        <Info className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
        <div>
          <div className="font-semibold mb-0.5">Start with a clear title.</div>
          <p className="text-slate-400">
            Use a name that is easy to understand, for example:{" "}
            <span className="italic">
              “Mount Bromo Sunrise Tour from Surabaya”.
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Package Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              markEdited();
              const value = e.target.value;
              setForm((prev) => ({
                ...prev,
                name: value,
                // auto-generate slug if slug is still empty
                slug:
                  prev.slug.trim().length === 0
                    ? value
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "")
                    : prev.slug,
              }));
            }}
            className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Example: Mount Bromo Sunrise Tour from Malang"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Short Label
          </label>
          <input
            type="text"
            value={form.short_label}
            onChange={(e) => {
              markEdited();
              setForm((prev) => ({
                ...prev,
                short_label: e.target.value,
              }));
            }}
            className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Example: Bromo Sunrise"
          />
          <p className="text-[11px] text-slate-500">
            This short label can be shown as a badge in your UI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => {
              markEdited();
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
            rows={5}
            className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 nice-scrollbar"
            placeholder="Briefly describe the tour highlights, destinations, and experience."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Physical Condition (optional)
          </label>
          <textarea
            value={form.physicality}
            onChange={(e) => {
              markEdited();
              setForm((prev) => ({
                ...prev,
                physicality: e.target.value,
              }));
            }}
            rows={5}
            className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 nice-scrollbar"
            placeholder="Example: Light trekking 2–3 hours, suitable for beginners with normal physical condition."
          />
          <p className="text-[11px] text-slate-500">
            This is stored in the <code>physicality</code> field on{" "}
            <code>packages</code> table.
          </p>
        </div>
      </div>

      {/* Advanced settings */}
      <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/50 space-y-3">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="w-full flex items-center justify-between text-xs text-slate-300"
        >
          <span className="inline-flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            Advanced settings (optional)
          </span>
          <span className="text-slate-500">
            {showAdvanced ? "Hide" : "Show"}
          </span>
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Internal ID (Code)
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => {
                  markEdited();
                  setForm((prev) => ({ ...prev, code: e.target.value }));
                }}
                className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Example: PKG-BROMO-001"
              />
              <p className="text-[11px] text-slate-500">
                Can be left empty if you want the backend to auto-generate it.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  markEdited();
                  setForm((prev) => ({ ...prev, slug: e.target.value }));
                }}
                className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Example: bromo-sunrise-tour-from-malang"
              />
              <p className="text-[11px] text-slate-500">
                Leave empty to auto-generate from the package name.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-start gap-2 text-[12px] text-slate-200">
        <MapPin className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
        <div>
          <div className="font-semibold mb-0.5">Set route and duration.</div>
          <p className="text-slate-400">
            Choose where the tour starts, where it ends, and how many days it
            runs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Departure City <span className="text-red-400">*</span>
          </label>
          <SearchableSelect
            value={
              typeof form.start_destination_id === "number"
                ? destinations.find((d) => d.id === form.start_destination_id) ??
                  null
                : null
            }
            onChange={(opt) => {
              markEdited();
              setForm((prev) => ({
                ...prev,
                start_destination_id: opt ? opt.id : "",
              }));
            }}
            options={destinations}
            getOptionLabel={(d) => d.name}
            getOptionValue={(d) => d.id}
            placeholder="Select departure city"
            disabled={loadingMaster}
          />
          <p className="text-[11px] text-slate-500">
            For now only destinations with ID 3 and 4 are available.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            End City <span className="text-red-400">*</span>
          </label>
          <SearchableSelect
            value={
              typeof form.end_destination_id === "number"
                ? destinations.find((d) => d.id === form.end_destination_id) ??
                  null
                : null
            }
            onChange={(opt) => {
              markEdited();
              setForm((prev) => ({
                ...prev,
                end_destination_id: opt ? opt.id : "",
              }));
            }}
            options={destinations}
            getOptionLabel={(d) => d.name}
            getOptionValue={(d) => d.id}
            placeholder="Select end city"
            disabled={loadingMaster}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Duration <span className="text-red-400">*</span>
          </label>
          <SearchableSelect
            value={
              typeof form.duration_id === "number"
                ? durations.find((d) => d.id === form.duration_id) ?? null
                : null
            }
            onChange={(opt) => {
              markEdited();
              setForm((prev) => ({
                ...prev,
                duration_id: opt ? opt.id : "",
              }));
            }}
            options={durations}
            getOptionLabel={(d) =>
              d.name ? d.name : `${d.day ?? 0}D${d.night ?? 0}N`
            }
            getOptionValue={(d) => d.id}
            placeholder="Select duration"
            disabled={loadingMaster}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-start gap-2 text-[12px] text-slate-200">
        <Info className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
        <div>
          <div className="font-semibold mb-0.5">Set pricing per group size.</div>
          <p className="text-slate-400">
            Each price tier can represent a range of participants (for example:
            2–4 pax, 5–7 pax) with its own price.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-200">Price Tiers</h2>
          <p className="text-[11px] text-slate-500">
            Add one or more tiers. At least one row with a valid price is
            required.
          </p>
        </div>
        <button
          type="button"
          onClick={addPriceRow}
          className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-[11px] text-slate-200 px-2 py-1"
        >
          <Plus className="w-3 h-3" />
          Add tier
        </button>
      </div>

      <div className="space-y-2">
        {priceRows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[2fr,1fr,auto] gap-2 items-center bg-slate-950/60 border border-slate-800 rounded-md px-3 py-2"
          >
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-300">
                Price tier
              </label>
              <SearchableSelect
                value={
                  typeof row.price_tier_id === "number"
                    ? priceTierOptions.find(
                        (t) => t.id === row.price_tier_id
                      ) ?? null
                    : null
                }
                onChange={(opt) =>
                  updatePriceRow(index, {
                    price_tier_id: opt ? opt.id : "",
                  })
                }
                options={priceTierOptions}
                getOptionLabel={(t) =>
                  `${t.name || `Tier #${t.id}`} ${
                    t.min_pax || t.max_pax
                      ? `(${t.min_pax ?? "?"}-${t.max_pax ?? "?"} pax)`
                      : ""
                  }`
                }
                getOptionValue={(t) => t.id}
                placeholder="Select tier..."
                disabled={loadingMaster}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-300">
                Price (IDR)
              </label>
              <input
                type="number"
                min={0}
                value={row.price}
                onChange={(e) =>
                  updatePriceRow(index, {
                    price: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Example: 550000"
              />
              <p className="text-[10px] text-slate-500">
                Enter numeric value without dots or commas.
              </p>
            </div>

            <div className="flex md:justify-end items-end pt-4 md:pt-5">
              <button
                type="button"
                onClick={() => removePriceRow(index)}
                disabled={priceRows.length <= 1}
                className="inline-flex items-center gap-1 rounded-md border border-red-900 bg-red-950/40 hover:bg-red-900/50 text-[11px] text-red-200 px-2 py-1 disabled:opacity-40"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-start gap-2 text-[12px] text-slate-200">
        <ShieldAlert className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
        <div>
          <div className="font-semibold mb-0.5">
            Set what is included and not included.
          </div>
          <p className="text-slate-400">
            Clear information about inclusions and exclusions reduces customer
            confusion and complaints.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Package Includes
          </label>
          <div className="rounded-md border border-slate-800 bg-slate-950/60 max-h-60 overflow-auto nice-scrollbar px-3 py-2 space-y-1">
            {includeOptions.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                No include items are registered yet.
              </p>
            ) : (
              includeOptions.map((opt) => {
                const checked = form.includes.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      markEdited();
                      setForm((prev) => ({
                        ...prev,
                        includes: checked
                          ? prev.includes.filter((id) => id !== opt.id)
                          : [...prev.includes, opt.id],
                      }));
                    }}
                    className={[
                      "w-full text-left text-[12px] px-2 py-1 rounded-md border transition",
                      checked
                        ? "bg-emerald-500/10 border-emerald-500/60 text-emerald-100"
                        : "bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-900",
                    ].join(" ")}
                  >
                    {opt.item}
                  </button>
                );
              })
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            Click on an item to toggle whether it is included in the package.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Package Excludes
          </label>
          <div className="rounded-md border border-slate-800 bg-slate-950/60 max-h-60 overflow-auto nice-scrollbar px-3 py-2 space-y-1">
            {excludeOptions.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                No exclude items are registered yet.
              </p>
            ) : (
              excludeOptions.map((opt) => {
                const checked = form.excludes.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      markEdited();
                      setForm((prev) => ({
                        ...prev,
                        excludes: checked
                          ? prev.excludes.filter((id) => id !== opt.id)
                          : [...prev.excludes, opt.id],
                      }));
                    }}
                    className={[
                      "w-full text-left text-[12px] px-2 py-1 rounded-md border transition",
                      checked
                        ? "bg-rose-500/10 border-rose-500/60 text-rose-100"
                        : "bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-900",
                    ].join(" ")}
                  >
                    {opt.item}
                  </button>
                );
              })
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            Click on an item to toggle whether it is excluded from the package.
          </p>
        </div>
      </div>

      {/* Addons */}
      <div className="border-t border-slate-800 pt-4 mt-2 space-y-3">
        <div>
          <h2 className="text-xs font-semibold text-slate-200">Package Addons</h2>
          <p className="text-[11px] text-slate-500">
            Optional extras customers can add during booking (for example
            upgraded transport, extra night, etc).
          </p>
        </div>

        <div className="rounded-md border border-slate-800 bg-slate-950/60 max-h-72 overflow-auto nice-scrollbar px-3 py-2 space-y-1">
          {addonOptions.length === 0 ? (
            <p className="text-[11px] text-slate-500">
              No addons are registered yet.
            </p>
          ) : (
            addonOptions.map((opt) => {
              const checked = form.addons.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className="flex items-center justify-between gap-2 text-[12px] text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3 w-3 rounded border-slate-700 bg-slate-900"
                      checked={checked}
                      onChange={(e) => {
                        markEdited();
                        setForm((prev) => ({
                          ...prev,
                          addons: e.target.checked
                            ? [...prev.addons, opt.id]
                            : prev.addons.filter((id) => id !== opt.id),
                        }));
                      }}
                    />
                    <span>{opt.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    {opt.price != null && (
                      <span>
                        IDR {opt.price.toLocaleString("id-ID")}
                        {opt.is_per_person ? "/pax" : ""}
                      </span>
                    )}
                    {opt.is_transport && opt.transport_type && (
                      <span className="px-1.5 py-0.5 rounded-full border border-slate-700 text-[10px]">
                        {opt.transport_type}
                      </span>
                    )}
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-start gap-2 text-[12px] text-slate-200">
        <ImageIcon className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
        <div>
          <div className="font-semibold mb-0.5">
            Add gallery photos for this tour.
          </div>
          <p className="text-slate-400">
            Choose several images that best represent the experience. Set one
            photo as the cover so customers see it first.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-3 space-y-3">
        <AssetsSelectorField
          label="Gallery images"
          description="These images will be used as the tour gallery."
          multiple={true}
          allowedTypes={["image"]}
          valueIds={form.asset_ids}
          onChange={(ids) => {
            markEdited();
            setForm((prev) => {
              let nextPrimary = prev.primary_asset_id;
              if (nextPrimary != null && !ids.includes(nextPrimary)) {
                nextPrimary = null;
              }
              return {
                ...prev,
                asset_ids: ids,
                primary_asset_id: nextPrimary,
              };
            });
          }}
          primaryId={form.primary_asset_id}
          onPrimaryChange={(id) => {
            markEdited();
            setForm((prev) => ({
              ...prev,
              primary_asset_id: id,
            }));
          }}
        />

        <p className="text-[11px] text-slate-500">
          Make sure you have at least one good cover image so the tour looks
          attractive to customers.
        </p>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-4">
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-start gap-2 text-[12px] text-slate-200">
        <FileText className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
        <div>
          <div className="font-semibold mb-0.5">
            Build a clear day-by-day itinerary.
          </div>
          <p className="text-slate-400">
            The number of days follows the selected duration. Title is
            automatically generated as:{" "}
            <span className="italic">“Activity Start - Activity End”.</span>
          </p>
        </div>
      </div>

      {itineraryDays.length === 0 ? (
        <p className="text-[11px] text-slate-500">
          Select a duration first to generate itinerary days.
        </p>
      ) : (
        <div className="space-y-2">
          {itineraryDays.map((day) => (
            <div
              key={day.day_no}
              className="border border-slate-800 rounded-md bg-slate-950/60 p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-100">
                  Day {day.day_no}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] text-slate-300">
                    Activity start
                  </label>
                  <SearchableSelect
                    value={
                      typeof day.activity_start_id === "number"
                        ? activities.find(
                            (a) => a.id === day.activity_start_id
                          ) ?? null
                        : null
                    }
                    onChange={(opt) =>
                      updateItineraryDay(day.day_no, {
                        activity_start_id: opt ? opt.id : "",
                      })
                    }
                    options={activities}
                    getOptionLabel={(a) => a.name}
                    getOptionValue={(a) => a.id}
                    placeholder="Select starting activity"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] text-slate-300">
                    Activity end
                  </label>
                  <SearchableSelect
                    value={
                      typeof day.activity_end_id === "number"
                        ? activities.find(
                            (a) => a.id === day.activity_end_id
                          ) ?? null
                        : null
                    }
                    onChange={(opt) =>
                      updateItineraryDay(day.day_no, {
                        activity_end_id: opt ? opt.id : "",
                      })
                    }
                    options={activities}
                    getOptionLabel={(a) => a.name}
                    getOptionValue={(a) => a.id}
                    placeholder="Select ending activity"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] text-slate-300">
                    Title
                  </label>
                  <input
                    type="text"
                    value={day.title}
                    readOnly
                    className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-50"
                  />
                  <p className="text-[10px] text-slate-500">
                    Automatically generated from activity start and end.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] text-slate-300">
                    Activity detail
                  </label>
                  <textarea
                    value={day.activity}
                    onChange={(e) =>
                      updateItineraryDay(day.day_no, {
                        activity: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 nice-scrollbar"
                    placeholder="Describe the plan for this day..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] text-slate-300">
                    Hotel
                  </label>
                  <SearchableSelect
                    value={
                      typeof day.hotel_id === "number"
                        ? hotels.find((h) => h.id === day.hotel_id) ?? null
                        : null
                    }
                    onChange={(opt) =>
                      updateItineraryDay(day.day_no, {
                        hotel_id: opt ? opt.id : "",
                      })
                    }
                    options={hotels}
                    getOptionLabel={(h) => h.name}
                    getOptionValue={(h) => h.id}
                    placeholder="Select hotel (optional)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] text-slate-300">
                    Meals
                  </label>
                  <div className="flex flex-col gap-1 text-[11px] text-slate-200">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-3 w-3 rounded border-slate-700 bg-slate-900"
                        checked={day.meal_breakfast}
                        onChange={(e) =>
                          updateItineraryDay(day.day_no, {
                            meal_breakfast: e.target.checked,
                          })
                        }
                      />
                      <span>Breakfast</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-3 w-3 rounded border-slate-700 bg-slate-900"
                        checked={day.meal_lunch}
                        onChange={(e) =>
                          updateItineraryDay(day.day_no, {
                            meal_lunch: e.target.checked,
                          })
                        }
                      />
                      <span>Lunch</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-3 w-3 rounded border-slate-700 bg-slate-900"
                        checked={day.meal_dinner}
                        onChange={(e) =>
                          updateItineraryDay(day.day_no, {
                            meal_dinner: e.target.checked,
                          })
                        }
                      />
                      <span>Dinner</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return null;
    }
  };

  // Sidebar summary
  const renderSummary = () => {
    const totalDays = currentDuration?.day ?? null;
    const totalNights = currentDuration?.night ?? null;

    return (
      <div></div>
      // <aside className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 md:p-4 text-xs text-slate-200 md:sticky md:top-4 h-fit">
      //   <h2 className="text-xs font-semibold text-slate-100 mb-1.5 flex items-center gap-2">
      //     <Info className="w-3.5 h-3.5 text-emerald-400" />
      //     Package summary
      //   </h2>
      //   <p className="text-[11px] text-slate-500 mb-3">
      //     Quick overview of what you have set so far.
      //   </p>

      //   <div className="space-y-3">
      //     <div className="border border-slate-800 rounded-md p-2 bg-slate-950/80">
      //       <div className="text-[11px] text-slate-400 mb-1">Name</div>
      //       <div className="text-xs font-medium text-slate-100">
      //         {form.name || <span className="text-slate-500">Not set yet</span>}
      //       </div>
      //       {form.short_label && (
      //         <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded-full border border-slate-700 text-[10px] text-slate-200">
      //           {form.short_label}
      //         </div>
      //       )}
      //     </div>

      //     <div className="border border-slate-800 rounded-md p-2 bg-slate-950/80 space-y-1">
      //       <div className="flex items-center justify-between text-[11px] text-slate-400">
      //         <span>Route</span>
      //       </div>
      //       <div className="text-xs text-slate-100">
      //         {form.start_destination_id
      //           ? destinations.find(
      //               (d) => d.id === form.start_destination_id
      //             )?.name || "Departure city"
      //           : "Departure city"}
      //         {" "}
      //         <span className="text-slate-500">→</span>{" "}
      //         {form.end_destination_id
      //           ? destinations.find(
      //               (d) => d.id === form.end_destination_id
      //             )?.name || "End city"
      //           : "End city"}
      //       </div>
      //       <div className="text-[11px] text-slate-400 mt-1">
      //         Duration:{" "}
      //         {currentDuration
      //           ? currentDuration.name ||
      //             `${currentDuration.day ?? "?"}D${currentDuration.night ?? "?"}N`
      //           : "Not selected"}
      //       </div>
      //     </div>

      //     <div className="border border-slate-800 rounded-md p-2 bg-slate-950/80 space-y-1">
      //       <div className="flex items-center justify-between text-[11px] text-slate-400">
      //         <span>Pricing</span>
      //       </div>
      //       {priceSummary ? (
      //         <>
      //           <div className="text-xs text-slate-100">
      //             From{" "}
      //             <span className="font-semibold">
      //               IDR {priceSummary.min.toLocaleString("id-ID")}
      //             </span>
      //             {priceSummary.max !== priceSummary.min && (
      //               <>
      //                 {" "}
      //                 to{" "}
      //                 <span className="font-semibold">
      //                   IDR {priceSummary.max.toLocaleString("id-ID")}
      //                 </span>
      //               </>
      //             )}
      //           </div>
      //           <div className="text-[11px] text-slate-400">
      //             {cleanPriceTiers.length} tier
      //             {cleanPriceTiers.length > 1 ? "s" : ""} configured.
      //           </div>
      //         </>
      //       ) : (
      //         <div className="text-[11px] text-slate-500">
      //           No valid price tier yet.
      //         </div>
      //       )}
      //     </div>

      //     <div className="border border-slate-800 rounded-md p-2 bg-slate-950/80 space-y-1">
      //       <div className="text-[11px] text-slate-400">Gallery</div>
      //       <div className="text-xs text-slate-100 flex items-center gap-1">
      //         <span>{form.asset_ids.length} image(s) selected</span>
      //         {form.primary_asset_id != null && (
      //           <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/50 text-[10px] text-emerald-200">
      //             Cover set
      //           </span>
      //         )}
      //       </div>
      //     </div>

      //     <div className="border border-slate-800 rounded-md p-2 bg-slate-950/80 space-y-1">
      //       <div className="text-[11px] text-slate-400">Itinerary</div>
      //       <div className="text-xs text-slate-100">
      //         {totalDays != null ? (
      //           <>
      //             {filledItineraryDaysCount}/{totalDays} day(s) have content.
      //           </>
      //         ) : (
      //           "Duration not set yet."
      //         )}
      //       </div>
      //       <div className="text-[11px] text-slate-400">
      //         Make sure at least the key days are filled for clarity.
      //       </div>
      //     </div>
      //   </div>
      // </aside>
    );
  };

  const isLastStep = step === STEPS.length;

  return (
    <div className="space-y-4">
      {renderStepHeader()}

      {masterError && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{masterError}</span>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{success}</span>
        </div>
      )}

      <section className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 md:p-5">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(260px,1fr)] gap-4 lg:gap-6 text-sm"
        >
          {/* Left: step content */}
          <div className="space-y-4 nice-scrollbar">
            {renderCurrentStep()}

            {/* Step navigation */}
            <div className="pt-4 flex justify-between gap-3 border-t border-slate-800 mt-2">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => goToStep(step - 1)}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 text-xs font-medium px-3 py-2 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                {!isLastStep && (
                  <button
                    type="button"
                    onClick={() => goToStep(step + 1)}
                    disabled={loadingMaster}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-medium px-3 py-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {isLastStep && (
                  <button
                    type="submit"
                    disabled={saving || loadingMaster}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-medium px-3 py-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    <Save className="w-4 h-4" />
                    Save package
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: summary */}
          <div className="hidden lg:block">{renderSummary()}</div>
          {/* For small screens, show summary below on its own row */}
          <div className="lg:hidden mt-4">{renderSummary()}</div>
        </form>
      </section>
    </div>
  );
}
