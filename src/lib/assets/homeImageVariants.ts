const HOME_IMAGE_VARIANTS: Record<string, string> = {
  "/uploads/1764649856442-820608003-bromo-new.jpg":
    "/uploads/1764649856442-820608003-bromo-new-home.webp",
  "/uploads/1764649921055-338810628-1687447803_whatsapp_image_2019-05-12_at_4.46.53_pm.jpeg":
    "/uploads/1764649921055-338810628-1687447803_whatsapp_image_2019-05-12_at_4.46.53_pm-home.webp",
  "/uploads/1764650020192-295296217-madakaripura1.jpg":
    "/uploads/1764650020192-295296217-madakaripura1-home.webp",
  "/uploads/1764650032945-926940542-tumpak-sewu1.jpg":
    "/uploads/1764650032945-926940542-tumpak-sewu1-home.webp",
  "/uploads/1764650056490-963808584-papuma1.jpg":
    "/uploads/1764650056490-963808584-papuma1-home.webp",
  "/uploads/3-day-bromo-madakaripura-waterfall-ijen-overland-from-surabaya-to-bali_0.jpg":
    "/uploads/3-day-bromo-madakaripura-waterfall-ijen-overland-from-surabaya-to-bali_0-home.webp",
  "/uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_0.jpg":
    "/uploads/3-day-ijen-bromo-madakaripura-waterfall-discovery-from-surabaya_0-home.webp",
  "/uploads/4-day-ijen-bromo-madakaripura-waterfall-expedition-from-surabaya_0.jpg":
    "/uploads/4-day-ijen-bromo-madakaripura-waterfall-expedition-from-surabaya_0-home.webp",
  "/uploads/4-day-ijen-papuma-beach-tumpak-sewu-bromo-journey-from-surabaya_0.webp":
    "/uploads/4-day-ijen-papuma-beach-tumpak-sewu-bromo-journey-from-surabaya_0-home.webp",
  "/uploads/4-day-tumpak-sewu-bromo-ijen-adventure-from-surabaya-to-bali_0.webp":
    "/uploads/4-day-tumpak-sewu-bromo-ijen-adventure-from-surabaya-to-bali_0-home.webp",
  "/uploads/5-day-ijen-bromo-madakaripura-malang-city-adventure-from-surabaya_0.webp":
    "/uploads/5-day-ijen-bromo-madakaripura-malang-city-adventure-from-surabaya_0-home.webp",
  "/uploads/4-day-ijen-papuma-beach-tumpak-sewu-bromo-expedition-from-bali-to-surabaya_0.jpg":
    "/uploads/4-day-ijen-papuma-beach-tumpak-sewu-bromo-expedition-from-bali-to-surabaya_0-home.webp",
  "/uploads/5-day-ijen-papuma-beach-tumpak-sewu-bromo-discovery-from-bali-to-surabaya_0.jpg":
    "/uploads/5-day-ijen-papuma-beach-tumpak-sewu-bromo-discovery-from-bali-to-surabaya_0-home.webp",
  "/uploads/3-day-ijen-bromo-madakaripura-waterfall-journey-from-bali-to-surabaya_0.webp":
    "/uploads/3-day-ijen-bromo-madakaripura-waterfall-journey-from-bali-to-surabaya_0-home.webp",
  "/uploads/3-day-bromo-ijen-volcano-discovery-from-bali_0.webp":
    "/uploads/3-day-bromo-ijen-volcano-discovery-from-bali_0-home.webp",
};

export function getHomeImageVariant(src?: string | null): string | null {
  if (!src) return null;
  return HOME_IMAGE_VARIANTS[src] ?? null;
}

