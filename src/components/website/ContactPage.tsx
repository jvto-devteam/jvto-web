import BookingForm from './BookingForm'; // Re-using this as a contact form
import { contactInfo, proofLinks } from '@/constants';

const ContactPage = () => {

  return (
    <>
      <div className="bg-background-light dark:bg-ink-primary">
        <header className="relative py-28 md:py-48 bg-ink-primary text-white text-center">
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