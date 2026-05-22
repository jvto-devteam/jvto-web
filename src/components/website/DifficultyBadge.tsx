// src/components/website/DifficultyBadge.tsx
interface DifficultyBadgeProps {
  physicality: string;
}

const DIFFICULTY_MAP: Record<string, { label: string; classes: string }> = {
  "easy":                    { label: "Easy",        classes: "bg-green-100 text-green-800 border-green-300" },
  "easy to moderate":        { label: "Easy",        classes: "bg-green-100 text-green-800 border-green-300" },
  "moderate":                { label: "Moderate",    classes: "bg-amber-100 text-amber-800 border-amber-300" },
  "moderate to challenging": { label: "Challenging", classes: "bg-orange-100 text-orange-800 border-orange-300" },
  "challenging":             { label: "Challenging", classes: "bg-orange-100 text-orange-800 border-orange-300" },
  "strenuous":               { label: "Strenuous",   classes: "bg-red-100 text-red-800 border-red-300" },
  "hard":                    { label: "Strenuous",   classes: "bg-red-100 text-red-800 border-red-300" },
};

export default function DifficultyBadge({ physicality }: DifficultyBadgeProps) {
  const key = physicality.toLowerCase();
  const { label, classes } = DIFFICULTY_MAP[key] ?? {
    label: physicality,
    classes: "bg-slate-100 text-slate-700 border-slate-300",
  };

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded border ${classes}`}>
      {label}
    </span>
  );
}
