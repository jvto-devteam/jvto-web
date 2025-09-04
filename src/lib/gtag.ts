// src/lib/gtag.ts

// Pastikan Anda juga memasang deklarasi global di GoogleAnalytics.tsx
// agar TypeScript mengenali window.gtag

type GTagEvent = {
  action: string;
  params: {
    [key: string]: any;
  };
};

export const sendEvent = ({ action, params }: GTagEvent) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, params);
  }
};
