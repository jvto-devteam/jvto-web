// FIX: Implemented the HomePage component to resolve the 'not a module' error in App.tsx by assembling various sections into a cohesive landing page.
import React, { useCallback } from 'react';

// Components
import Hero from './Hero';
import SEO from './SEO';
import StructuredData from './StructuredData';
import SocialProof from './SocialProof';
import ProofBelt from './ProofBelt';
import PillarsOfTrust from './PillarsOfTrust';
import StartingPointSection from './StartingPointSection';
import FAQSection from './FAQSection';
import EnhancedTourSection from './EnhancedTourSection';
import VideoSection from './VideoSection';
import IjenHealthScreeningSection from './IjenHealthScreeningSection';
import GroupsAndEscortsSection from './GroupsAndEscortsSection';
import PlannerCtaSection from './PlannerCtaSection';
import TravelGuideTeaser from './TravelGuideTeaser';
import CommunityPartnerships from './CommunityPartnerships';


// Data
import { heroCopy, contactInfo, miniFaqs, faqsCopy, toursSectionCopy } from '@/constants';
import { tourPackages } from '@/data';

const travelAgencySchema = {
    "@context":"https://schema.org",
    "@type":"TravelAgency",
    "@id":"https://javavolcano-touroperator.com/#org",
    "name":"Java Volcano Tour Operator",
    "legalName":"PT Java Volcano Rendezvous",
    "url":"https://javavolcano-touroperator.com/",
    "logo":"https://legacy.javavolcano-touroperator.com/assets/logo.png",
    "email": contactInfo.email,
    "telephone": contactInfo.whatsapp,
    "priceRange":"IDR",
    "address":{
      "@type":"PostalAddress",
      "streetAddress":"Jl. Khairil Anwar No.102 A, Badean",
      "addressLocality":"Bondowoso",
      "addressRegion":"Jawa Timur",
      "postalCode":"68217",
      "addressCountry":"ID"
    },
    "founder":{
      "@type":"Person",
      "@id":"https://javavolcano-touroperator.com/#founder",
      "name":"Agung Sambuko (Mr. Sam)",
      "jobTitle": ["Founder & CEO, JVTO", "Active-Duty Officer, East Java Tourist Police Unit", "Supervisor, HPWKI"],
      "knowsAbout":["TouristSafety","EastJavaTourism","VolcanoTrekking","LogisticsManagement"],
      "affiliation":{"@id":"https://javavolcano-touroperator.com/#org"}
    },
    "memberOf": {
      "@type": "Organization",
      "name": "HPWKI"
    },
    "identifier":[
      {
        "@type":"PropertyValue",
        "propertyID":"NIB",
        "value":"1102230032918"
      },
      {
        "@type":"PropertyValue",
        "propertyID":"TDUP",
        "value":"1102230032918"
      }
    ],
    "sameAs":[
      "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
      "https://ie.trustpilot.com/review/javavolcano-touroperator.com",
      "https://www.google.com/maps/place/Java+Volcano+Tour+Operator/@-7.9161788,113.8111617,17z",
      "https://www.isic.org/discounts/?providerId=259268",
      "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator"
    ]
};

const HomePage = () => {
    
    const featuredTours = tourPackages.filter(t => t.isFeatured).slice(0, 6);

    return (
        <>
            <SEO
                title="East Java Volcano Tours — Private & All‑Inclusive | JVTO"
                description="Private Bromo & Ijen tours from Surabaya or Bali. All‑inclusive, licensed operator. No hidden fees. Explore custom itineraries and book your adventure today."
            />
            <StructuredData data={travelAgencySchema} />
            
            {/* 1. Hero Block */}
            <Hero heroCopy={heroCopy} />
            
            {/* 2. Trust Strip (Anchor Proof) */}
            <ProofBelt />
            
            {/* 3. Start from Origin */}
            <StartingPointSection />
            
            {/* 4. Featured Tours ("Money Pages") */}
            <EnhancedTourSection />
            
            {/* 5. Why JVTO Teaser (Trust Pillars) */}
            <PillarsOfTrust />
            
            {/* 6. Ijen Health Screening Highlight */}
            <IjenHealthScreeningSection />
            
            {/* Video Section (Optional visual break) */}
            <VideoSection />

            {/* 7. Reviews & Community */}
            <SocialProof />
            <CommunityPartnerships />
            <GroupsAndEscortsSection />
            
            {/* 8. Travel Guide Teaser (The Rulebook) */}
            <TravelGuideTeaser />
            
            {/* 9. Final CTA */}
            <PlannerCtaSection />
        </>
    );
};

export default HomePage;