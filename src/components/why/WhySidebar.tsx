"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WHY_JVTO_ECOSYSTEM_LINKS } from "@/lib/why-ecosystem";

function groupLinks(group: "Core" | "Proof & Transparency" | "Related") {
  return WHY_JVTO_ECOSYSTEM_LINKS.filter((x) => x.group === group);
}

function NavGroup({ title, group }: { title: string; group: "Core" | "Proof & Transparency" | "Related" }) {
  const pathname = usePathname();
  const items = groupLinks(group);

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{title}</div>
      <ul className="space-y-1">
        {items.map((it) => {
          const hrefNoSlash = it.href.endsWith("/") ? it.href.slice(0, -1) : it.href;
          const active = pathname === it.href || pathname === hrefNoSlash;

          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={[
                  "block rounded-xl px-3 py-2 text-sm leading-5 transition",
                  active ? "bg-neutral-900 text-white" : "text-neutral-800 hover:bg-neutral-100",
                ].join(" ")}
              >
                {it.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function WhySidebar() {
  return (
    <aside className="rounded-2xl border border-neutral-200 bg-white p-5 md:mt-30 shadow-sm space-y-6 sticky md:top-35 max-h-[83vh] overflow-auto">
        <div className="text-sm font-semibold text-neutral-900">Why JVTO Ecosystem</div>
        <NavGroup title="Core" group="Core" />
        <NavGroup title="Proof & Transparency" group="Proof & Transparency" />
        <NavGroup title="Related" group="Related" />
    </aside>
  );
}
