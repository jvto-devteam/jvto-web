import React from 'react';
import { contactInfo } from '@/constants';
import Link from "next/link";

const PlannerCtaSection = () => (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-orange-500">
        <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold">Ready to Plan Your Private Tour?</h2>
            <p className="mt-3 max-w-xl mx-auto">
                Tell us your origin, dates, and group type (friends, family, students). We’ll reply with a precise, all-inclusive private plan.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={contactInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className="px-8 py-4 w-full sm:w-auto rounded-sm bg-white text-primary text-center font-semibold hover:bg-opacity-90 transition-all duration-200">
                    Chat on WhatsApp
                </a>
                <Link href="/plan-my-trip" className="px-8 py-4 w-full sm:w-auto rounded-sm bg-white/10 backdrop-blur-sm text-white text-center font-semibold border border-white/20 hover:bg-white/20 transition-colors duration-200">
                    Request a Proposal
                </Link>
            </div>
        </div>
    </section>
);
export default PlannerCtaSection;