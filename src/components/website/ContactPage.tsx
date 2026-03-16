// components/website/ContactPage.tsx

import BookingForm from './BookingForm'; 
import { contactInfo, proofLinks } from '@/constants';
import { MapPin, Phone, Mail } from "lucide-react";

interface ContactPageProps {
  title?: string;
  description?: string;
}

const ContactPage = ({
  title = "Contact Us",
  description = "We're here to help you plan your perfect East Java adventure. Reach out with any questions!",
}: ContactPageProps) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-10">
      
      {/* Header Section (Text Only) */}
      <header className="pt-24 pb-8 md:pt-32 md:pb-12 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
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
                            <p className="text-sm text-gray-400 mt-1">Hours: 08:00 - 22:00 WIB (GMT+7)</p>
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
                            <a 
                              href={contactInfo.whatsappLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-gray-600 mt-1 hover:text-green-600 transition-colors block font-medium"
                            >
                              {contactInfo.whatsapp}
                            </a>
                            <p className="text-sm text-gray-400 mt-1">Available 08:00 - 22:00 WIB</p>
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
                            <a 
                              href={`mailto:${contactInfo.email}`} 
                              className="text-gray-600 mt-1 hover:text-green-600 transition-colors block font-medium"
                            >
                              {contactInfo.email}
                            </a>
                            <p className="text-sm text-gray-400 mt-1">We generally reply within a few business hours.</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-7/12">
                 <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
                    <BookingForm />
                 </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
