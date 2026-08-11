import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/**
 * Safe markdown renderer for SSOT pages.
 * - Disallows raw HTML by default (react-markdown does not render raw HTML unless rehypeRaw is used).
 * - Sanitizes output anyway (defense in depth).
 * - Adds stable IDs to headings for deep links and AEO.
 */
export function MarkdownRendererTravelGuide({ markdown }: { markdown: string }) {
  return (
    <article
      className="prose prose-neutral max-w-none"
      style={
        {
          // JVTO DS v2 — override skema warna prose-neutral via var resmi
          // @tailwindcss/typography (styling only, struktur tak berubah)
          "--tw-prose-body": "var(--color-jvto-navy)",
          "--tw-prose-headings": "var(--color-jvto-navy)",
          "--tw-prose-lead": "var(--color-jvto-muted)",
          "--tw-prose-links": "var(--color-jvto-orange)",
          "--tw-prose-bold": "var(--color-jvto-navy)",
          "--tw-prose-counters": "var(--color-jvto-lime)",
          "--tw-prose-bullets": "var(--color-jvto-lime)",
          "--tw-prose-hr": "var(--color-jvto-border)",
          "--tw-prose-quotes": "var(--color-jvto-navy)",
          "--tw-prose-quote-borders": "var(--color-jvto-lime)",
          "--tw-prose-captions": "var(--color-jvto-muted)",
          "--tw-prose-code": "var(--color-jvto-navy)",
          "--tw-prose-th-borders": "var(--color-jvto-border)",
          "--tw-prose-td-borders": "var(--color-jvto-border)",
        } as React.CSSProperties
      }
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          rehypeSanitize,
        ]}
        components={{
          // Ensure links are safe and SEO-friendly
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

          // Improve code blocks rendering
          code: ({ node, className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="rounded bg-jvto-lime/10 px-1 py-0.5" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <pre className="overflow-x-auto rounded bg-jvto-navy p-4 text-jvto-lime">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },

          // Tables (AEO-friendly)
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} />
            </div>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}