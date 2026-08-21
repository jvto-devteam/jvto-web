import React from 'react';
import { Instagram, Facebook, Shield, MapPin, FileCheck } from 'lucide-react';
import Link from "@/components/website/AppLink";
import Image from "next/image";
import TrackedContactLink from "./TrackedContactLink";
import { contactInfo } from "@/constants";

const Footer: React.FC = () => {
  return (
    <footer className="bg-jvto-navy text-white pt-20 pb-10">
      <div className="container mx-auto px-6">

        {/* Top Section: Trust Icons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 border-b border-white/10 pb-12">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-jvto-lime" />
            <h3 className="font-bold text-sm uppercase mb-2">Tourist Police Led</h3>
            <p className="text-xs text-white/50">Operations overseen by active Tourist Police officers for maximum safety.</p>
          </div>
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-jvto-lime" />
            <h3 className="font-bold text-sm uppercase mb-2">Bondowoso HQ</h3>
            <p className="text-xs text-white/50">Official office at Jl. Khairil Anwar No.102 A.</p>
          </div>
          <div className="text-center">
            <FileCheck className="w-12 h-12 mx-auto mb-4 text-jvto-lime" />
            <h3 className="font-bold text-sm uppercase mb-2">Licensed Operator</h3>
            <p className="text-xs text-white/50">NIB &amp; TDUP No. 1102230032918.</p>
          </div>
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-jvto-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="font-bold text-sm uppercase mb-2">Community First</h3>
            <p className="text-xs text-white/50">Supporting local guides and sustainable tourism practices.</p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div>
            <h3 className="font-bold text-xs uppercase text-white/60 tracking-[0.2em] mb-6">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/why-jvto" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Why JVTO</Link></li>
              <li><Link href="/why-jvto/our-story" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Our Story</Link></li>
              <li><Link href="/why-jvto/reviews" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Reviews</Link></li>
              <li><Link href="/why-jvto/community-standards" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Community &amp; Guides</Link></li>
              <li>
                <Link href="/verify-jvto" prefetch={false} className="font-bold text-jvto-lime hover:text-jvto-lime/80 transition-colors">
                  Verify Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase text-white/60 tracking-[0.2em] mb-6">Travel Guide</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/travel-guide/faq" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">FAQ</Link></li>
              <li><Link href="/travel-guide/booking-information" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Booking &amp; Payments</Link></li>
              <li><Link href="/travel-guide/ijen-health-screening" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Ijen Health Screening</Link></li>
              <li><Link href="/isic/student-package" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Student Deals (ISIC)</Link></li>
              <li><Link href="/blog" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Insights</Link></li>
              <li><Link href="/policy" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase text-white/60 tracking-[0.2em] mb-6">Destinations</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/destinations/mount-bromo" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Mount Bromo</Link></li>
              <li><Link href="/destinations/ijen-crater" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Ijen Crater</Link></li>
              <li><Link href="/destinations/tumpak-sewu-waterfall" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">Tumpak Sewu</Link></li>
              <li><Link href="/tours" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">All Private Tours</Link></li>
              <li><Link href="/markets/singapore" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">From Singapore</Link></li>
              <li><Link href="/markets/malaysia" prefetch={false} className="text-white/70 hover:text-jvto-orange transition-colors">From Malaysia</Link></li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-2">
            <h3 className="font-bold text-xs uppercase text-white/60 tracking-[0.2em] mb-6">Contact</h3>
            <p className="text-sm text-white/60 mb-4">
              <strong className="text-white">PT Java Volcano Rendezvous</strong><br />
              Jl. Khairil Anwar No.102 A, Badean,<br />
              Bondowoso, East Java 68214, Indonesia
            </p>
            <p className="text-sm text-white/60 mb-6">
              WhatsApp:{" "}
              <TrackedContactLink
                channel="whatsapp"
                href={contactInfo.whatsappLink}
                source="footer"
                linkText={contactInfo.whatsapp}
                className="text-white/80 hover:text-jvto-orange underline-offset-2 hover:underline transition-colors"
              >
                {contactInfo.whatsapp}
              </TrackedContactLink>
              <br />
              Email:{" "}
              <TrackedContactLink
                channel="email"
                href={`mailto:${contactInfo.email}`}
                source="footer"
                linkText={contactInfo.email}
                className="text-white/80 hover:text-jvto-orange underline-offset-2 hover:underline break-all transition-colors"
              >
                {contactInfo.email}
              </TrackedContactLink>
            </p>
            <Link
              href="/contact"
              prefetch={false}
              className="inline-block bg-jvto-orange text-white font-bold uppercase px-6 py-3 text-xs rounded-full tracking-[0.2em] hover:bg-jvto-orange-hover transition-colors"
              style={{ boxShadow: 'var(--shadow-jvto-orange)' }}
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row gap-2 mb-4 md:mb-0">
            <Image
              src="/assets/img/jvto-logo.png"
              alt="JVTO Logo Footer"
              width={70}
              height={70}
              unoptimized
              className="object-contain"
            />
            <span className="text-xs text-white/60">
              ©️ Copyright 2015-2026 PT. Java Volcano Rendezvous | East Java, Indonesia | All Rights Reserved.{" "}
              <br />
              <Link href="/policy/privacy" prefetch={false} className="text-jvto-lime hover:underline">Privacy Policy</Link>
            </span>
            <span className="text-xs text-white/60">Popular with travellers from Singapore, Malaysia, Hong Kong, and Taiwan.</span>
          </div>

          <div className="flex gap-4">
            <a target="_blank" href="https://www.instagram.com/javavolcanotouroperator/" aria-label="Instagram" className="bg-white/10 p-2 rounded-full hover:bg-jvto-navy-mid transition-colors">
              <Instagram size={16} />
            </a>
            <a target="_blank" href="https://www.facebook.com/javavolcanotours/" aria-label="Facebook" className="bg-white/10 p-2 rounded-full hover:bg-jvto-navy-mid transition-colors">
              <Facebook size={16} />
            </a>
            {/* Twitter/X icon removed 2026-08-21: twitter.com/jvto_tours returns
                404 on three attempts while an invented control handle returns
                200, so the 404 is real and the account does not exist. A dead
                link in the footer also fed a dead sameAs, which weakens entity
                consolidation instead of helping it. Restore both together if
                the handle is ever registered. */}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
