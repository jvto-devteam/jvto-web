import React from 'react';
import SEO from './SEO';
import Breadcrumbs from './Breadcrumbs';

const PrivacyPolicyPage: React.FC = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Travel Guide', path: '/travel-guide' },
    { name: 'Privacy Policy', path: '/travel-guide/privacy' },
  ];

  return (
    <>
      <SEO
        title="Privacy Policy | JVTO Tours"
        description="Our privacy policy explains what personal information we collect, how we use it, and your rights. JVTO is committed to data security and guest safety."
      />
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
            <div className="container mx-auto px-4">
                <Breadcrumbs crumbs={breadcrumbCrumbs} />
                <div className="mt-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-ink-primary dark:text-white">Privacy Policy</h1>
                    <p className="mt-2 text-sm text-ink-neutral-500 dark:text-ink-neutral-400">Last Updated: October 29, 2025</p>
                    <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200 max-w-3xl">
                        Applies to all bookings and enquiries made with JVTO (PT Java Volcano Rendezvous).
                    </p>
                </div>
            </div>
        </header>
        <main className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-ink-primary dark:prose-headings:text-white prose-headings:border-b prose-headings:border-ink-neutral-200 dark:prose-headings:border-ink-neutral-700 prose-headings:pb-2 prose-p:text-ink-neutral-700 dark:prose-p:text-ink-neutral-200 prose-li:text-ink-neutral-700 dark:prose-li:text-ink-neutral-200 prose-ul:list-disc prose-ul:ml-5">
            
            <section>
              <h2>1. About this Policy</h2>
              <p>JVTO {`("Java Volcano Tour Operator", "JVTO", "we", "our", "us")`} takes privacy, data security, and guest safety seriously. We operate private, fully managed tours in East Java and Bali with an explicit focus on safety, lawful conduct, and accountability.</p>
              <p>This Privacy Policy explains:</p>
              <ul>
                <li>what personal information we collect from you,</li>
                <li>how and why we collect it,</li>
                <li>how we use it,</li>
                <li>who we share it with and why,</li>
                <li>how we protect it, and</li>
                <li>the choices and rights you have.</li>
              </ul>
              <p>By contacting us, requesting a quote, confirming a booking, or joining a tour, you acknowledge that you have read and understood this Privacy Policy.</p>
              <p>We may update this Privacy Policy from time to time to reflect changes in law, changes in our operations, or new services (for example, new digital tools such as the customer portal / booking dashboard). You are responsible for reviewing this Privacy Policy periodically. If material changes are made, we will publish the new version on our official channels (website, booking portal, or direct communication).</p>
            </section>

            <section className="mt-8">
              <h2>2. Who is JVTO?</h2>
              <ul>
                <li><strong>Legal Entity:</strong> PT Java Volcano Rendezvous</li>
                <li><strong>Brand / Trading Name:</strong> Java Volcano Tour Operator (JVTO)</li>
                <li><strong>Business ID (NIB):</strong> 1102230032918</li>
                <li><strong>Tourism License (TDUP):</strong> 1102230032918 (issued 11 February 2023)</li>
                <li><strong>Registered Office:</strong> Jl. Khairil Anwar No.102 A, Badean, Bondowoso, East Java 68217, Indonesia.</li>
                <li><strong>Primary WhatsApp:</strong> +62 822-4478-8833</li>
                <li><strong>Email:</strong> info@javavolcano-touroperator.com</li>
              </ul>
              <p>JVTO is an all-inclusive private tour operator. We do not run open/join-in group tours. We control transport, guides, accommodation, and safety protocols directly or via vetted local partners.</p>
            </section>
            
            <section className="mt-8">
                <h2>3. When this Policy applies</h2>
                <p>This Privacy Policy applies to:</p>
                <ul>
                    <li>anyone who contacts us via WhatsApp, email, booking form, or website enquiry,</li>
                    <li>anyone who books or travels with JVTO,</li>
                    <li>group organisers who book on behalf of other travellers,</li>
                    <li>suppliers, guides, drivers, and service partners who work with us,</li>
                    <li>visitors who access our website, booking portal, or customer portal {`("My Bookings")`}, which is used to deliver e-vouchers, itineraries, meeting instructions, and crew contact information.</li>
                </ul>
                <p>If you are using a third-party service (for example, an online marketplace, payment service, or insurance provider), you must also review their privacy policy, because they collect and process your data under their own legal framework.</p>
            </section>

            <section className="mt-8">
                <h2>4. Information we collect</h2>
                <h3>4.1 When you enquire or make a booking</h3>
                <p>We collect information that allows us to answer your questions, prepare an accurate quote, and operate your tour safely and legally. This can include:</p>
                <ul>
                    <li>Full name, phone number (including WhatsApp), and email address.</li>
                    <li>Nationality and passport details (including passport number, expiry, country of issue). Some national parks in Indonesia require passport details to generate entry permits (for example, Mount Bromo National Park and Mount Ijen).</li>
                    <li>Date of birth.</li>
                    <li>Group size and group composition.</li>
                    <li>Arrival / departure details (flight number, airport, train station, hotel pickup, etc.).</li>
                    <li>Accommodation preferences and rooming needs.</li>
                    <li>Dietary requirements or allergies (for example, vegetarian, nut allergy).</li>
                    <li>Medical or physical considerations that affect safety during the trip (for example, asthma, respiratory sensitivity to volcanic gases at Mount Ijen, knee issues affecting hiking to Tumpak Sewu, etc.).</li>
                    <li>Emergency contact details.</li>
                    <li>Travel insurance details (if provided).</li>
                </ul>
                <p>We also keep records of:</p>
                <ul>
                    <li>the tour products you enquired about or purchased,</li>
                    <li>logistics relevant to your booking (hotel allocation, vehicles, guides, ferry tickets, jeep allocation, health clearance for Ijen, etc.),</li>
                    <li>operational notes required to run the trip (pickup instructions, timing, crew assignment).</li>
                </ul>
                <p>If visa assistance or travel documentation is required (for example, border transit between Java and Bali, or cross-border travel arranged through a partner), we may request supporting information where required by local authorities.</p>

                <h3 className="mt-6">4.2 Health & safety information</h3>
                <p>For certain locations, Indonesian authorities require a valid health clearance before entry. For example, Mount Ijen requires a medical health certificate and in-person assessment to confirm you are fit to hike and fit to be exposed to volcanic gases. JVTO arranges this assessment for you, and a licensed medical professional may attend your hotel to perform the check.</p>
                <p>To make that possible, we may collect:</p>
                <ul>
                    <li>current health status relevant to trekking safety,</li>
                    <li>respiratory conditions or cardiac conditions,</li>
                    <li>medication needs (for example, medication that must be kept cool),</li>
                    <li>recent injuries or mobility limits.</li>
                </ul>
                <p>We collect this information <strong>only</strong> so we can:</p>
                <ul>
                    <li>assess whether the planned activity is safe for you,</li>
                    <li>brief our guides and drivers appropriately,</li>
                    <li>comply with local safety rules and park regulations,</li>
                    <li>support you in the event of an emergency.</li>
                </ul>
                <p>This type of information may be considered sensitive or special category data under certain data protection laws. We will only process it with your knowledge, your clear consent, or where it is necessary to protect your vital interests (for example, a medical emergency during a hike).</p>

                <h3 className="mt-6">4.3 Payment information</h3>
                <p>To secure and confirm your booking, JVTO accepts:</p>
                <ul>
                    <li>20% deposit to confirm your schedule,</li>
                    <li>final balance by card (5 days before Day 1), bank transfer/Wise (3 days before Day 1), or approved cash-on-arrival on Day 1,</li>
                    <li>100% upfront for last-minute bookings within 14 days of departure.</li>
                </ul>
                <p>We collect payment confirmation details (for example, proof of transfer, card authorization status) so we can link your payment to your booking record.</p>
                <p><strong>Important:</strong></p>
                <ul>
                    <li>We <strong>do not want</strong> you to send raw card numbers or full bank credentials via email, open chat, or plain text WhatsApp. We will either (i) provide you with secure transfer details (our corporate bank accounts at BCA / BRI), or (ii) process approved card payments through a secure channel.</li>
                    <li>If a phone call or voice note is used to arrange a refund or resolve a payment issue, we will not record your card number in call audio or store it in chat history beyond what is legally required for reconciliation.</li>
                </ul>

                <h3 className="mt-6">4.4 Website / portal usage data</h3>
                <p>When you access our website, booking form, or customer portal (for example, to download your e-voucher, view pickup instructions, or see your assigned driver photo), we may automatically collect:</p>
                <ul>
                    <li>IP address,</li>
                    <li>browser type and version,</li>
                    <li>device type,</li>
                    <li>time zone and language settings,</li>
                    <li>pages viewed and actions taken (for example, downloading your itinerary PDF).</li>
                </ul>
                <p>This data helps us keep the service functional and secure and to troubleshoot access issues.</p>
                
                <h3 className="mt-6">4.5 Communications & marketing</h3>
                <p>We may collect:</p>
                <ul>
                    <li>your name, email, phone, travel dates, and interests when you request an itinerary proposal,</li>
                    <li>your preferences (for example, {`"sunrise Bromo only, no waterfall hike" or "include Bali drop-off"`}),</li>
                    <li>survey responses and post-trip feedback you voluntarily send us.</li>
                </ul>
                <p>We may also retain chat transcripts (WhatsApp, email, customer portal messages) for quality control, training, dispute resolution, and safety.</p>
                <p>We <strong>do not</strong> add you to broadcast marketing lists without consent. You can ask us at any time not to receive promotional updates.</p>
            </section>

            <section className="mt-8">
              <h2>5. Personal information about others</h2>
              <p>If you book for other travellers (for example, family, friends, or a corporate / school / incentive group), you may give us personal information about them.</p>
              <p>By providing that information, you confirm that:</p>
              <ul>
                <li>you are authorized to share it,</li>
                <li>they understand that their information will be used for trip operations, safety, and legal compliance,</li>
                <li>they have been informed about this Privacy Policy.</li>
              </ul>
              <p>If someone else books a trip that includes you, we may receive your information from them.</p>
              <p>If you are listed as an emergency contact, we will store your name and contact details and may reach out to you in urgent situations.</p>
            </section>
            
            <section className="mt-8">
                <h2>6. Why we collect and use your information</h2>
                <p>We collect, use, and store your information so that we can:</p>
                <ol>
                    <li>Plan and operate your tour.</li>
                    <li>Book vehicles, accommodation, local guides, jeeps, ferries, and permits in your name.</li>
                    <li>Assign crew and communicate pickup and drop-off timing.</li>
                    <li>Meet legal and regulatory requirements.</li>
                    <li>National parks in East Java (e.g. Bromo, Ijen) require verified identity and in some cases proof of health clearance before entry.</li>
                    <li>Protect your safety.</li>
                    <li>Our founder is an active East Java Tourist Police officer; safety, regulatory compliance, and lawful conduct are core to our operation.</li>
                    <li>We may share essential health and ID information with medical teams, rescue personnel, or law enforcement in an emergency.</li>
                    <li>Communicate with you.</li>
                    <li>Send confirmations, vouchers, pickup instructions, crew contact details, and updates.</li>
                    <li>Answer questions, handle changes, manage complaints, and deliver assistance during the trip.</li>
                    <li>Protect our business and service quality.</li>
                    <li>Verify payments and prevent fraud.</li>
                    <li>Resolve disputes or claims.</li>
                    <li>Improve itinerary design, logistics flow, and guest experience.</li>
                    <li>Comply with our financial and tax obligations.</li>
                    <li>Keep legally required records of transactions, invoices, and payment confirmations.</li>
                </ol>
            </section>

            <section className="mt-8">
              <h2>7. Legal bases for processing (international guests)</h2>
              <p>Depending on your country of residence and the laws that apply (for example, GDPR in the EU/UK), our legal bases for processing may include:</p>
              <ul>
                <li><strong>Performance of a contract:</strong> we need your data to deliver the tour you booked and to fulfill our obligations under that booking.</li>
                <li><strong>Legitimate interests:</strong> we have a legitimate business interest in keeping guests safe, preventing fraud, coordinating logistics, and improving our services. We will not use your data in a way that overrides your fundamental rights.</li>
                <li><strong>Legal obligation:</strong> we may be required by Indonesian law, national park regulations, immigration authorities, or law enforcement to provide certain information.</li>
                <li><strong>Vital interests:</strong> in an emergency, we may process or share health and ID information to protect life, health, or safety.</li>
                <li><strong>Consent:</strong> for sensitive health data, for optional marketing communications, and for any use not covered above, we will rely on your explicit consent. You may withdraw consent at any time, subject to legal/operational limits.</li>
              </ul>
              <p>If you choose not to provide certain information, we may be unable to accept the booking or operate specific elements of the trip (for example, entering Mount Ijen without a health certificate is not permitted).</p>
            </section>

            <section className="mt-8">
              <h2>8. Photos, video, and media</h2>
              <p>During tours, guests and guides routinely take photos and videos (sunrise at Bromo, blue fire at Ijen, waterfall descent at Tumpak Sewu, etc.). This is part of the normal experience.</p>
              <ul>
                <li>If you <strong>do not</strong> want to be photographed or filmed, tell your guide clearly. We will respect that and will brief the crew.</li>
                <li>We will <strong>not</strong> use identifiable images of you in JVTO marketing without your knowledge and consent.</li>
                <li>We cannot fully control photos and videos taken independently by other guests.</li>
                <li>If a professional photographer/videographer is present for marketing purposes, we will inform you. Participation is optional.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2>9. Who we share your information with</h2>
              <p>To run your trip safely and legally, we may share relevant parts of your information with:</p>
              <ul>
                <li>Our internal operations team (scheduling vehicles, allocating drivers and guides, arranging hotel rooms, managing permits).</li>
                <li>Local accommodation providers and transport providers, including jeep drivers at Bromo and medical screeners for Ijen.</li>
                <li>National park authorities, rangers, and other officials who issue visitor permits or enforce safety rules.</li>
                <li>Ferry/transport partners for Java-Bali transfers.</li>
                <li>Payment processors / banks handling your deposit and final balance (for example, BRI and BCA corporate accounts of PT Java Volcano Rendezvous).</li>
                <li>Medical professionals, rescue teams, emergency services, or law enforcement if required for health, safety, or legal compliance.</li>
              </ul>
              <p>We also may share limited information with technology providers who host our booking portal, email infrastructure, chat support, or document delivery. These providers are required to handle data securely and only for our operational purposes.</p>
              <p><strong>We do not sell your personal data.</strong></p>
            </section>
            
            <section className="mt-8">
                <h2>10. International data transfers</h2>
                <p>JVTO is based in Indonesia, and most of our tours operate in East Java and Bali. Some of our systems (for example, cloud-based messaging, document delivery, backup, or payment processing) may be hosted on servers located outside Indonesia.</p>
                <p>Where we transfer or store your information in other countries, we take reasonable steps to:</p>
                <ul>
                    <li>limit access to only what is necessary for operations,</li>
                    <li>require confidentiality and security commitments from service providers,</li>
                    <li>comply with applicable data protection laws.</li>
                </ul>
                <p>If you have specific questions about where your data is stored or routed, you can contact us (see Section 14).</p>
            </section>

            <section className="mt-8">
                <h2>11. Your rights</h2>
                <p>Depending on your location and applicable law, you may have the right to:</p>
                <ul>
                    <li>request a copy of the personal information we hold about you,</li>
                    <li>ask us to correct inaccurate or incomplete information,</li>
                    <li>ask us to delete information (subject to legal retention requirements),</li>
                    <li>object to certain types of processing (for example, marketing),</li>
                    <li>withdraw consent where we rely on consent (for example, use of your photo in marketing or processing of medical data beyond safety/legal requirements),</li>
                    <li>request that we limit processing in specific circumstances.</li>
                </ul>
                <p>We will respond within a reasonable timeframe. If we cannot comply (for example, because we are legally required to keep certain financial records, or because deleting health data would create an unacceptable safety risk on an ongoing trip), we will explain why.</p>
                <p>You can exercise these rights by contacting us directly (see Section 14). You may also have the right to contact or lodge a complaint with your local data protection authority.</p>
            </section>

            <section className="mt-8">
                <h2>12. Retention</h2>
                <p>We keep your data only as long as needed for:</p>
                <ul>
                    <li>operating your tour and providing ongoing support,</li>
                    <li>meeting tax, accounting, and legal record-keeping obligations,</li>
                    <li>resolving disputes, safety incidents, insurance claims, or regulatory questions,</li>
                    <li>documenting the legitimate operation of our business, including proof of what was delivered.</li>
                </ul>
                <p>We store booking and operational records primarily in secure digital systems. Some records (for example, signed health clearances) may be kept in physical form in a secure location.</p>
            </section>

            <section className="mt-8">
                <h2>13. Security</h2>
                <p>JVTO is built around safety and compliance — our operating model is led by professional, vetted local teams, and our founder is an active officer with the East Java Tourist Police Unit.</p>
                <p>We apply reasonable technical, physical, and administrative safeguards intended to:</p>
                <ul>
                    <li>prevent unauthorized access,</li>
                    <li>reduce the risk of loss, theft, or misuse,</li>
                    <li>protect sensitive health and identity information used for permits and safety approvals.</li>
                </ul>
                <p>We also have internal procedures for handling suspected data incidents. Where required by law, we will inform you and/or regulators if a data breach affecting your personal information occurs.</p>
                <p>No data transmission over the internet or messaging apps can be guaranteed 100% secure. We urge you not to send full payment card details, full passport scans, or medical documents in unsecured channels unless we specifically request them for operational reasons.</p>
            </section>

            <section className="mt-8">
                <h2>14. Contacting us</h2>
                <p>If you have questions about this Privacy Policy, want to exercise your rights, or believe your personal data has been mishandled, you can contact us:</p>
                <div className="not-prose p-4 border border-ink-neutral-200 dark:border-ink-neutral-700 rounded-lg bg-gray-50 dark:bg-ink-primary">
                    <p className="font-semibold">PT Java Volcano Rendezvous (JVTO)</p>
                    <p>Jl. Khairil Anwar No.102 A, Badean, Bondowoso, East Java 68217, Indonesia.</p>
                    <p><strong>WhatsApp:</strong> +62 822-4478-8833</p>
                    <p><strong>Email:</strong> info@javavolcano-touroperator.com</p>
                    <p><strong>Operational Hours:</strong> 08:00 – 22:00 WIB (GMT+7).</p>
                </div>
                <p>We will review and respond within a reasonable timeframe and may ask for additional information to verify your identity before sharing or modifying personal data.</p>
                <p>If you are not satisfied with our response, you may have the right to escalate your concern to a data protection authority in your country of residence.</p>
            </section>

            <section className="mt-8">
                <h2>15. Third-party links and platforms</h2>
                <p>Our communications and itineraries may include links to third-party services (for example, hotel partners, transport partners, payment gateways). We do not control and are not responsible for how those parties handle your information. You should review their privacy terms before submitting data to them.</p>
                <p>Some of our services use third-party chat, messaging, or file-sharing tools (for example, WhatsApp Business, cloud file delivery, online map links). Those tools may collect device and usage data under their own policies.</p>
                <p>Our website and booking portal may also use cookies or similar technologies to maintain secure sessions, prevent fraud, and understand which pages are most useful to guests. You can manage cookies through your browser settings.</p>
            </section>

            <section className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg not-prose">
                <h2 className="text-xl font-bold text-ink-primary dark:text-white">Summary (Plain Language)</h2>
                <ul className="mt-2 list-disc list-inside space-y-1 text-ink-neutral-700 dark:text-ink-neutral-200">
                    <li>We ask for only what we need to run your tour safely and legally.</li>
                    <li>We use health info strictly for safety and access compliance (for example, Mount Ijen health certificate).</li>
                    <li>We do not sell your data.</li>
                    <li>You can ask what we store about you and ask us to correct it or delete it (within legal limits).</li>
                    <li>Any serious safety/emergency situation overrides marketing. Your wellbeing comes first.</li>
                </ul>
            </section>
             <p className="mt-8 text-sm italic">This Privacy Policy replaces any previous JVTO privacy statements and is effective as of October 29, 2025.</p>

          </div>
        </main>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;