// components/content/BlocksRenderer.tsx
import Link from "next/link";
import Image from "next/image";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { ArrowRight, ExternalLink } from "lucide-react";
import { CrewGrid, type CrewMember } from "@/components/content/CrewGrid";

type Block =
  | { type: "markdown"; body_md: string }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string | null;
      orientation?: "portrait" | "landscape" | null;
    }
  | { type: "grid"; columns?: 2 | 3; items: CardItem[] }
  | { type: "crew_grid"; items: CrewMember[] };

type CardItem = {
  type: "card";
  title: string;
  summary?: string;
  href?: string;
  icon?: string;
};

// ─────────────────────────────────────────────
// Parser helpers
// ─────────────────────────────────────────────

function parseBullets(md: string): Array<{ label: string; text: string }> {
  return md
    .split("\n")
    .filter((l) => l.trim().startsWith("- "))
    .map((l) => {
      const body = l.replace(/^- /, "").trim();
      const colonIdx = body.indexOf(":");
      if (colonIdx === -1) return { label: "", text: body };
      return {
        label: body.slice(0, colonIdx).trim(),
        text: body.slice(colonIdx + 1).trim(),
      };
    });
}

function parseLinkBullets(md: string): Array<{ label: string; href: string }> {
  return parseBullets(md)
    .map(({ label, text }) => {
      const urlMatch = text.match(/https?:\/\/\S+/);
      return { label, href: urlMatch ? urlMatch[0] : text };
    })
    .filter((item) => item.href.startsWith("http"));
}

// ─────────────────────────────────────────────
// Timeline
// ─────────────────────────────────────────────

