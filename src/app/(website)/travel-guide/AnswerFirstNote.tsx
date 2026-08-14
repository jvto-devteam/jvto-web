export function AnswerFirstNote({ text }: { text?: string | null }) {
  if (!text) return null;

  return (
    <div className="mt-6 rounded-lg border border-jvto-lime/25 bg-white/10 px-4 py-3 text-sm leading-relaxed text-white/80">
      {text}
    </div>
  );
}
