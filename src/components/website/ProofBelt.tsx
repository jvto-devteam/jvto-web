import React from "react";
import Link from "@/components/website/AppLink";
import {
  BadgeCheck,
  Shield,
  UsersX,
  MapPin,
  CreditCard,
  UserCheck,
  LucideIcon,
} from "lucide-react";

const trustItems = [
  { icon: "badge", text: "Registered Indonesian travel company" },
  { icon: "security", text: "Tourist Police-led safety culture" },
  { icon: "group_off", text: "Private tours only, no shared groups" },
  { icon: "location_on", text: "Office in Bondowoso, East Java" },
  { icon: "paid", text: "All-inclusive, no hidden fees" },
] as const;

/**
 * Map Material-style icon name → Lucide icon
 */
const iconMap: Record<string, LucideIcon> = {
  badge: BadgeCheck,
  security: Shield,
  group_off: UsersX,
  location_on: MapPin,
  paid: CreditCard,
  verified_user: UserCheck,
};

const ProofBelt: React.FC = () => {
  return (
    <div className="relative md:-mt-24 z-10 py-8">
      <div className="container mx-auto px-5">
        <div className="bg-white dark:bg-gray-900 rounded-sm shadow-md border border-gray-100 dark:border-gray-800 p-6 md:p-8">

          {/* Trust icons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-7">
            {trustItems.map((item, i) => {
              const Icon = iconMap[item.icon] ?? BadgeCheck;

              return (
                <div
                  key={i}
                  className={`flex flex-col items-center text-center justify-center ${
                    i === 4 ? "sm:col-span-1 col-span-2" : ""
                  }`}
                >
                  <Icon
                    className="h-11 w-11 text-emerald-600 dark:text-emerald-400 mb-2"
                    aria-hidden="true"
                  />
                  <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-gray-800 mb-6" />

          {/* Text + CTA */}
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center sm:text-left">
              You can verify who we are, where we operate and which licences we hold.
            </p>

            <Link
              href="/why-jvto/the-jvto-difference#verification"
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-full transition-all duration-200 hover:scale-105 whitespace-nowrap"
            >
              <UserCheck className="h-5 w-5" aria-hidden="true" />
              Verify JVTO
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProofBelt;
