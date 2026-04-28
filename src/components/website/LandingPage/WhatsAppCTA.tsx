"use client";

import { pushWaEvent } from "./StickyWhatsApp";

export default function WhatsAppCTA({
  href,
  source,
  className,
  children,
}: {
  href: string;
  source: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => pushWaEvent(source)}
      className={className}
    >
      {children}
    </a>
  );
}
