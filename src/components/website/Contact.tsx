import React from 'react';
import { Mail, MessageCircle, MapPin } from 'lucide-react';
import ContactMapEmbed from './ContactMapEmbed';

interface ContactProps {
  deferMap?: boolean;
}

const Contact: React.FC<ContactProps> = ({ deferMap = false }) => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@javavolcano-touroperator.com',
      href: 'mailto:hello@javavolcano-touroperator.com',
      description: 'We generally reply within a few business hours.'
    },
    {
      icon: MessageCircle, // Menggunakan MessageCircle karena WhatsApp biasanya chat
      title: 'WhatsApp',
      value: '+62 822 4478 8833',
      href: 'https://wa.me/6282244788833',
      description: 'Available 08:00 - 22:00 WIB'
    },
    {
      icon: MapPin,
      title: 'Our Office',
      value: 'Jl. Khairil Anwar No.102 A, Badean, Kec. Bondowoso, Jawa Timur 68214.',
      href: 'https://maps.app.goo.gl/fwZq5hBZcS6rRupA9',
      description: 'Visit us for a consultation.'
    },
  ];

  return (
    <section id="contact" className="min-h-screen bg-gray-50 text-gray-800 py-10">
      
      {/* Header Section */}
      <header className="pt-24 pb-8 md:pt-32 md:pb-12 container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          Get in Touch
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Ready to plan your secure and authentic East Java adventure? Contact our team today. No bots, just humans.
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Contact Info */}
          <div className="w-full lg:w-5/12 space-y-8 mt-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                Have questions about our packages or need a custom itinerary? We are ready to assist you directly.
              </p>
            </div>

            <div className="space-y-8 mt-8">
              {contactInfo.map((item) => (
                <div key={item.title} className="flex group">
                  {/* Icon Container */}
                  <div className="flex-shrink-0 mr-5">
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white transition-all duration-300">
                      <item.icon className="w-6 h-6" />
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <a 
                      href={item.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-600 mt-1 hover:text-green-600 transition-colors block font-medium break-words"
                    >
                      {item.value}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Map (Replacing the Form container style) */}
          <div className="w-full lg:w-7/12">
            <ContactMapEmbed defer={deferMap} />
          </div>

        </div>
      </main>
    </section>
  );
};

export default Contact;
