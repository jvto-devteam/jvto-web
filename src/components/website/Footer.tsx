import React from 'react';
import { Instagram, Facebook, Twitter, Shield, MapPin, FileCheck } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-jvto-dark text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        
        {/* Top Section: Trust Icons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 border-b border-gray-800 pb-12">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-jvto-green" />
            <h4 className="font-bold text-sm uppercase mb-2">Tourist Police Led</h4>
            <p className="text-xs text-slate-300">Operations overseen by active Tourist Police officers for maximum safety.</p>
          </div>
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-jvto-green" />
            <h4 className="font-bold text-sm uppercase mb-2">Bondowoso HQ</h4>
            <p className="text-xs text-slate-300">Official office at Jl. Khairil Anwar No.102 A.</p>
          </div>
          <div className="text-center">
            <FileCheck className="w-12 h-12 mx-auto mb-4 text-jvto-green" />
            <h4 className="font-bold text-sm uppercase mb-2">Licensed Operator</h4>
            <p className="text-xs text-slate-300">NIB & TDUP No. 1102230032918.</p>
          </div>
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-jvto-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <h4 className="font-bold text-sm uppercase mb-2">Community First</h4>
            <p className="text-xs text-slate-300">Supporting local guides and sustainable tourism practices.</p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div>
            <h5 className="font-bold text-xs uppercase text-slate-200 mb-6">Company</h5>
            <ul className="space-y-3 text-sm">
              <li><Link href="/why-jvto" prefetch={false} className="hover:text-jvto-green">Why JVTO</Link></li>
              <li><Link href="/why-jvto/our-story" prefetch={false} className="hover:text-jvto-green">Our Story</Link></li>
              <li><Link href="/why-jvto/reviews" prefetch={false} className="hover:text-jvto-green">Reviews</Link></li>
              <li><Link href="/why-jvto/community-standards" prefetch={false} className="hover:text-jvto-green">Community & Guides</Link></li>
              <li><Link href="/verify-jvto" prefetch={false} className="hover:text-jvto-green font-bold text-jvto-green">Verify Us</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase text-slate-200 mb-6">Travel Guide</h5>
            <ul className="space-y-3 text-sm">
              <li><Link href="/travel-guide/faq" prefetch={false} className="hover:text-jvto-green">FAQ</Link></li>
              <li><Link href="/travel-guide/booking-information" prefetch={false} className="hover:text-jvto-green">Booking & Payments</Link></li>
              <li><Link href="/travel-guide/ijen-health-screening" prefetch={false} className="hover:text-jvto-green">Ijen Health Screening</Link></li>
              <li><Link href="/isic/student-package" prefetch={false} className="hover:text-jvto-green">Student Deals (ISIC)</Link></li>
              <li><Link href="/policy" prefetch={false} className="hover:text-jvto-green">Policy</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase text-slate-200 mb-6">Destinations</h5>
            <ul className="space-y-3 text-sm">
              <li><Link href="/destinations" prefetch={false} className="hover:text-jvto-green">Mount Bromo</Link></li>
              <li><Link href="/destinations" prefetch={false} className="hover:text-jvto-green">Ijen Crater</Link></li>
              <li><Link href="/destinations" prefetch={false} className="hover:text-jvto-green">Tumpak Sewu</Link></li>
              <li><Link href="/tours" prefetch={false} className="hover:text-jvto-green">All Private Tours</Link></li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-2">
             <h5 className="font-bold text-xs uppercase text-slate-200 mb-6">Contact</h5>
             <p className="text-sm text-slate-300 mb-4">
               <strong>PT Java Volcano Rendezvous</strong><br/>
               Jl. Khairil Anwar No.102 A, Badean,<br/>
               Bondowoso, East Java 68214, Indonesia
             </p>
             <p className="text-sm text-slate-300 mb-6">
               WhatsApp: +62 822-4478-8833<br/>
               Email: hello@javavolcano-touroperator.com
             </p>
             <Link href="/contact" prefetch={false} className="inline-block bg-jvto-green text-jvto-dark font-bold uppercase px-6 py-2 text-xs rounded-sm">Contact Us</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row gap-2 mb-4 md:mb-0">
              <Image
                src="/assets/img/jvto-logo.png"
                alt="JVTO Logo Footer"
                width={70}
                height={70}
                priority
                className="object-contain"
              />
            {/* <span className="font-black text-2xl italic tracking-tighter">JVTO</span> */}
            <span className="text-xs text-slate-300">©️ Copyright 2015-2026 PT. Java Volcano Rendezvous | East Java, Indonesia | All Rights Reserved. <br /><Link href="/policy/privacy" prefetch={false} className="text-jvto-green underline">Privacy Policy</Link></span>
            <span className="text-xs text-slate-300">Popular with travellers from Singapore, Malaysia, Hong Kong, and Taiwan.</span>
          </div>
          
          <div className="flex gap-4">
            <a target="_blank" href="https://www.instagram.com/javavolcanotouroperator/" aria-label="Instagram" className="bg-gray-800 p-2 rounded-full hover:bg-jvto-green hover:text-jvto-dark transition-colors"><Instagram size={16} /></a>
            <a target="_blank" href="https://www.facebook.com/javavolcanotours/" aria-label="Facebook" className="bg-gray-800 p-2 rounded-full hover:bg-jvto-green hover:text-jvto-dark transition-colors"><Facebook size={16} /></a>
            <a target="_blank" href="#" aria-label="Twitter" className="bg-gray-800 p-2 rounded-full hover:bg-jvto-green hover:text-jvto-dark transition-colors"><Twitter size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
