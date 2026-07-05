// components/website/ContactPage.tsx

import BookingForm from './BookingForm';
import TrackedContactLink from './TrackedContactLink';
import { contactInfo, proofLinks } from '@/constants';
import { MapPin, Phone, Mail, MessageCircle, Users, Bot, Compass } from "lucide-react";

interface ContactPageProps {
  title?: string;
  description?: string;
}

const ContactPage = ({
  title = "Contact Us",
  description = "We're here to help you plan your perfect East Java adventure. Reach out with any questions!",
}: ContactPageProps) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Hero — navy, operational-certainty framing per design-reference spec */}
      <header className="bg-jvto-navy text-white pb-14 pt-28 md:pt-36">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime mb-6">
            Operational Certainty
          </span>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </header>

      {/* Direct channels — three ways to reach us */}
      <section className="py-12 md:py-16 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TrackedContactLink
              channel="whatsapp"
              href={contactInfo.whatsappLink}
              source="contact_page_tile"
              linkText={contactInfo.whatsapp}
              className="rounded-2xl border-2 border-jvto-green/40 bg-jvto-green/5 p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <MessageCircle className="w-7 h-7 text-jvto-green" />
              <h3 className="text-lg font-bold text-gray-900">WhatsApp support</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Fastest response for urgent inquiries and real-time planning support. Human ops team, not a bot.</p>
              <span className="text-xs font-bold uppercase tracking-wider text-jvto-green mt-auto">Chat now →</span>
            </TrackedContactLink>

            <TrackedContactLink
              channel="email"
              href={`mailto:${contactInfo.email}`}
              source="contact_page_tile"
              linkText={contactInfo.email}
              className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <Mail className="w-7 h-7 text-jvto-orange" />
              <h3 className="text-lg font-bold text-gray-900">Email planning</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Best for detailed itineraries, group bookings, and formal inquiries with full requirements.</p>
              <span className="text-xs font-bold uppercase tracking-wider text-jvto-orange mt-auto">Send email →</span>
            </TrackedContactLink>

            <a
              href={proofLinks.officeMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <MapPin className="w-7 h-7 text-jvto-orange" />
              <h3 className="text-lg font-bold text-gray-900">Office location</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{contactInfo.officeAddress}. By appointment for travelers already on-route.</p>
              <span className="text-xs font-bold uppercase tracking-wider text-jvto-orange mt-auto">Get directions →</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start max-w-6xl mx-auto">

            {/* Left Column: Contact Info */}
            <div className="w-full lg:w-5/12 space-y-8 mt-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Have questions about our packages or need a custom itinerary? We are ready to assist you.
                  </p>
                </div>

                <div className="space-y-8 mt-8">

                    {/* Office Item */}
                    <div className="flex group">
                        <div className="flex-shrink-0 mr-5">
                          <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white transition-all duration-300">
                            <MapPin className="w-6 h-6" />
                          </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Our Office</h3>
                            <a 
                              href={proofLinks.officeMaps} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-gray-600 mt-1 hover:text-green-600 transition-colors block leading-relaxed"
                            >
                              {contactInfo.officeAddress}
                            </a>
                            <p className="text-sm text-gray-600 mt-1">Hours: 08:00 - 22:00 WIB (GMT+7)</p>
                        </div>
                    </div>

                    {/* Phone Item */}
                    <div className="flex group">
                        <div className="flex-shrink-0 mr-5">
                          <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white transition-all duration-300">
                            <Phone className="w-6 h-6" />
                          </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Phone & WhatsApp</h3>
                            <TrackedContactLink
                              channel="whatsapp"
                              href={contactInfo.whatsappLink}
                              source="contact_page"
                              linkText={contactInfo.whatsapp}
                              className="text-gray-600 mt-1 hover:text-green-600 transition-colors block font-medium"
                            >
                              {contactInfo.whatsapp}
                            </TrackedContactLink>
                            <p className="text-sm text-gray-600 mt-1">Available 08:00 - 22:00 WIB</p>
                        </div>
                    </div>

                    {/* Email Item */}
                    <div className="flex group">
                        <div className="flex-shrink-0 mr-5">
                          <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white transition-all duration-300">
                            <Mail className="w-6 h-6" />
                          </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Email</h3>
                            <TrackedContactLink
                              channel="email"
                              href={`mailto:${contactInfo.email}`}
                              source="contact_page"
                              linkText={contactInfo.email}
                              className="text-gray-600 mt-1 hover:text-green-600 transition-colors block font-medium"
                            >
                              {contactInfo.email}
                            </TrackedContactLink>
                            <p className="text-sm text-gray-600 mt-1">We generally reply within a few business hours.</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-7/12">
                 <div className="bg-white p-8 md:p-10 rounded-sm shadow-xl border border-gray-100">
                    <BookingForm />
                 </div>
            </div>
        </div>
      </main>

      {/* Our response standard */}
      <section className="bg-jvto-navy text-white py-14 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2
            className="text-2xl md:text-3xl font-black tracking-tight text-white mb-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our response <span className="text-jvto-orange">standard.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Users className="w-7 h-7 text-jvto-lime mb-3" />
              <h3 className="text-base font-bold text-white mb-2">Real human response</h3>
              <p className="text-sm text-white/70 leading-relaxed">Every inquiry is handled by a member of our ops team who knows the routes personally.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Bot className="w-7 h-7 text-jvto-lime mb-3" />
              <h3 className="text-base font-bold text-white mb-2">No automated bots</h3>
              <p className="text-sm text-white/70 leading-relaxed">We do not use bots for planning. Your safety is too important for machine-generated advice.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Compass className="w-7 h-7 text-jvto-lime mb-3" />
              <h3 className="text-base font-bold text-white mb-2">Expert operational advice</h3>
              <p className="text-sm text-white/70 leading-relaxed">Advice based on current volcano status and logistical reality, not just sales goals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
