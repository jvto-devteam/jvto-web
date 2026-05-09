import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import Link from "@/components/website/AppLink";

const faqs = [
    { question: "Is screening optional?", answer: "For JVTO Ijen tours, no. Screening is part of our standard. For other travelers, we strongly recommend it." },
    { question: "Do you share results?", answer: "Only as needed with authorized staff for verification at Ijen. See our Privacy Policy for details." },
    { question: "Does clearance guarantee safety?", answer: "No. It reduces risk, but we still monitor conditions and may advise against hiking. Your safety is always the final deciding factor." }
];

const IjenHealthScreeningPage: React.FC = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Travel Guide', path: '/travel-guide' },
    { name: 'Ijen Health Screening', path: '/travel-guide/ijen-health-screening' },
  ];


  return (
    <>
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
            <div className="container mx-auto px-4">
                <Breadcrumbs crumbs={breadcrumbCrumbs} />
                <div className="mt-4 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-ink-primary dark:text-white">Ijen Health Screening — Real Checks, Digital Proof</h1>
                </div>
            </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-ink-primary dark:prose-headings:text-white prose-p:text-ink-neutral-700 dark:prose-p:text-ink-neutral-200 prose-li:text-ink-neutral-700 dark:prose-li:text-ink-neutral-200">
                
                <section>
                    <h2>1. Why Screening Matters</h2>
                    <p>Kawah Ijen combines several challenges: a night hike on a steep trail, exposure to sulfur gas, high altitude, and often cold, crowded conditions. Many past incidents in the region have involved travelers who were physically unprepared or, in some cases, used fraudulent medical letters. Our approach is simple: <strong>make proper screening normal, simple, and verifiable for everyone.</strong></p>
                </section>

                <section className="mt-8">
                    <h2>2. For JVTO Guests</h2>
                    <p>If your JVTO tour includes the Ijen night hike, your health screening is <strong>included in the package</strong>. Here’s what to expect:</p>
                    <ul>
                        <li>The screening is conducted by approved, trained medical staff, often at your accommodation or a nearby partner clinic for your convenience.</li>
                        <li>The check is non-invasive and focuses on key indicators for high-altitude trekking, such as blood pressure, oxygen saturation, heart rate, and a review of any relevant respiratory or cardiac history.</li>
                        <li>If a guest is not cleared for the hike, this is a safety decision we must respect. While we cannot offer a partial refund (as costs are pre-committed), we will ensure you can rest comfortably and safely while the group proceeds.</li>
                    </ul>
                </section>
                
                <section className="mt-8">
                    <h2>3. For Other Travelers</h2>
                    <p>We believe safety at Ijen is a shared responsibility, not a competitive advantage. That’s why we support a public-facing digital process available to all visitors at:</p>
                    <div className="text-center my-4">
                        <a href="https://health.mountijen.com" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-primary underline">health.mountijen.com</a>
                    </div>
                    <p>This system allows travelers to:</p>
                    <ul>
                        <li>Register their details securely.</li>
                        <li>Attend a screening with a participating provider in the region.</li>
                        <li>Receive a <strong>digitally signed health clearance</strong> with a unique <strong>QR code</strong>.</li>
                    </ul>
                </section>

                <section className="mt-8">
                    <h2>4. At the Gate</h2>
                    <p>The goal of the digital system is to help gate staff at the Ijen entrance quickly and reliably verify that a real health check occurred. By scanning the QR code, they can confirm the clearance is legitimate, reducing the reliance on paper documents that can be easily forged.</p>
                </section>
                
                <section className="mt-8">
                    <h2>5. Data & Privacy</h2>
                    <p>Your health data is processed for safety and compliance purposes only. We handle this sensitive information with care, limiting its retention and access. For full details, please review our <Link href="/travel-guide/privacy">Privacy Policy</Link>.</p>
                </section>

                <section className="mt-8">
                    <h2>Frequently Asked Questions</h2>
                    {faqs.map((faq, index) => (
                        <div key={index} className="mt-4">
                            <h3 className="font-semibold">{faq.question}</h3>
                            <p>{faq.answer}</p>
                        </div>
                    ))}
                </section>
            </div>
        </main>
      </div>
    </>
  );
};

export default IjenHealthScreeningPage;