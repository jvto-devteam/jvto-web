// components/content/BlocksRenderer.tsx
import Link from "next/link";
import Image from "next/image";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";

type Block =
  | { type: "markdown"; body_md: string }
  | { type: "image"; src: string; alt: string; caption?: string | null }
  | { type: "grid"; columns?: 2 | 3; items: CardItem[] };

type CardItem = {
  type: "card";
  title: string;
  summary?: string;
  href?: string;
  icon?: string;
};

function ImageFigure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string | null;
}) {
  return (
    <figure className="rounded-lg border border-neutral-200 overflow-hidden bg-white">
      {/* HEIGHT CONTROL: use aspect ratio (consistent) */}
      <div className="relative w-full aspect-[16/10]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {caption ? (
        <figcaption className="p-3 text-sm text-neutral-700">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function BlocksRenderer({ blocks }: { blocks?: Block[] }) {
  if (!blocks?.length) return null;

  // helper: render grid of images
  const renderImageGrid = (
    imgs: Array<Extract<Block, { type: "image" }>>,
    key: string,
  ) => (
    <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {imgs.map((img, i) => (
        <ImageFigure
          key={`${key}-${i}`}
          src={img.src}
          alt={img.alt}
          caption={img.caption}
        />
      ))}
    </div>
  );

  const out: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const b = blocks[i];

    // AUTO-GROUP consecutive images → 2-col desktop, 1-col mobile
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
      out.push(
        <MarkdownRenderer
          key={`md-${out.length}`}
          markdown={b.body_md ?? ""}
        />,
      );
      i += 1;
      continue;
    }

    if (b.type === "grid") {
      const cols = b.columns ?? 2;
      out.push(
        <div
          key={`grid-${out.length}`}
          className={`grid gap-4 ${cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
        >
          {b.items.map((it, j) => (
            <div
              key={j}
              className="rounded-lg border border-neutral-200 p-4 bg-white"
            >
              <div className="font-semibold">{it.title}</div>
              {it.summary && (
                <div className="mt-2 text-sm text-neutral-700">
                  {it.summary}
                </div>
              )}
              {it.href && (
                <div className="mt-3">
                  <Link
                    href={it.href}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Open →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>,
      );
      i += 1;
      continue;
    }

    i += 1;
  }

  return <div className="mt-4 space-y-6">{out}</div>;
}
