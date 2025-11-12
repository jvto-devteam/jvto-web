"use client";

import { useState } from "react";
import { useGlobalSingletonsStore } from "@/lib/globalSingletonsStore";
import type {
  PrimaryNavItem,
  SitemapRule,
  LinkedType,
  SitemapTargetType,
  Changefreq,
} from "@/lib/globalSingletonsTypes";

const LINKED_TYPES: LinkedType[] = ["static", "collection", "external"];
const TARGET_TYPES: SitemapTargetType[] = [
  "tourPackage",
  "destination",
  "travelGuide",
  "insightPost",
  "faqItem",
  "policyDocument",
  "staticPage",
];
const CHANGEFREQ: Changefreq[] = ["daily", "weekly", "monthly", "yearly"];

export default function Page() {
  const s = useGlobalSingletonsStore();

  // Primary Nav form
  const [navForm, setNavForm] = useState<PrimaryNavItem>({
    label: "",
    url: "",
    linkedType: "static",
    linkedCollection: "",
    linkedEntry: "",
  });

  const addNav = () => {
    if (!navForm.label || !navForm.url) return;
    s.addNavItem(navForm);
    setNavForm({
      label: "",
      url: "",
      linkedType: "static",
      linkedCollection: "",
      linkedEntry: "",
    });
  };

  // Sitemap rule form
  const [ruleForm, setRuleForm] = useState<SitemapRule>({
    targetType: "tourPackage",
    includeInSitemap: true,
    changefreq: "weekly",
    priority: 0.5,
  });

  const addRule = () => {
    s.addSitemapRule(ruleForm);
    setRuleForm({
      targetType: "tourPackage",
      includeInSitemap: true,
      changefreq: "weekly",
      priority: 0.5,
    });
  };

  return (
    <div className="space-y-6">
      {/* Primary Nav */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
        <h2 className="text-sm font-semibold mb-3">Primary Navigation</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input
            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
            placeholder="Label"
            value={navForm.label}
            onChange={(e) => setNavForm({ ...navForm, label: e.target.value })}
          />
          <input
            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
            placeholder="URL"
            value={navForm.url}
            onChange={(e) => setNavForm({ ...navForm, url: e.target.value })}
          />
          <select
            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
            value={navForm.linkedType}
            onChange={(e) =>
              setNavForm({
                ...navForm,
                linkedType: e.target.value as LinkedType,
              })
            }
          >
            {LINKED_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
            placeholder="linkedCollection?"
            value={navForm.linkedCollection || ""}
            onChange={(e) =>
              setNavForm({ ...navForm, linkedCollection: e.target.value })
            }
          />
          <input
            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
            placeholder="linkedEntry? (ID/slug)"
            value={navForm.linkedEntry || ""}
            onChange={(e) =>
              setNavForm({ ...navForm, linkedEntry: e.target.value })
            }
          />
        </div>
        <button
          onClick={addNav}
          className="mt-3 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold"
        >
          Add
        </button>

        <ul className="mt-3 space-y-2">
          {s.navigationSettings.primaryNav.map((n, i) => (
            <li
              key={i}
              className="text-sm bg-slate-950 border border-slate-800 rounded px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="font-medium">{n.label}</span>{" "}
                  <span className="text-slate-400">({n.linkedType})</span>{" "}
                  <span className="text-slate-400">→ {n.url}</span>
                  {n.linkedCollection ? (
                    <span className="ml-2 text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">
                      col: {n.linkedCollection}
                    </span>
                  ) : null}
                  {n.linkedEntry ? (
                    <span className="ml-2 text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">
                      entry: {n.linkedEntry}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => s.removeNavItem(i)}
                    className="text-slate-400 hover:text-red-400 text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Breadcrumb Config */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
        <h2 className="text-sm font-semibold mb-3">
          Breadcrumb Config (Base Paths)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-xs text-slate-400">
            toursBasePath
            <input
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={s.navigationSettings.breadcrumbConfig.toursBasePath}
              onChange={(e) =>
                s.setBreadcrumbConfig({ toursBasePath: e.target.value })
              }
            />
          </label>
          <label className="text-xs text-slate-400">
            destinationsBasePath
            <input
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={s.navigationSettings.breadcrumbConfig.destinationsBasePath}
              onChange={(e) =>
                s.setBreadcrumbConfig({ destinationsBasePath: e.target.value })
              }
            />
          </label>
          <label className="text-xs text-slate-400">
            guidesBasePath
            <input
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={s.navigationSettings.breadcrumbConfig.guidesBasePath}
              onChange={(e) =>
                s.setBreadcrumbConfig({ guidesBasePath: e.target.value })
              }
            />
          </label>
          <label className="text-xs text-slate-400">
            insightsBasePath
            <input
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
              value={s.navigationSettings.breadcrumbConfig.insightsBasePath}
              onChange={(e) =>
                s.setBreadcrumbConfig({ insightsBasePath: e.target.value })
              }
            />
          </label>
        </div>
      </div>

      {/* Sitemap Rules */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
        <h2 className="text-sm font-semibold mb-3">Sitemap Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <select
            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
            value={ruleForm.targetType}
            onChange={(e) =>
              setRuleForm({
                ...ruleForm,
                targetType: e.target.value as SitemapTargetType,
              })
            }
          >
            {TARGET_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
            value={ruleForm.changefreq}
            onChange={(e) =>
              setRuleForm({ ...ruleForm, changefreq: e.target.value as any })
            }
          >
            {CHANGEFREQ.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            max={1}
            step={0.1}
            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
            value={ruleForm.priority}
            onChange={(e) =>
              setRuleForm({
                ...ruleForm,
                priority: parseFloat(e.target.value || "0"),
              })
            }
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ruleForm.includeInSitemap}
              onChange={(e) =>
                setRuleForm({ ...ruleForm, includeInSitemap: e.target.checked })
              }
            />
            <span>includeInSitemap</span>
          </label>
          <button
            onClick={addRule}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold"
          >
            Add Rule
          </button>
        </div>

        <ul className="mt-3 space-y-2">
          {s.navigationSettings.sitemapRules.map((r, i) => (
            <li
              key={i}
              className="text-sm bg-slate-950 border border-slate-800 rounded px-3 py-2 flex items-center justify-between"
            >
              <div className="flex-1">
                <span className="font-medium">{r.targetType}</span>
                <span className="mx-2 text-slate-500">•</span>
                <span className="text-slate-400">
                  {r.changefreq}, priority {r.priority.toFixed(1)}
                </span>
                {!r.includeInSitemap && (
                  <span className="ml-2 text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">
                    excluded
                  </span>
                )}
              </div>
              <button
                onClick={() => s.removeSitemapRule(i)}
                className="text-slate-400 hover:text-red-400 text-xs"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Optional: simple previews */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:p-5">
        <h3 className="text-xs font-semibold">Preview Examples (readonly)</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] text-slate-400 mb-1">
              Breadcrumb samples
            </div>
            <ul className="text-xs space-y-2">
              <li>
                /{" "}
                {s.navigationSettings.breadcrumbConfig.toursBasePath.replace(
                  /^\//,
                  ""
                )}{" "}
                /{"{slug}"}
              </li>
              <li>
                /{" "}
                {s.navigationSettings.breadcrumbConfig.destinationsBasePath.replace(
                  /^\//,
                  ""
                )}{" "}
                /{"{slug}"}
              </li>
              <li>
                /{" "}
                {s.navigationSettings.breadcrumbConfig.guidesBasePath.replace(
                  /^\//,
                  ""
                )}{" "}
                /{"{slug}"}
              </li>
              <li>
                /{" "}
                {s.navigationSettings.breadcrumbConfig.insightsBasePath.replace(
                  /^\//,
                  ""
                )}{" "}
                /{"{slug}"}
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 mb-1">
              Robots/Sitemap notes
            </div>
            <p className="text-xs text-slate-300">
              Hanya entries <em>published</em> +{" "}
              <em>includeInSitemap = true</em> dengan slug & path jelas yang
              akan diexport ke sitemap. (sesuai aturan dokumen)
              {/* :contentReference[oaicite:10]{(index = 10)} */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
