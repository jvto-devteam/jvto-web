import React from 'react';
import SEO from './SEO';
import Breadcrumbs from './Breadcrumbs';
import Link from "next/link";

const ISICPage = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'ISIC Student Deals', path: '/isic/student-package' },
  ];

  return (
    <>
      <SEO
        title="ISIC Student Deals | Fair Pricing for Volcano Tours | JVTO"
        description="JVTO is an official partner of the International Student Identity Card (ISIC). We offer fair pricing on select packages for verified international students."
      />
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
          <div className="container mx-auto px-4">
            <Breadcrumbs crumbs={breadcrumbCrumbs} />
            <div className="mt-4 max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img src="https://www.isic.org/wp-content/uploads/2020/08/isic-logo-horizontal-1.png" alt="ISIC Logo" className="h-12 bg-white p-2 rounded-md self-start sm:self-center" />
                <h1 className="text-4xl md:text-5xl font-bold text-ink-primary dark:text-white">ISIC Student Deals</h1>
              </div>
              <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200">
                Official partnership details for verified ISIC cardholders.
              </p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-ink-primary dark:prose-headings:text-white prose-p:text-ink-neutral-700 dark:prose-p:text-ink-neutral-200 prose-li:text-ink-neutral-700 dark:prose-li:text-ink-neutral-200">
            
            <section>
                <h2>Fair Pricing for International Students</h2>
                <p>We understand that international students often face significantly higher entrance fees at national parks and tourist sites in Indonesia. As an official partner of the International Student Identity Card (ISIC), JVTO is committed to providing fairer pricing structures for verified cardholders on selected private tour packages.</p>
                <p>Our goal is to make East {`Java's`} incredible natural wonders accessible to student travelers without compromising on the quality, safety, and all-inclusive standards that define a JVTO experience.</p>
            </section>

            <section className="mt-8">
                <h2>How It Works</h2>
                <ul>
                    <li><strong>Verification:</strong> You must present a valid, current ISIC card with a verifiable number during the booking process. We will check this against the official ISIC database.</li>
                    <li><strong>Eligible Tours:</strong> Special rates apply to select popular tour packages. These can be confirmed by contacting our team with your travel plans and ISIC details.</li>
                    <li><strong>Same High Standards:</strong> Student packages include the exact same safety standards, inclusions (private car, guide, permits, gear, etc.), and private tour model as our regular tours. There are absolutely no downgrades in quality or safety.</li>
                </ul>
            </section>

            <div className="mt-12 not-prose p-6 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-700">
                <h3 className="text-xl font-bold text-ink-primary dark:text-white">Ready to Plan Your Student Trip?</h3>
                <p className="mt-2 text-ink-neutral-700 dark:text-ink-neutral-200">Contact us via WhatsApp or email with your travel dates, group size, and valid ISIC card number to receive a custom quote with our student pricing.</p>
                <div className="mt-4">
                    <Link href="/contact" className="inline-block px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-all">
                        Contact Us for Student Rates
                    </Link>
                </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ISICPage;