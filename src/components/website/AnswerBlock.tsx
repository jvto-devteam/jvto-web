// AnswerBlock — the first thing on a page that answers the page's question.
//
// Why this exists. Generative engines weight the opening of a document far
// more heavily than the rest of it, so a page that spends its first 120 words
// on atmosphere forfeits the part that gets quoted. The pattern was already
// live on /travel-guide, /policy and the three hub pages, hand-rolled in each
// file; the pages carrying JVTO's strongest material — the proof library, the
// destination facts, the crew — had no slot for it at all.
//
// One component so the treatment stays identical everywhere: same border, same
// measure, same position directly under the lede. Rendered on dark hero
// sections, which is where every page that needs it opens.
// Most heroes here are the dark navy band, but /contact opens on white — same
// component, same measure, colours that survive the ground they sit on.
const TONE = {
  dark: "border-jvto-lime/25 bg-white/10 text-white/80",
  light: "border-jvto-navy/15 bg-jvto-navy/[0.04] text-jvto-navy/80",
} as const;

export default function AnswerBlock({
  children,
  className = "",
  tone = "dark",
}: {
  children?: string | null;
  className?: string;
  tone?: keyof typeof TONE;
}) {
  const text = typeof children === "string" ? children.trim() : "";
  if (!text) return null;

  return (
    <div
      className={`mt-6 rounded-xl border px-5 py-4 text-sm leading-relaxed max-w-[58ch] ${TONE[tone]} ${className}`}
    >
      {text}
    </div>
  );
}