function TimelineBlock({ md }: { md: string }) {
  const items = parseBullets(md);
  return (
    <>
      <style>{`
        .jvto-timeline {
          position: relative;
          padding-left: 2rem;
        }
        .jvto-timeline::before {
          content: '';
          position: absolute;
          left: 0.5rem;
          top: 0.75rem;
          bottom: 0.75rem;
          width: 2px;
          background: linear-gradient(180deg, #9fce33 0%, #dde8c0 100%);
          border-radius: 1px;
        }
        .jvto-tl-item {
          position: relative;
          margin-bottom: 1.375rem;
        }
        .jvto-tl-item:last-child { margin-bottom: 0; }
        .jvto-tl-dot {
          position: absolute;
          left: -1.65rem;
          top: 0.3rem;
          width: 0.875rem;
          height: 0.875rem;
          border-radius: 50%;
          background: #9fce33;
          border: 2.5px solid #ffffff;
          box-shadow: 0 0 0 2px #9fce33;
        }
        .jvto-tl-item:first-child .jvto-tl-dot {
          background: #0c0e09;
          box-shadow: 0 0 0 2px #0c0e09;
        }
        .jvto-tl-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          font-weight: 600;
          color: #7aaa1a;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        .jvto-tl-item:first-child .jvto-tl-label { color: #0c0e09; }
        .jvto-tl-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: #2a3a18;
          line-height: 1.65;
          background: #f7faf0;
          border: 1px solid #dde8c0;
          border-radius: 0.625rem;
          padding: 0.75rem 1rem;
        }
        .jvto-tl-item:first-child .jvto-tl-text {
          background: #eef5d8;
          border-color: rgba(159,206,51,0.4);
          font-weight: 500;
        }
      `}</style>
      <div className="jvto-timeline">
        {items.map((item, idx) => (
          <div key={idx} className="jvto-tl-item">
            <div className="jvto-tl-dot" />
            {item.label && <div className="jvto-tl-label">{item.label}</div>}
            <div className="jvto-tl-text">{item.text}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Review link cards
// ─────────────────────────────────────────────

const PLATFORM_COLORS: Record<string, string> = {
  tripadvisor: "#00aa6c",
  trustpilot: "#00b67a",
  isic: "#0050b3",
  indecon: "#2d6a4f",
  google: "#ea4335",
};

function getPlatformColor(label: string): string {
  const key = label.toLowerCase().replace(/[^a-z]/g, "");
  for (const [k, v] of Object.entries(PLATFORM_COLORS)) {
    if (key.includes(k)) return v;
  }
  return "#9fce33";
}

function ReviewLinksBlock({ md }: { md: string }) {
  const links = parseLinkBullets(md);
  return (
    <>
      <style>{`
        .jvto-review-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.75rem;
        }
        .jvto-review-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 1rem 1.125rem 0.875rem;
          border-radius: 0.875rem;
          border: 1px solid #dde3d0;
          border-top-width: 3px;
          background: #ffffff;
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s, transform 0.18s;
        }
        .jvto-review-card:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.09);
          transform: translateY(-2px);
        }
        .jvto-review-badge {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 800;
          color: #ffffff;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .jvto-review-name {
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          color: #0c0e09;
          line-height: 1.3;
          flex: 1;
        }
        .jvto-review-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          font-weight: 500;
          color: #9aaa80;
          margin-top: 0.125rem;
        }
      `}</style>
      <div className="jvto-review-grid">
        {links.map((link, idx) => {
          const color = getPlatformColor(link.label);
          const initial = link.label.slice(0, 2).toUpperCase();
          return (
            <a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="jvto-review-card"
              style={{ borderTopColor: color }}
            >
              <div className="jvto-review-badge" style={{ background: color }}>
                {initial}
              </div>
              <div className="jvto-review-name">{link.label}</div>
              <div className="jvto-review-cta">
                Open review <ExternalLink size={10} />
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Image figure + Card link (existing)
// ─────────────────────────────────────────────

// Helper: deteksi apakah src dari domain sendiri
function isOwnDomain(src: string): boolean {
  return (
    src.startsWith("/") ||
    src.includes("javavolcano-touroperator.com")
  );
}

function ImageFigure({
  src,
  alt,
  caption,
  orientation,
}: {
  src: string;
  alt: string;
  caption?: string | null;
  orientation?: "portrait" | "landscape" | null;
}) {
  const aspectRatio = orientation === "portrait" ? "3/4" : "16/10";
  const maxWidth = orientation === "portrait" ? "420px" : undefined;

  return (
    <figure
      style={{
        borderRadius: "0.875rem",
        border: "1px solid #dde3d0",
        overflow: "hidden",
        background: "#f5f7f0",
        margin: orientation === "portrait" ? "0 auto" : 0,
        maxWidth,
        width: "100%",
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio }}>
        {isOwnDomain(src) ? (
          // Bypass Next.js image optimizer untuk gambar dari domain sendiri
          // /_next/image gagal karena server fetch ke dirinya sendiri (loopback)
          <img
            src={src}
            alt={alt}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>
      {caption && (
        <figcaption
          style={{
            padding: "0.625rem 0.875rem",
            fontSize: "0.75rem",
            color: "#6b7a55",
            fontFamily: "'DM Sans', sans-serif",
            borderTop: "1px solid #dde3d0",
            background: "#f7faf0",
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function CardLink({ item }: { item: CardItem }) {
  const isExternal = item.href ? /^https?:\/\//.test(item.href) : false;
  const inner = (
    <>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.875rem",
          fontWeight: 700,
          color: "#0c0e09",
          marginBottom: item.summary ? "0.5rem" : 0,
          lineHeight: 1.3,
        }}
      >
        {item.title}
      </div>
      {item.summary && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "#6b7a55",
            lineHeight: 1.6,
            marginBottom: item.href ? "0.875rem" : 0,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {item.summary}
        </div>
      )}
      {item.href && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#7aaa1a",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Open <ArrowRight size={12} />
        </span>
      )}
    </>
  );
  const base: React.CSSProperties = {
    display: "block",
    borderRadius: "0.875rem",
    border: "1px solid #dde3d0",
    padding: "1.25rem 1.375rem",
    background: "#ffffff",
    textDecoration: "none",
    color: "inherit",
    transition: "box-shadow 0.2s, border-color 0.2s, transform 0.18s",
  };
  if (item.href) {
    return (
      <Link
        href={item.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        style={base}
        className="jvto-card-link"
      >
        {inner}
      </Link>
    );
  }
  return (
    <div
      style={{ ...base, background: "#f7faf0", border: "1px solid #dde8c0" }}
    >
      {inner}
    </div>
  );
}

// ─────────────────────────────────────────────
// Section ID lookup
// ─────────────────────────────────────────────

const TIMELINE_IDS = new Set(["timeline-highlights-artifact-backed"]);
const REVIEW_LINKS_IDS = new Set(["where-to-check-reviews-official-links"]);

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────

export function BlocksRenderer({
  blocks,
  sectionId,
}: {
  blocks?: Block[];
  sectionId?: string;
}) {
  if (!blocks?.length) return null;

  const renderImageGrid = (
    imgs: Array<Extract<Block, { type: "image" }>>,
    key: string,
  ) => (
    <div
      key={key}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "0.875rem",
      }}
    >
      {imgs.map((img, i) => (
        <ImageFigure
          key={`${key}-${i}`}
          src={img.src}
          alt={img.alt}
          caption={img.caption}
          orientation={img.orientation}
        />
      ))}
    </div>
  );

  const renderMarkdown = (
    b: Extract<Block, { type: "markdown" }>,
    key: string,
  ) => {
    if (sectionId && TIMELINE_IDS.has(sectionId))
      return <TimelineBlock key={key} md={b.body_md ?? ""} />;
    if (sectionId && REVIEW_LINKS_IDS.has(sectionId))
      return <ReviewLinksBlock key={key} md={b.body_md ?? ""} />;
    return <MarkdownRenderer key={key} markdown={b.body_md ?? ""} />;
  };

  const out: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const b = blocks[i];

    if (b.type === "image") {
      const imgs: Array<Extract<Block, { type: "image" }>> = [];
      while (i < blocks.length && blocks[i].type === "image") {
        imgs.push(blocks[i] as any);
        i += 1;
      }
      out.push(renderImageGrid(imgs, `imggrid-${out.length}`));
      continue;
    }

    if (b.type === "markdown") {
      out.push(renderMarkdown(b, `md-${out.length}`));
      i += 1;
      continue;
    }

    if (b.type === "grid") {
      const cols = b.columns ?? 2;
      out.push(
        <div
          key={`grid-${out.length}`}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(${cols === 3 ? "200px" : "240px"}, 1fr))`,
            gap: "0.875rem",
          }}
        >
          {b.items.map((it, j) => (
            <CardLink key={j} item={it} />
          ))}
        </div>,
      );
      i += 1;
      continue;
    }

    if (b.type === "crew_grid") {
      out.push(<CrewGrid key={`crew-${out.length}`} items={b.items} />);
      i += 1;
      continue;
    }

    i += 1;
  }

  return (
    <>
      <style>{`.jvto-card-link:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); border-color: rgba(159,206,51,0.4) !important; transform: translateY(-2px); }`}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {out}
      </div>
    </>
  );
}
