import "./globals.css";
import Script from "next/script"; // Import Script dari Next.js
import { Inter, Raleway, JetBrains_Mono } from "next/font/google";

/* ── Design System v2 typefaces ──────────────────────────────────────────────
   Three families, three jobs (readme § Type):
     Inter        — body copy and form controls. 300 is the system's quiet voice.
     Raleway      — editorial headings, prices, stat numbers, review quotes.
     JetBrainsMono— all chrome: labels, keys, section numbers, badges, footers.

   None of the three was ever loaded. globals.css declared --font-inter,
   --font-raleway and --font-jetbrains-mono as bare family stacks, which names
   the faces without fetching them, so every visitor rendered in an OS
   fallback. website.css then built --font-display on top of --font-raleway.
   The `variable` names below are the contract those consumers already expect.

   All three load as variable fonts — no `weight` array, deliberately. The
   codebase asks for font-medium (500), font-semibold (600) and font-black
   (900) among others, so pinning a short static list would leave hundreds of
   call sites requesting a weight that was never shipped; CSS would snap each
   to the nearest loaded cut and flatten the hierarchy weight is carrying. One
   variable file per family covers the whole axis and is no larger. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${raleway.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
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
      <body className="antialiased" suppressHydrationWarning>
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
