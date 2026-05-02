import React from "react";
import {
  Award,
  Star,
  ShieldCheck,
  Mountain,
  Globe,
  Leaf,
} from "lucide-react";
import { Badge } from "@/types";

/**
 * Map nama icon (string) ke Lucide Icon
 * Samakan value `badge.icon` dengan key di bawah
 */
const iconMap: Record<string, React.ElementType> = {
  award: Award,
  star: Star,
  shield: ShieldCheck,
  mountain: Mountain,
  globe: Globe,
  leaf: Leaf,
};

const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => {
  const Icon = iconMap[badge.icon] ?? Award; // fallback icon

  return (
    <div className="bg-white dark:bg-background-dark p-6 rounded-sm shadow-card hover:shadow-cardHover h-full flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform duration-300">
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center ${badge.iconBgColor}`}
      >
        <Icon
          className={`h-10 w-10 ${badge.iconTextColor}`}
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>

      <h3 className="font-bold text-lg mt-4 text-ink-primary dark:text-white">
        {badge.name}
      </h3>

      <div className="w-full bg-ink-neutral-200 dark:bg-ink-neutral-700 rounded-full h-2.5 mt-4">
        <div
          className={`${badge.progressBgColor} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${badge.progress}%` }}
        />
      </div>

      <p className="text-sm mt-2 text-ink-neutral-500 dark:text-ink-neutral-200">
        {badge.progress}% Complete
      </p>
    </div>
  );
};

export default BadgeCard;
