const WHY_JVTO_IMAGE_VARIANTS: Record<string, string> = {
  "/history/booking-2015-plaque.jpg":
    "/history/booking-2015-plaque-optimized.webp",
  "/history/booking-2015-shipping-label.jpg":
    "/history/booking-2015-shipping-label-optimized.webp",
  "/history/stefan-loose-ijen-bondowoso-page.png":
    "/history/stefan-loose-ijen-bondowoso-page-optimized.webp",
  "/history/stefan_loose_crop_enh.jpg":
    "/history/stefan_loose_crop_enh-optimized.webp",
  "/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg":
    "/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired-optimized.webp",
  "/uploads/1768225567764-405955176-gufron.png":
    "/uploads/1768225567764-405955176-gufron-thumb.webp",
  "/uploads/1768228514527-518051332-rendi.png":
    "/uploads/1768228514527-518051332-rendi-thumb.webp",
  "/uploads/1768270364125-144711646-yandi.png":
    "/uploads/1768270364125-144711646-yandi-thumb.webp",
  "/uploads/1768228191022-893381041-boy.png":
    "/uploads/1768228191022-893381041-boy-thumb.webp",
  "/uploads/1768276791622-262250680-freddy.png":
    "/uploads/1768276791622-262250680-freddy-thumb.webp",
  "/uploads/1768270423657-690185912-anjas.png":
    "/uploads/1768270423657-690185912-anjas-thumb.webp",
  "/uploads/1768228083285-919198019-taufik_1_.png":
    "/uploads/1768228083285-919198019-taufik_1_-thumb.webp",
  "/uploads/1768271545598-834784538-kiki.png":
    "/uploads/1768271545598-834784538-kiki-thumb.webp",
  "/uploads/1768277053384-470130286-holili.jpg":
    "/uploads/1768277053384-470130286-holili-thumb.webp",
  "/uploads/1768226003889-338819579-fauzi.png":
    "/uploads/1768226003889-338819579-fauzi-thumb.webp",
  "/uploads/1768277336049-911840775-joyo.png":
    "/uploads/1768277336049-911840775-joyo-thumb.webp",
};

function normalizePath(src: string): string | null {
  if (!src) return null;
  if (src.startsWith("/")) return src;

  try {
    const url = new URL(src);
    if (url.hostname.endsWith("javavolcano-touroperator.com")) {
      return url.pathname;
    }
  } catch {
    return null;
  }

  return null;
}

export function getWhyJvtoOptimizedImageSrc(src: string): string {
  const normalized = normalizePath(src);
  if (!normalized) return src;
  return WHY_JVTO_IMAGE_VARIANTS[normalized] ?? src;
}
