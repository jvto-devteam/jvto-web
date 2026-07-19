import { KnowledgeChunk } from '../types';

export const knowledgeBase: KnowledgeChunk[] = [
  // --- START OF ABOUT JVTO SECTION ---
  {
    id: 'jvto-legal-status',
    category: 'About JVTO',
    title: 'JVTO Legal Status and Government Licensing',
    content: `Java Volcano Tour Operator (JVTO) is a fully legal and officially licensed tourism company.
* **Legal Entity:** PT Java Volcano Rendezvous (an Indonesian Limited Liability Company)
* **Business ID (NIB):** 1102230032918
* **Tourism License (TDUP):** 1102230032918 (Issued 11 February 2023)
* **Registered Office:** Jl. Khairil Anwar No.102 A, Badean, Bondowoso, East Java 68214, Indonesia.`,
    tags: ['legal', 'license', 'registered', 'TDUP', 'PT Java Volcano Rendezvous', 'legitimacy', 'official', 'company status', 'government approved', 'NIB']
  },
  {
    id: 'jvto-office-and-contact',
    category: 'About JVTO',
    title: 'Physical Office and Official Contact Channels',
    content: `To protect you from fraud, JVTO recognizes **only** the following channels for bookings, payments, and official communication:
* **Website & Secure Checkout:** https://javavolcano-touroperator.com
* **WhatsApp:** +62 822-4478-8833
* **Email:** hello@javavolcano-touroperator.com
Our physical office is located at Jl. Khairil Anwar No.102 A, Badean, Bondowoso, East Java.`,
    tags: ['office', 'address', 'location', 'contact', 'email', 'whatsapp', 'phone number', 'google maps', 'official channel']
  },
  {
    id: 'jvto-the-difference',
    category: 'About JVTO',
    title: 'The JVTO Difference: Police-Led, Licensed, and All-Inclusive',
    content: `What sets JVTO apart is our commitment to verifiable trust, safety, and quality.
- **Police-Led Safety Culture:** Founded by an on-duty tourism police officer in East Java, our safety standards are informed by real-world law enforcement experience and regulations.
- **Exclusively Private & All-Inclusive:** We only offer private tours. This means no hidden fees and a personalized experience with clear inclusions like permits, jeeps, and Ijen health screening.
- **Legally Licensed & Accountable:** JVTO is a fully licensed Indonesian company (PT Java Volcano Rendezvous) with a physical office, ensuring full accountability.`,
    tags: ['why jvto', 'jvto difference', 'usp', 'trust', 'safety', 'private tour', 'all-inclusive', 'founder', 'police', 'legal', 'licensed']
  },
  // --- END OF ABOUT JVTO SECTION ---

  // --- START OF BOOKING & PAYMENT SECTION ---
  {
    id: 'how-to-book',
    category: 'Booking & Payment',
    title: 'Booking & Confirmation Process',
    content: `Booking is a clear, step-by-step process:
* **Step 1: Select Tour & Pay Deposit:** Choose a tour on our website and pay a 20% deposit via our secure gateway. For bookings less than 14 days away, 100% payment may be required.
* **Step 2: Receive E-Voucher:** Upon successful payment, you will receive an Official E-Voucher via email. Your booking is considered confirmed only once this voucher is issued.
* **Step 3: Submit Details:** You will receive a link to securely submit your pickup details (e.g., flight number, hotel name). This must be done at least 48 hours before Day 1.
* **Step 4: Pay Remaining Balance:** Settle the final balance according to the payment deadlines.`,
    tags: ['book', 'booking', 'reservation', 'website', 'how to book', 'checkout', 'confirmation', 'voucher', 'pickup details', 'process']
  },
  {
    id: 'payment-terms',
    category: 'Booking & Payment',
    title: 'Payment Terms and Deposit',
    content: 'A **20% deposit** of the total package price is required to secure a booking. However, for **bookings where Day 1 is less than 14 days away**, JVTO may require up to **100% full payment** at checkout. Failure to meet payment deadlines can result in your booking being treated as cancelled.',
    tags: ['payment', 'terms', 'deposit', 'invoice', 'balance', 'due date', 'upfront', 'full payment', 'last-minute']
  },
  {
    id: 'payment-methods',
    category: 'Booking & Payment',
    title: 'Accepted Payment Methods and Deadlines',
    content: `The remaining balance (normally 80%) must be settled by the specified deadlines:
* **Credit/Debit Card (online):** Pay via a secure payment link no later than **5 (five) calendar days before Day 1**.
* **Bank Transfer / Wise:** Transfer to our official PT Java Volcano Rendezvous bank accounts no later than **3 (three) calendar days before Day 1**.
* **Cash at JVTO Office:** This is an exception only. It must be explicitly approved in writing at the time of booking and paid in IDR at our office before departure on Day 1.`,
    tags: ['payment methods', 'credit card', 'debit card', 'bank transfer', 'wise', 'cash', 'deadline']
  },
  {
    id: 'payment-security',
    category: 'Booking & Payment',
    title: 'Payment Security',
    content: 'All online card payments are processed through a secure, SSL-encrypted checkout with a PCI DSS-compliant payment gateway. JVTO does not store full card numbers or CVV codes. **JVTO will never ask you to send full card numbers, CVV codes, or online banking credentials via email, SMS, social media, or unsecured chat.** If you receive such a request, treat it as suspicious.',
    tags: ['payment security', 'secure', 'ssl', 'credit card', 'scam', 'fraud', 'safe payment', 'pci dss']
  },
  {
    id: 'pricing-currency',
    category: 'Booking & Payment',
    title: 'Pricing and Currency',
    content: 'All official JVTO pricing and accounting are in **Indonesian Rupiah (IDR)**. Any amounts shown in other currencies are indicative only. Once a booking is confirmed with a deposit or full payment, JVTO will honor the agreed total price.',
    tags: ['price', 'currency', 'idr', 'rupiah', 'accounting', 'cost']
  },
  // --- END OF BOOKING & PAYMENT SECTION ---

  // --- START OF CANCELLATION & CHANGES SECTION ---
  {
    id: "cancellation-policy",
    category: "Cancellation & Changes",
    title: "Cancellation Policy (The 48-Hour Rule)",
    content: `Our cancellation policy is based on a strict 48-hour window before your scheduled pickup time on Day 1.
* **If you cancel 48 HOURS OR MORE before Day 1:** You will receive **JVTO Package Credit** equal to 100% of all payments you have made. This credit is non-expiring and can be transferred to another person.
* **If you cancel LESS THAN 48 HOURS before Day 1:** Your payment is **forfeited in full** (up to 100%). No Package Credit or cash refund will be provided.
* **IMPORTANT: JVTO does not issue cash refunds.** Package Credit is the sole form of compensation for eligible cancellations.`,
    tags: ["cancellation", "refund", "policy", "cancel", "48 hours", "package credit", "forfeited", "no cash refund"]
  },
  {
    id: "rescheduling-policy",
    category: "Cancellation & Changes",
    title: "Rescheduling Policy",
    content: `* **If you request to reschedule 48 HOURS OR MORE before Day 1:** You are entitled to **one (1) free reschedule** of the same package, subject to availability and any seasonal cost differences.
* **If you request to reschedule LESS THAN 48 HOURS before Day 1:** Rescheduling is generally **not permitted**. This is treated as a late cancellation, and your payment may be forfeited.`,
    tags: ["reschedule", "rescheduling", "policy", "change date", "amendment", "48 hours", "free"]
  },
  {
    id: 'no-show-policy',
    category: 'Cancellation & Changes',
    title: 'No-Show and Same-Day Cancellation',
    content: `The following are treated as a "no-show" or "same-day cancellation":
* Failure to appear at the confirmed pickup point at the agreed time.
* Refusing to depart after vehicles and crew are deployed.
* Attempting to cancel on the same day services are prepared.
* Voluntarily leaving the tour after it has commenced.
In these cases, up to **100% of the total package price is forfeited**, and no refund or Package Credit is provided.`,
    tags: ['no-show', 'same-day cancellation', 'missed pickup', 'leave early', 'forfeited']
  },
  {
    id: 'changes-by-jvto-force-majeure',
    category: 'Cancellation & Changes',
    title: 'Changes or Cancellation by JVTO (Force Majeure)',
    content: 'JVTO may adjust routes, timings, or activities for safety reasons due to events beyond our control (e.g., volcanic activity, severe weather, government or park closures). Where substitutions are required, we aim to provide services of equal or higher standard. If JVTO cancels a significant portion of a tour for such reasons, we may offer reasonable alternatives, JVTO Package Credit for the unused portion, or a partial/full cash refund net of non-recoverable costs.',
    tags: ['force majeure', 'volcano closure', 'bad weather', 'safety changes', 'cancellation by jvto', 'itinerary change']
  },
  {
    id: 'skipping-activities',
    category: 'Cancellation & Changes',
    title: 'Skipping Activities or Early Departure',
    content: 'If you choose to skip activities or end the tour early for personal reasons (e.g., tiredness), no partial refund or discount applies. The full package price remains payable.',
    tags: ['skip activity', 'early departure', 'no refund', 'partial refund']
  },
  // --- END OF CANCELLATION & CHANGES SECTION ---

  // --- START OF INCLUSIONS & EXCLUSIONS SECTION ---
  {
    id: 'inclusions-standard',
    category: 'Inclusions & Exclusions',
    title: 'Standard Inclusions in Every Tour',
    content: `Every confirmed JVTO tour is private and all-inclusive, typically including:
* **Private Vehicle:** Air-conditioned vehicle with a professional driver, including fuel, tolls, and parking.
* **Accommodation:** Carefully selected hotels with daily breakfast included.
* **Guidance:** English-speaking trip leader support.
* **Bromo Jeep:** A private 4WD Jeep for the Mount Bromo sunrise tour.
* **Permits:** All listed entrance tickets and permits.
* **Ijen Gear:** Professional gas mask and trekking poles for the Mount Ijen hike.
* **Ijen Medical:** The mandatory health screening and digital clearance for Ijen.
* **Water & T-shirt:** Daily bottled mineral water and one JVTO travel T-shirt per guest.
* **Ferry Tickets:** For itineraries that include a Java-Bali crossing.`,
    tags: ['inclusions', 'included', 'all-inclusive', 'what is included', 'package', 'gear', 'permits', 'jeep', 'ijen medical']
  },
  {
    id: 'exclusions-standard',
    category: 'Inclusions & Exclusions',
    title: 'Standard Exclusions from Tours',
    content: `Unless explicitly written as an inclusion on your tour page or voucher, the following are **not included**:
* International/domestic flights and entry visas.
* Travel insurance of any kind.
* Meals not specified in the itinerary (e.g., most lunches and dinners).
* Tips or gratuities for guides and drivers.
* Personal expenses (e.g., souvenirs, alcohol).
* Optional on-site activities like horse riding at Bromo.`,
    tags: ['exclusions', 'not included', 'extra cost', 'optional', 'add-ons', 'tips', 'flights', 'insurance']
  },
  {
    id: 'inclusions-conditional',
    category: 'Inclusions & Exclusions',
    title: 'Conditional Inclusions ("Only If Written")',
    content: 'Some items are only included if they are explicitly written on your official package description and your Official Tour Voucher. Examples include: custom group T-shirts, additional hosted meals (like dinner in Bondowoso), Bali hotel/airport transfers beyond the standard ferry crossing, or dedicated photographer services. If it is not written, it is not part of the contracted package.',
    tags: ['conditional inclusion', 'extra meals', 'custom t-shirt', 'photographer', 'bali transfer', 'voucher']
  },
  // --- END OF INCLUSIONS & EXCLUSIONS SECTION ---

  // --- START OF HEALTH & SAFETY SECTION ---
  {
    id: 'ijen-health-certificate',
    category: 'Health & Safety',
    title: 'Ijen Crater Health Certificate Requirement',
    content: 'A medical health certificate is **mandatory** to enter Mount Ijen, as enforced by local park authorities. For your safety and convenience, JVTO arranges this screening for you. A licensed medical professional performs the check at your hotel. This service is **included in the tour price** for all JVTO Ijen tours. You will need to show your passport or valid ID for the check.',
    tags: ['ijen', 'health certificate', 'medical check', 'doctor', 'requirement', 'safety', 'fee', 'nurse', 'mandatory']
  },
  {
    id: 'ijen-health-contingency',
    category: 'Health & Safety',
    title: 'Contingency Plan if Unfit for Ijen Trek',
    content: 'If the medical professional determines you are not fit to hike Ijen, you will not be permitted to enter for your own safety. The tour will continue for the other guests. In this case, there is **no partial cash refund or compensation** for the missed hike, as all related costs (permits, guide allocation) were pre-committed.',
    tags: ['ijen', 'health certificate', 'unfit', 'contingency', 'medical', 'safety', 'refund policy']
  },
  {
    id: 'guest-responsibilities',
    category: 'Health & Safety',
    title: 'Guest Responsibilities',
    content: `By confirming a booking, all guests agree to:
* Provide accurate and complete information.
* Make all payments through official channels and within stated deadlines.
* Review the Official E-Voucher promptly and report discrepancies.
* Submit required pickup details in time.
* Be present on time at the agreed pickup point.
* Follow all safety instructions from JVTO crew and licensed guides.
* Respect local laws, cultures, and environments.
* Hold appropriate personal travel insurance.`,
    tags: ['guest responsibilities', 'rules', 'safety', 'conduct', 'on time', 'insurance']
  },
  // --- END OF HEALTH & SAFETY SECTION ---

  // --- START OF PRIVACY & DATA SECTION ---
  {
    id: 'data-privacy-summary',
    category: 'Privacy & Data',
    title: 'Data Privacy and Usage',
    content: 'JVTO collects only the data reasonably required to operate tours safely and legally. This includes your name, contact details, and passport/ID details where required for permits (e.g., for Bromo and Ijen). We also collect relevant health information for safety assessments, especially for the mandatory Ijen trek. We apply technical and organizational safeguards to protect your data.',
    tags: ['privacy', 'data protection', 'personal data', 'security', 'passport']
  },
  {
    id: 'data-sharing-policy',
    category: 'Privacy & Data',
    title: 'Data Sharing with Third Parties',
    content: `We share personal data only where necessary and with appropriate safeguards. We may share relevant data with:
* Accommodation partners, transport providers, and guides involved in your itinerary.
* National park authorities for permits.
* Medical professionals for health screenings or emergencies.
* Payment gateways for processing payments.
**JVTO does not sell personal data to third parties.**`,
    tags: ['data sharing', 'privacy', 'third party', 'personal data']
  }
  // --- END OF PRIVACY & DATA SECTION ---
];