const VERIFY_JVTO_IMAGE_VARIANTS: Record<string, string> = {
  "/founder/mr-sam-tourist-police-portrait.png":
    "/founder/mr-sam-tourist-police-portrait-optimized.webp",
  "/ops/baratha-hotel-departure-team.jpg":
    "/ops/baratha-hotel-departure-team-optimized.webp",
  "/ops/group-at-jvto-office.jpg":
    "/ops/group-at-jvto-office-optimized.webp",
  "/ops/guest-welcome-evening.png":
    "/ops/guest-welcome-evening-optimized.webp",
  "/ops/ijen-geopark-briefing.png":
    "/ops/ijen-geopark-briefing-optimized.webp",
  "/ops/jvto-police-escort-arrival-hotel-bondowoso-day.jpg":
    "/ops/jvto-police-escort-arrival-hotel-bondowoso-day-optimized.webp",
  "/ops/jvto-police-escort-arrival-hotel-bondowoso-night.jpg":
    "/ops/jvto-police-escort-arrival-hotel-bondowoso-night-optimized.webp",
  "/ops/police-vehicle-support.jpg":
    "/ops/police-vehicle-support-optimized.webp",
  "/legal/office-photo.jpg": "/legal/office-photo-optimized.webp",
  "/press/screenshot-bbksda-pelatihan-pemandu-kawah-ijen.png":
    "/press/screenshot-bbksda-pelatihan-pemandu-kawah-ijen-optimized.webp",
  "/screening/SCREENSHOT_SIP_DOKTER_AHMAD_IRWANDANU_2026.png":
    "/screening/SCREENSHOT_SIP_DOKTER_AHMAD_IRWANDANU_2026.webp",
  "/screening/jvto-office-screening-1.JPG":
    "/screening/jvto-office-screening-1-optimized.webp",
  "/screening/jvto-office-screening-2.jpg":
    "/screening/jvto-office-screening-2-optimized.webp",
  "/screening/print-surat-sehat-preview-2026.png":
    "/screening/print-surat-sehat-preview-2026.webp",
  "/history/stefan-loose-ijen-bondowoso-page.png":
    "/history/stefan-loose-ijen-bondowoso-page-optimized.webp",
  "/history/stefan_loose_crop_enh.jpg":
    "/history/stefan_loose_crop_enh-optimized.webp",
  "/history/booking-2015-plaque.jpg":
    "/history/booking-2015-plaque-optimized.webp",
  "/history/booking-2015-shipping-label.jpg":
    "/history/booking-2015-shipping-label-optimized.webp",
  "/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg":
    "/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired-optimized.webp",
  "/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png":
    "/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.webp",
  "/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png":
    "/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.webp",
  "/screening/ijen-screening-hotel-01.jpeg":
    "/screening/ijen-screening-hotel-01.webp",
  "/screening/ijen-screening-hotel-02.jpg":
    "/screening/ijen-screening-hotel-02.webp",
};

export function getVerifyJvtoOptimizedImageSrc(src: string): string {
  if (!src) return src;

  try {
    const url = new URL(src, "https://javavolcano-touroperator.com");
    return VERIFY_JVTO_IMAGE_VARIANTS[url.pathname] ?? src;
  } catch {
    return VERIFY_JVTO_IMAGE_VARIANTS[src] ?? src;
  }
}
