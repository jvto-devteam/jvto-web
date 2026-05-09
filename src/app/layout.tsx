// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // Import Script dari Next.js

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Pastikan menggunakan komponen Script dari next/script */}
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
      </head>
      {/* Tambahkan suppressHydrationWarning di body jika masih error */}
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        {gtmId && (
          <noscript
            suppressHydrationWarning // Kunci utama menghindari error hydration
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
        {children}
      </body>
    </html>
  );
}
