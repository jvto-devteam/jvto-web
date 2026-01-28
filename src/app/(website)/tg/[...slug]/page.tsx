// app/travel-guide/[...slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

type Payload = {
  page_key: string;
  page_fields: Record<string, any>;
  sections: Array<{
    ord: number | null;
    section_key: string;
    fields: Record<string, any>;
  }>;
};

function sortBySuffixNumber(keys: string[], prefix: string) {
  return keys
    .filter((k) => k.startsWith(prefix))
    .sort((a, b) => {
      const na = Number(a.replace(prefix, "")) || 0;
      const nb = Number(b.replace(prefix, "")) || 0;
      return na - nb;
    });
}

function renderSection(fields: Record<string, any>) {
  const title = fields.title;

  const paragraphKeys = sortBySuffixNumber(Object.keys(fields), "paragraph_");
  const bulletKeys = sortBySuffixNumber(Object.keys(fields), "bullet_");

  return (
    <section className="space-y-3">
      {title ? <h2 className="text-xl font-semibold">{title}</h2> : null}

      {paragraphKeys.map((k) => (
        <p key={k} className="leading-7 whitespace-pre-wrap">
          {String(fields[k] ?? "")}
        </p>
      ))}

      {bulletKeys.length ? (
        <ul className="list-disc pl-5 space-y-1">
          {bulletKeys.map((k) => (
            <li key={k} className="leading-7">
              {String(fields[k] ?? "")}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default async function TravelGuidePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  // route = "/travel-guide/booking-information"
  const route = "/travel-guide/" + (slug?.join("/") ?? "");
  const key = `page:${route}`;
  const lang = "en";

  // Panggil endpoint internal. Ini server-side, jadi aman.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/eav/page?key=${encodeURIComponent(
      key,
    )}&lang=${encodeURIComponent(lang)}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return notFound();
  }

  const data = (await res.json()) as Payload;

  const h1 = data.page_fields?.h1;
  const introKeys = sortBySuffixNumber(
    Object.keys(data.page_fields || {}),
    "intro_paragraph_",
  );

  return (
    <main className="mx-auto max-w-3xl px-4 pt-30 py-10 space-y-10 prose">
      <header className="space-y-3">
        {h1 ? <h1 className="text-3xl font-bold">{String(h1)}</h1> : null}
        {introKeys.map((k) => (
          <div key={k} className="leading-7 whitespace-pre-wrap">
            <ReactMarkdown>{String(data.page_fields[k] ?? "")}</ReactMarkdown>
          </div>
        ))}
      </header>

      <div className="space-y-10">
        {data.sections?.map((s) => (
          <div key={s.section_key}>{renderSection(s.fields || {})}</div>
        ))}
      </div>
    </main>
  );
}
