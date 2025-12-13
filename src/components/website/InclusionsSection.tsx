import React from "react";
import { inclusions } from "@/constants";
import { CheckCircle2, Check, PlusCircle, Plus } from "lucide-react";

const InclusionsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-28 bg-white dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-background-light dark:bg-ink-primary border border-ink-neutral-200 dark:border-ink-neutral-700">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Included */}
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                Included (All-inclusive)
              </h3>

              <ul className="mt-4 space-y-2 list-none text-ink-neutral-700 dark:text-ink-neutral-200">
                {inclusions.included.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check
                      className="h-4 w-4 text-green-500 mt-1 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optional */}
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <PlusCircle className="h-6 w-6" aria-hidden="true" />
                Optional Extras
              </h3>

              <ul className="mt-4 space-y-2 list-none text-ink-neutral-700 dark:text-ink-neutral-200">
                {inclusions.optional.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Plus
                      className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default InclusionsSection;
