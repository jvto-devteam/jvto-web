
import React from 'react';
import Link from "next/link";
import StructuredData from './StructuredData';

interface Crumb {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  const baseUrl = 'https://jvto.example.com';
  
  // Create a version of crumbs for schema that has the full URL
  const schemaCrumbs = crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: `${baseUrl}/#${crumb.path}`,
  }));

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: schemaCrumbs,
  };

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1 text-sm text-ink-neutral-500 dark:text-ink-neutral-400">
          {crumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index < crumbs.length - 1 ? (
                <Link href={crumb.path} className="hover:text-primary transition-colors">{crumb.name}</Link>
              ) : (
                <span className="font-semibold text-ink-primary dark:text-white" aria-current="page">{crumb.name}</span>
              )}
              {index < crumbs.length - 1 && (
                <span className="material-symbols-outlined text-base mx-1" aria-hidden="true">chevron_right</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
