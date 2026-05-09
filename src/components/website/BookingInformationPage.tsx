
import React from 'react';
import SEO from './SEO';
import Breadcrumbs from './Breadcrumbs';
import StructuredData from './StructuredData';
import Link from "@/components/website/AppLink";

const BookingInformationPage: React.FC = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Travel Guide', path: '/travel-guide' },
    { name: 'Booking Information', path: '/travel-guide/booking-information' },
  ];
  
  const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://javavolcano-touroperator.com/#website",
          "url": "https://javavolcano-touroperator.com/",
          "name": "Java Volcano Tour Operator",
          "inLanguage": "en"
        },
        {
          "@type": "WebPage",
          "@id": "https://javavolcano-touroperator.com/travel-guide/booking-information#webpage",
          "url": "https://javavolcano-touroperator.com/travel-guide/booking-information",
          "name": "Booking Information",
          "inLanguage": "en",
          "isPartOf": {"@id": "https://javavolcano-touroperator.com/#website"},
        }
      ]
    };

  return (
    <>
      <SEO
        title="Booking Information | Payments, Changes & Inclusions | JVTO"
        description="How JVTO tours work: booking steps, payments, cancellations, logistics, inclusions, safety, and support. Ijen health certificate is included."
      />
      <StructuredData data={jsonLd} />

      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
            <div className="container mx-auto px-4">
                <Breadcrumbs crumbs={breadcrumbCrumbs} />
                <div className="mt-4">
                    <h1 className="text-4xl md:text-5xl font-black text-ink-primary dark:text-white">Booking, Payment & Cancellation</h1>
                    <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200 max-w-3xl">
                        This page summarises how JVTO bookings work. It applies to every private tour booked directly with us. JVTO does not issue cash refunds. Instead, we issue JVTO Travel Credit equal to 100% of what you already paid if you cancel ≥48 hours before Day 1.
                    </p>
                </div>
            </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-ink-primary dark:prose-headings:text-white prose-headings:border-b-2 prose-headings:border-primary prose-headings:pb-2 prose-p:text-ink-neutral-700 dark:prose-p:text-ink-neutral-200 prose-li:text-ink-neutral-700 dark:prose-li:text-ink-neutral-200 prose-ul:list-disc prose-ul:ml-5 prose-ol:list-decimal prose-ol:ml-5">
                
                <section id="final-rules">
                    <h2>The Final Locked Rules (Binding)</h2>
                     <p>These are the non-negotiable site-wide rules that apply to every guest:</p>
                    <ol>
                        <li><strong>Pay on time.</strong> Card balance: due 5 calendar days before Day 1. Bank/Wise balance: due 3 calendar days before Day 1. Missed payment can void the booking.</li>
                        <li><strong>Cancel more than 48 hours before Day 1 → You get JVTO Travel Credit.</strong> 100% of what {`you've`} paid becomes Travel Credit. No expiry. Transferable. No cash refunds, ever.</li>
                        <li><strong>Cancel less than 48 hours before Day 1 → Forfeited.</strong> No Travel Credit, no refund.</li>
                        <li><strong>Reschedule more than 48 hours before Day 1 → Allowed 1x, free.</strong> Subject to availability.</li>
                        <li><strong>Reschedule less than 48 hours before Day 1 / same-day cancel / no-show → Forfeited.</strong></li>
                        <li><strong>Ijen medical certificate → Mandatory by local law.</strong> JVTO arranges it and {`it's`} included in the package. No partial cash refund if you are found not fit to climb.</li>
                        <li><strong>Official channel rule.</strong> Only our official WhatsApp and email are recognized for coordination.</li>
                    </ol>
                </section>

                <section id="policy-hub" className="mt-12">
                    <h2>Full Policy Documents</h2>
                    <p>These rules are a summary of our official policies. For full details, please review:</p>
                    <ul>
                        <li><Link href="/travel-guide/terms">Terms & Conditions</Link></li>
                        <li><Link href="/travel-guide/privacy">Privacy Policy</Link></li>
                    </ul>
                </section>

            </div>
        </main>
      </div>
    </>
  );
};

export default BookingInformationPage;
