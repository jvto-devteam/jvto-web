import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-4">{children}</div>;
}

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{children}</h1>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-base leading-7 text-neutral-700">{children}</p>;
}

export function Section({
  title,
  children,
  id,
}: {
  title?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mt-10">
      {title ? <h2 className="text-xl font-semibold tracking-tight">{title}</h2> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function Card({
  title,
  children,
  href,
}: {
  title?: string;
  children: ReactNode;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      {title ? <div className="text-base font-semibold">{title}</div> : null}
      <div className={title ? "mt-2 text-sm leading-6 text-neutral-700" : "text-sm leading-6 text-neutral-700"}>
        {children}
      </div>
    </div>
  );

  if (!href) return inner;

  return (
    <Link href={href} className="block transition hover:-translate-y-0.5 hover:shadow-md">
      {inner}
    </Link>
  );
}

export function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function Grid3({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-3">{children}</div>;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const cls =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      : "inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50";

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function LinkInline({ href, children }: { href: string; children: ReactNode }) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-500"
    >
      {children}
    </a>
  );
}

/** display a raw path like your screenshot, but clickable */
export function PathLink({ href }: { href: string }) {
  const isExternal = href.startsWith("http");
  const cls =
    "inline-flex rounded-lg bg-neutral-100 px-2 py-1 font-mono text-xs text-neutral-900 ring-1 ring-inset ring-neutral-200 hover:bg-neutral-200";
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {href}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {href}
    </Link>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
      {items.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

/** Turn lines that contain URLs into real anchors (keperluan proof bullets) */
export function BulletLinks({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
      {items.map((line, idx) => {
        const urlMatch = line.match(/https?:\/\/\S+/);
        if (!urlMatch) {
          return <li key={idx}>{line}</li>;
        }
        const url = urlMatch[0];
        const before = line.slice(0, urlMatch.index);
        const after = line.slice((urlMatch.index ?? 0) + url.length);

        return (
          <li key={idx}>
            {before}
            <LinkInline href={url}>{url}</LinkInline>
            {after}
          </li>
        );
      })}
    </ul>
  );
}

export function Divider() {
  return <hr className="my-8 border-neutral-200" />;
}

export function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
      <div className="text-sm font-semibold text-neutral-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-neutral-700">{children}</div>
    </div>
  );
}

export function Faq({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <details key={i} className="rounded-2xl border border-neutral-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold">{it.q}</summary>
          <div className="mt-2 text-sm leading-6 text-neutral-700">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
