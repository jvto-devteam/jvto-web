'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// --- AWAL PERBAIKAN ---
// Baris-baris di bawah ini memberitahu TypeScript tentang adanya fungsi gtag di window
declare global {
  interface Window {
    gtag: (
      event: string,
      action: string,
      params: {
        [key: string]: string | number | undefined;
      }
    ) => void;
  }
}
// --- AKHIR PERBAIKAN ---

const pageview = (url: string) => {
  // Sekarang window.gtag sudah dikenali
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string, {
      page_path: url,
    })
  }
}

export const GoogleAnalytics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    pageview(url)
  }, [pathname, searchParams])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
