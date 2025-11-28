import React from 'react';
import BookingForm from './BookingForm'; // Re-using this as a contact form
import StructuredData from './StructuredData';
import SEO from './SEO';
// FIX: Import 'proofLinks' to resolve the "Cannot find name" error.
import { contactInfo, proofLinks } from '@/constants';

const ContactPage = () => {
  const baseUrl = 'https://jvto.example.com';
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/#/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
        item: `${baseUrl}/#/contact`,
      },
    ],
  };

  return (
    <>
      <SEO
        title="Contact JVTO Tours | Plan Your East Java Adventure"
        description="Get in touch with our expert team to plan your private, all-inclusive tour of Mount Bromo, Ijen, and more. We're here to help you 24/7."
      />
      <div className="bg-background-light dark:bg-ink-primary pt-20">
        <StructuredData data={breadcrumbSchema} />
        <header className="relative py-20 md:py-32 bg-ink-primary text-white text-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: `url('https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1200&auto-format=fit=crop')`}}></div>
          <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold">Contact Us</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">{`We're`} here to help you plan your perfect East Java adventure. Reach out with any questions!</p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column: Contact Info */}
              <div className="text-ink-primary dark:text-white">
                  <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                  <div className="space-y-6">
                      <div className="flex items-start gap-4">
                          <span className="material-symbols-outlined text-3xl text-primary mt-1">location_on</span>
                          <div>
                              <h3 className="text-xl font-semibold">Our Office</h3>
                              <a href={proofLinks.officeMaps} target="_blank" rel="noopener noreferrer" className="text-ink-neutral-700 dark:text-ink-neutral-200 mt-1 hover:text-primary transition-colors block">{contactInfo.officeAddress}</a>
                               <p className="text-sm text-ink-neutral-500 dark:text-ink-neutral-400">Hours: 08:00 - 22:00 WIB (GMT+7)</p>
                          </div>
                      </div>
                       <div className="flex items-start gap-4">
                          <span className="material-symbols-outlined text-3xl text-primary mt-1">call</span>
                          <div>
                              <h3 className="text-xl font-semibold">Phone & WhatsApp</h3>
                              <a href={contactInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-ink-neutral-700 dark:text-ink-neutral-200 mt-1 hover:text-primary transition-colors block">{contactInfo.whatsapp}</a>
                              <p className="text-sm text-ink-neutral-500 dark:text-ink-neutral-400">Available 08:00 - 22:00 WIB</p>
                          </div>
                      </div>
                       <div className="flex items-start gap-4">
                          <span className="material-symbols-outlined text-3xl text-primary mt-1">email</span>
                          <div>
                              <h3 className="text-xl font-semibold">Email</h3>
                              <a href={`mailto:${contactInfo.email}`} className="text-ink-neutral-700 dark:text-ink-neutral-200 mt-1 hover:text-primary transition-colors block">{contactInfo.email}</a>
                               <p className="text-sm text-ink-neutral-500 dark:text-ink-neutral-400">We generally reply within a few business hours.</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Right Column: Form */}
              <div className="bg-white dark:bg-background-dark p-6 md:p-8 rounded-2xl shadow-lg">
                   <BookingForm />
              </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ContactPage;