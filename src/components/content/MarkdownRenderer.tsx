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
              <div className="overflow-x-auto">
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
  );
}
