// components/content/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import { remarkAutoLink } from "@/lib/remark/remarkAutoLink"; // ← tambahan

/**
 * JVTO-branded markdown renderer.
 * Preserves all existing plugin logic; upgrades only visual styles.
 *
 * v2 — tambahan remarkAutoLink:
 *   Plain-text URL (https://...) dan internal path (/policy/*, /travel-guide/*, dll)
 *   di dalam body_md otomatis diubah jadi clickable link tanpa perlu ubah SQL.
 */
export function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <>
      <style>{`
        .jvto-prose {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          line-height: 1.8;
          color: #2a3a18;
        }

        /* Headings */
        .jvto-prose h1,
        .jvto-prose h2,
        .jvto-prose h3,
        .jvto-prose h4 {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: -0.015em;
          color: #0c0e09;
          margin-top: 1.75rem;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
        .jvto-prose h1 { font-size: 1.35rem; }
        .jvto-prose h2 {
          font-size: 1.1rem;
          padding-bottom: 0.375rem;
          border-bottom: 1px solid #dde3d0;
          margin-top: 2rem;
        }
        .jvto-prose h3 { font-size: 0.97rem; }
        .jvto-prose h4 { font-size: 0.9rem; color: #4a5a35; }

        /* Paragraph */
        .jvto-prose p { margin: 0 0 0.875rem; }
        .jvto-prose p:last-child { margin-bottom: 0; }

        /* Links */
        .jvto-prose a {
          color: #7aaa1a;
          text-decoration: none;
          font-weight: 500;
        }
        .jvto-prose a:hover {
          color: #9fce33;
          text-decoration: underline;
        }

        /* Bold / italic */
        .jvto-prose strong { font-weight: 600; color: #1a2a10; }
        .jvto-prose em { font-style: italic; }

        /* Lists */
        .jvto-prose ul {
          list-style: none;
          padding: 0;
          margin: 0 0 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .jvto-prose ul li {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
          line-height: 1.65;
        }
        .jvto-prose ul li::before {
          content: '▸';
          color: #9fce33;
          font-size: 0.7rem;
          flex-shrink: 0;
          margin-top: 0.28rem;
        }

        /*
         * Li yang mengandung link: di desktop inline biasa,
         * di mobile (< 640px) teks dan link ditumpuk atas-bawah
         * agar URL panjang tidak meluber keluar layar.
         */
        .jvto-prose ul li .jvto-li-inner {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0.25rem 0.4rem;
          flex: 1;
          min-width: 0;
        }
        .jvto-prose ul li .jvto-li-inner a {
          word-break: break-all;
          overflow-wrap: anywhere;
        }
        @media (max-width: 640px) {
          .jvto-prose ul li .jvto-li-inner {
            flex-direction: column;
            gap: 0.15rem;
          }
          .jvto-prose ul li .jvto-li-inner a {
            font-size: 0.78rem;
          }
        }
        .jvto-prose ol {
          list-style: decimal;
          padding-left: 1.375rem;
          margin: 0 0 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .jvto-prose ol li { line-height: 1.65; }

        /* Blockquote */
        .jvto-prose blockquote {
          margin: 1.25rem 0;
          padding: 1rem 1.25rem;
          border-left: 3px solid #9fce33;
          background: #f7faf0;
          border-radius: 0 0.625rem 0.625rem 0;
          color: #3a4a28;
          font-style: italic;
        }

        /* HR */
        .jvto-prose hr {
          border: none;
          border-top: 1px solid #dde3d0;
          margin: 1.5rem 0;
        }

        /* Inline code */
        .jvto-prose code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78em;
          background: #eef5d8;
          color: #3a5218;
          padding: 0.15rem 0.4rem;
          border-radius: 0.3rem;
        }

        /* Code block */
        .jvto-prose pre {
          background: #0c0e09;
          border-radius: 0.75rem;
          padding: 1.25rem;
          overflow-x: auto;
          margin-bottom: 1rem;
        }
        .jvto-prose pre code {
          background: transparent;
          color: #9fce33;
          padding: 0;
          font-size: 0.82rem;
        }

        /* Table */
        .jvto-prose table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
          margin-bottom: 1rem;
        }
        .jvto-prose th {
          background: #f5f7f0;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          text-align: left;
          padding: 0.6rem 0.875rem;
          border-bottom: 2px solid #dde3d0;
          color: #2a3a18;
          font-size: 0.78rem;
        }
        .jvto-prose td {
          padding: 0.5rem 0.875rem;
          border-bottom: 1px solid #eef0e8;
          vertical-align: top;
          color: #3a4a28;
        }
        .jvto-prose tr:last-child td { border-bottom: none; }
        .jvto-prose tr:hover td { background: #f9fbf4; }
      `}</style>

      <article className="jvto-prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkAutoLink]} // ← remarkAutoLink ditambahkan di sini
          rehypePlugins={[rehypeSlug, rehypeSanitize]}
          components={{
            a: ({ node, ...props }) => {
              const href = String(props.href ?? "");
              const isExternal = /^https?:\/\//i.test(href);
              return (
                <a
                  {...props}
                  href={href}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  target={isExternal ? "_blank" : undefined}
                />
              );
            },
            code: ({ node, className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return <code {...props}>{children}</code>;
              }
              return (
                <pre>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            },
            table: ({ node, ...props }) => (
              <div style={{ overflowX: "auto" }}>
                <table {...props} />
              </div>
            ),
            li: ({ node, children, ...props }) => (
              <li {...props}>
                <span className="jvto-li-inner">{children}</span>
              </li>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </article>
    </>
  );
}
