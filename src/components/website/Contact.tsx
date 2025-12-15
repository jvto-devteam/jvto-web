import React from 'react';
import { Mail, MessageCircle, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@javavolcano-touroperator.com',
      href: 'mailto:info@javavolcano-touroperator.com',
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
      value: 'Jl. Khairil Anwar No.102 A, Badean, Kec. Bondowoso, Jawa Timur 68217.',
      href: 'https://maps.app.goo.gl/fwZq5hBZcS6rRupA9',
      description: 'Visit us for a consultation.'
    },
  ];

  return (
    <section id="contact" className="min-h-screen bg-gray-50 text-gray-800 py-10">
      
      {/* Header Section */}
      <header className="pt-24 pb-8 md:pt-32 md:pb-12 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          Get in Touch
        </h1>
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
                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Map (Replacing the Form container style) */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 h-[500px] overflow-hidden relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.437436214531!2d113.8085867759296!3d-7.916178892019881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6dce1d25a03db%3A0x11932bb44bf4e2bd!2sJava%20Volcano%20Tour%20Operator!5e0!3m2!1sen!2sid!4v1722839981585!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Java Volcano Tour Operator Location"
                className="w-full h-full rounded-2xl grayscale contrast-[1.1] group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
              
              {/* Optional: Floating Badge inside map similar to styling */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Java Volcano Base
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </section>
  );
};

export default Contact;