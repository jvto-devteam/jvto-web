"use client";

import { pushEmailEvent, pushWaEvent } from "@/lib/analytics-events";

type Channel = "whatsapp" | "email";

export default function TrackedContactLink({
  channel,
  href,
  source,
  className,
  children,
  ariaLabel,
  linkText,
}: {
  channel: Channel;
  href: string;
  source: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  linkText?: string;
}) {
  const isExternal = channel === "whatsapp";

  const handleClick = () => {
    const text =
      linkText ?? (typeof children === "string" ? children : undefined);
    if (channel === "whatsapp") {
      pushWaEvent(source, href, text);
    } else {
      pushEmailEvent(source, href, text);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}