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
export default function AnswerBlock({
  children,
  className = "",
}: {
  children?: string | null;
  className?: string;
}) {
  const text = typeof children === "string" ? children.trim() : "";
  if (!text) return null;

  return (
    <div
      className={`mt-6 rounded-xl border border-jvto-lime/25 bg-white/10 px-5 py-4 text-sm leading-relaxed text-white/80 max-w-[58ch] ${className}`}
    >
      {text}
    </div>
  );
}
