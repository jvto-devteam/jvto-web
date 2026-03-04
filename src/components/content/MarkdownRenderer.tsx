"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkLinkify from "remark-linkify";
import Link from "next/link";
import { visit } from "unist-util-visit";

/**
 * Custom Remark Plugin untuk mengubah teks seperti "/policy/xxx" menjadi node link.
 */
function remarkInternalPathLinks() {
  const PATH_RE =
    /(^|[\s(>])((\/[a-z0-9][a-z0-9\-._~!$&'()*+,;=:@%/]*))(?![\w/.-])/gi;

  return (tree: any) => {
    visit(tree, "text", (node: any, index: number, parent: any) => {
      if (!parent || typeof node.value !== "string") return;
      if (
        parent.type === "link" ||
        parent.type === "code" ||
        parent.type === "inlineCode"
      )
        return;

      const value = node.value;
      let match: RegExpExecArray | null;
      let lastIndex = 0;
      const parts: any[] = [];

      PATH_RE.lastIndex = 0;

      while ((match = PATH_RE.exec(value)) !== null) {
        const leading = match[1] ?? "";
        const path = match[2];
        const start = match.index;

        const before = value.slice(lastIndex, start);
        if (before) parts.push({ type: "text", value: before });
        if (leading) parts.push({ type: "text", value: leading });

        parts.push({
          type: "link",
          url: path,
          children: [{ type: "text", value: path }],
        });

        lastIndex = start + leading.length + path.length;
      }

      if (parts.length === 0) return;

      const after = value.slice(lastIndex);
      if (after) parts.push({ type: "text", value: after });

      parent.children.splice(index, 1, ...parts);
    });
  };
}

/**
 * Safe markdown renderer for SSOT pages.
 */
export function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <article className="prose prose-neutral max-w-none">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkLinkify, // Otomatis deteksi email (hello@...) dan http://
          remarkInternalPathLinks, // Otomatis deteksi /travel-guide/...
        ]}
        rehypePlugins={[rehypeSlug, rehypeSanitize, rehypeAutolinkHeadings]}
        components={{
          // 1. Render untuk tag <a> biasa (teks biasa yang menjadi link)
          a: ({ node, href = "", children, ...props }) => {
            const isExternal =
              /^https?:\/\//i.test(href) || href.startsWith("mailto:");

            if (href.startsWith("/")) {
              return (
                <Link
                  href={href}
                  className="text-blue-600 hover:underline no-underline font-medium"
                >
                  {children}
                </Link>
              );
            }

            return (
              <a
                {...props}
                href={href}
                className="text-blue-600 hover:underline no-underline font-medium break-words"
                rel={isExternal ? "noopener noreferrer" : undefined}
                target={isExternal ? "_blank" : undefined}
              >
                {children}
              </a>
            );
          },

          // 2. Render untuk blok <code> dan `inline code`
          code: ({ node, className, children, ...props }) => {
            const isInline = !className;

            // Ambil teks dan bersihkan (jika ada tanda backtick (`) yang ikut ter-render dari database)
            const textValue = String(children).replace(/^`|`$/g, "").trim();

            if (isInline) {
              // A. Internal Link (contoh: /policy/privacy)
              if (textValue.startsWith("/") && !/\s/.test(textValue)) {
                return (
                  <Link
                    href={textValue}
                    className="text-blue-600 hover:underline no-underline font-medium"
                  >
                    <code
                      className="rounded bg-neutral-100 px-1 py-0.5 text-blue-600"
                      {...props}
                    >
                      {textValue}
                    </code>
                  </Link>
                );
              }

              // B. External URL (contoh: https://javavolcano-touroperator.com)
              if (/^https?:\/\//i.test(textValue)) {
                return (
                  <a
                    href={textValue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline no-underline font-medium break-all"
                  >
                    <code
                      className="rounded bg-neutral-100 px-1 py-0.5 text-blue-600"
                      {...props}
                    >
                      {textValue}
                    </code>
                  </a>
                );
              }

              // C. Email (contoh: hello@javavolcano-touroperator.com)
              if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue)) {
                return (
                  <a
                    href={`mailto:${textValue}`}
                    className="text-blue-600 hover:underline no-underline font-medium break-all"
                  >
                    <code
                      className="rounded bg-neutral-100 px-1 py-0.5 text-blue-600"
                      {...props}
                    >
                      {textValue}
                    </code>
                  </a>
                );
              }

              // D. Nomor Telepon / WhatsApp (contoh: +62 822-4478-8833)
              if (/^\+[\d\s\-]+$/.test(textValue)) {
                // Hapus tanda +, spasi, dan strip agar menjadi format angka murni untuk link wa.me
                const cleanNumber = textValue.replace(/[\s\-+]/g, "");
                return (
                  <a
                    href={`https://wa.me/${cleanNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline no-underline font-medium"
                  >
                    <code
                      className="rounded bg-neutral-100 px-1 py-0.5 text-blue-600"
                      {...props}
                    >
                      {textValue}
                    </code>
                  </a>
                );
              }

              // E. Default inline code biasa (jika bukan link apapun, kembalikan ke format standar)
              return (
                <code className="rounded bg-neutral-100 px-1 py-0.5" {...props}>
                  {children}
                </code>
              );
            }

            // Jika ini block code (multiline dengan bahasa pemrograman)
            return (
              <pre className="overflow-x-auto rounded bg-neutral-900 p-4 text-neutral-100">
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
