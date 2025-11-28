import React from 'react';
import Link from "next/link";

const proofs = [
  { label: "Licence No.", value: "1102230032918" },
  { label: "Office", value: "Bondowoso, ID" },
  { label: "Network", value: "Indecon Member" },
  { label: "Reviews", value: "5-Star Average" },
];

const ProofBelt: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark -mt-12 md:-mt-16 relative z-10">
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white dark:bg-background-dark rounded-2xl shadow-card hover:shadow-cardHover transition-shadow p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-center sm:text-left flex-grow">
                        {proofs.map((proof) => (
                            <div key={proof.label}>
                                <p className="text-xs font-semibold uppercase text-ink-neutral-500">{proof.label}</p>
                                <p className="text-sm font-bold text-ink-primary dark:text-white">{proof.value}</p>
                            </div>
                        ))}
                    </div>
                        <Link
                        href="/verify-jvto"
                        className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0 px-6 py-3 rounded-xl bg-ink-accentA text-white text-center font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2"
                    >
                            <span className="material-symbols-outlined text-xl">verified_user</span>
                            Verify JVTO
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProofBelt;