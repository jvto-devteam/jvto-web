import {
  Sparkles,
  BookOpen,
  BadgeCheck,
  Star,
  Users,
  HeartHandshake,
} from "lucide-react";

export const WHY_MENU = [
  { href: "/why-jvto", label: "Why JVTO", icon: Sparkles },
  { href: "/why-jvto/our-story", label: "Our Story", icon: BookOpen },
  {
    href: "/why-jvto/the-jvto-difference",
    label: "The JVTO Difference",
    icon: BadgeCheck,
  },
  { href: "/why-jvto/reviews", label: "Reviews", icon: Star },
  { href: "/why-jvto/our-team", label: "Our Team", icon: Users },
  {
    href: "/why-jvto/community-standards",
    label: "Community Standards",
    icon: HeartHandshake,
  },
] as const;
