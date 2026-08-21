import React from "react";
import Link from "@/components/website/AppLink";
import { ChevronRight } from "lucide-react";
import StructuredData from "./StructuredData";

interface Crumb {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
  /**
   * Emit the BreadcrumbList JSON-LD alongside the visible nav. Default true.
   *
   * Set false on a page that also renders <PageJsonLdCombined />, which builds
   * a BreadcrumbList of its own — two on one page is a duplicate-singleton-type
   * violation. /blog hit exactly that the moment its legacy redirect was lifted
   * and the page became reachable (2026-08-21); the clash had been latent for
   * as long as the page could not be visited.
   */
  emitSchema?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs, emitSchema = true }) => {
  const baseUrl = "https://jvto.example.com";

  // Schema.org breadcrumb data
  const schemaCrumbs = crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: `${baseUrl}/#${crumb.path}`,
  }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaCrumbs,
  };

  return (
    <>
      {emitSchema ? <StructuredData data={breadcrumbSchema} /> : null}

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1 text-sm text-ink-neutral-500 dark:text-ink-neutral-400">
          {crumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index < crumbs.length - 1 ? (
                <Link
                  href={crumb.path}
                  prefetch={false}
                  className="hover:text-primary transition-colors"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span
                  className="font-semibold text-ink-primary dark:text-white"
                  aria-current="page"
                >
                  {crumb.name}
                </span>
              )}

              {index < crumbs.length - 1 && (
                <ChevronRight
                  className="h-4 w-4 mx-1 text-ink-neutral-400"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
