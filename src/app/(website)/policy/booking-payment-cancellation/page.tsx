import Link from "next/link";
import { type Metadata } from "next";

const policyData = {
  bookingPaymentCancellationPolicy: {
    title: "The Booking, Payment & Cancellation Policy",
    operatorName: "Java Volcano Tour Operator (JVTO)",
    documentTitle: "The Booking, Payment & Cancellation Policy",
    lastUpdated: "20 December 2025",
    appliesTo:
      "Applies to: All enquiries, quotations, bookings, amendments, cancellations, and tour participation with Java Volcano Tour Operator (JVTO), operated by PT Java Volcano Rendezvous.",
    mustBeReadTogetherWith: [
      "JVTO Privacy & Data Protection Policy;",
      "JVTO Official Booking Guide — How to Book;",
      "JVTO Inclusions & Exclusions Policy;",
      "The specific terms stated on your Official E-Voucher / Invoice.",
    ],
    precedenceRule:
      "Order of precedence (if there is any discrepancy): If there is any discrepancy, the Official E-Voucher / Invoice (PDF) for the confirmed booking takes precedence for that booking, followed by this Policy.",
    sections: [
      {
        number: "1",
        title: "Operator Identity & Official Channels",
        text: 'Legal Entity: PT Java Volcano Rendezvous\nBrand / Trading Name: Java Volcano Tour Operator (JVTO)\nRegistered Office: Jl. Khairil Anwar No.102 A, Badean, Bondowoso, East Java 68214, Indonesia\nBusiness ID (NIB): 1102230032918\nTourism License (TDUP): 1102230032918 (11 February 2023)\nOfficial Channels:\nWebsite & secure checkout: https://javavolcano-touroperator.com\n\nWhatsApp: +62 822-4478-8833\n\nEmail: hello@javavolcano-touroperator.com\n\nJVTO operates only private, all-inclusive tours. JVTO does not operate open join-in group tours and does not sell standalone "transport-only" services as its core product.\nJVTO is not responsible for any offers, instructions, or payment requests made outside these official channels.',
      },
      {
        number: "2",
        title: "Nature of JVTO Products",
        text: "All JVTO tours are sold as integrated private tour packages, which may include (as specified per package): accommodation, private transportation, jeeps, guides, tickets, permits, and operational support.\n\nPrices, conditions, and logistics are constructed on a package basis, not on isolated components.\n\nOnly inclusions explicitly stated on the official JVTO tour page and/or your Official E-Voucher / Invoice (PDF) are contractually binding.\n\nFull inclusions and exclusions are detailed in the JVTO Inclusions & Exclusions Policy.",
      },
      {
        number: "3",
        title: "Booking & Confirmation",
        text: "3.1 Enquiries & Quotations\nQuotations issued via official channels are indicative and subject to availability until a booking is confirmed.\n\nRates may vary based on travel dates, group size, rooming, and operational factors.\n\nJVTO may revise a quotation if costs or availability change before confirmation.\n\n3.2 How to Confirm a Booking\nA booking is considered confirmed only when all of the following conditions are met:\nThe guest selects a specific JVTO package (route, dates, group size, start/end points) as offered by JVTO;\n\nThe required deposit or full payment has been successfully processed through an approved method (see Section 4);\n\nJVTO has issued an Official E-Voucher / Invoice (PDF) (digitally) showing:\n\nBooking reference;\n\nTour name and outline itinerary;\n\nTravel dates;\n\nNumber of participants;\n\nStart and end locations;\n\nKey inclusions and any specific written conditions.\n\nEnquiries, quotations, or screenshots without an Official E-Voucher are not confirmed and do not bind JVTO.",
      },
      {
        number: "4",
        title: "Payment Terms & Security",
        text: "4.1 Standard Deposit\nA standard 20% deposit of the total package price is required to secure a booking, unless a different amount is explicitly stated in writing for specific products or promotions.\n\nFor bookings where Day 1 is less than 14 days from the time of booking, JVTO may require up to 100% full payment at checkout.\n\n4.2 Accepted Methods & Workflow\n1. Initial Deposit (Standard Rule)\nThe initial deposit is processed exclusively via credit/debit card (e.g. Visa, MasterCard, Amex) through JVTO's secure, SSL-encrypted checkout integrated with the authorised payment gateway, as described in the Official Booking Guide.\n\n2. Remaining Balance (If Only 20% Deposit Paid Initially)\nThe remaining balance (normally 80%) may be settled using:\nCredit/Debit Card (online): Pay via JVTO's secure payment link no later than 5 (five) calendar days before Day 1;\n\nBank Transfer / Wise: Transfer to official bank accounts of PT Java Volcano Rendezvous no later than 3 (three) calendar days before Day 1;\n\nCash at JVTO Office: Only if explicitly approved in writing by JVTO at the time of booking; must be settled in IDR at JVTO's office before departure on Day 1.\n\nJVTO's official bank accounts for approved balance payments are:\nBank BRI — PT Java Volcano Rendezvous — 001301001779564 — SWIFT: BRINIDJAXXX\n\nBank BCA — PT Java Volcano Rendezvous — 1200944352 — SWIFT: CENAIDJAXXX\n\nAny payment instructions outside the above must be verified via official channels before action.\n4.3 Payment Security (Aligned with Privacy Policy)\nAll online card payments are processed through a secure, SSL-encrypted checkout with a PCI DSS-compliant payment gateway;\n\nJVTO does not store full card numbers, CVV codes, or online banking passwords on its own systems. Sensitive card data is tokenised and handled by the gateway;\n\nJVTO and its payment partners apply fraud monitoring and risk controls to help detect and reduce unauthorised or suspicious transactions.\n\nJVTO will never:\nAsk guests to send full card numbers, CVV codes, or online banking credentials via email, SMS, social media, or unsecured chat;\n\nRequest payments to personal accounts or channels not listed as official in this Policy or the Official Booking Guide.\n\nIf you receive such a request, treat it as suspicious and verify directly with JVTO using official contacts.\n4.4 Non-Payment & Invalid Payment\nIf required payments are not received in full by the stated deadlines, or are made to unauthorised accounts:\nJVTO may treat the booking as unconfirmed or cancelled in line with Sections 7 and 8;\n\nJVTO is not responsible for losses arising from payments made to non-official channels.",
      },
      {
        number: "5",
        title: "Pricing & Currency",
        text: "All official JVTO pricing and accounting are in Indonesian Rupiah (IDR).\n\nAmounts shown in other currencies (if any) are indicative; actual charges depend on your bank or card provider.\n\nRates for future bookings may change due to supplier costs, fuel, taxes, or regulatory adjustments.\n\nOnce a booking is confirmed with deposit or full payment, JVTO will honour the agreed total for the confirmed services, except where:\n\nGovernment-imposed taxes/fees change; or\n\nThe guest modifies the itinerary, group size, or inclusions.",
      },
      {
        number: "6",
        title: "Amendments & Rescheduling by the Guest",
        text: "6.1 General\nAll requests must be submitted by the lead guest or authorised organiser via official channels.\n\nChanges are subject to availability and any additional costs incurred.\n\n6.2 Date Changes (Reschedule)\n48 hours or more before Day 1:\n\nOne (1) reschedule of the same package may be granted without reschedule fee, subject to availability and any seasonal or cost differences.\n\nLess than 48 hours before Day 1:\n\nReschedule is generally not permitted and may be treated as a late cancellation (see Section 7.3).\n\n6.3 Participant & Rooming Adjustments\nMinor corrections that do not affect permits or inventory may be made without charge.\n\nWhere changes affect issued permits, tickets, or room allocations, any extra costs are borne by the guest.",
      },
      {
        number: "7",
        title: "Cancellations, Travel Credit & No-Show (Guest-Initiated)",
        text: "7.1 Cancellation ≥ 48 Hours Before Day 1\nIf the guest cancels 48 hours or more before Day 1 (local Indonesia time):\nFor the purpose of Google Shopping policy, 'returns' are processed in the form of 100% JVTO Travel Credit, which allows guests to 'return' their booking for a future tour value;\n\nJVTO will issue JVTO Travel Credit equal to 100% of payments received for the cancelled services.\n\nJVTO Travel Credit Rules:\nIssued in IDR;\n\nNon-expiring;\n\nMay be transferred or gifted to another traveller with written confirmation from JVTO;\n\nMay be applied to future JVTO private tours at the prevailing rates at the time of new booking;\n\nNo rebooking or administration fee is charged for using valid Travel Credit.\n\nTravel Credit Issuance Time: Following a valid cancellation request, JVTO will process and issue your Official Travel Credit Voucher within 2 (two) business days.\n\n7.2 Cancellation < 48 Hours Before Day 1\nIf the guest cancels less than 48 hours before Day 1:\nUp to 100% of the total package price may be forfeited;\n\nNo Travel Credit or cash refund is normally provided.\n\nGuests have a 30-day window from the order date to request a cancellation and receive Travel Credit, provided the request is made at least 48 hours before the tour's scheduled start time.\n\nCancellations and Travel Credit processing can be handled via our official online channels or in person at our registered office in Bondowoso.\n\n7.3 No-Show & Same-Day Cancellation\nThe following are treated as no-show / same-day cancellation:\nFailure to appear at the confirmed pickup point at the agreed time;\n\nRefusal to depart after vehicles and crew are deployed;\n\nAttempting to cancel on the same day after services are prepared;\n\nVoluntarily leaving the tour after it has commenced.\n\nIn such cases:\nUp to 100% of the total package price is forfeited;\n\nNo refund or Travel Credit is provided for unused services.\n\n7.4 Skipping Activities or Early Departure\nIf a guest chooses to skip activities or end the tour early for personal reasons (including tiredness, preference changes, or non-emergency issues):\nNo partial refund or discount applies;\n\nThe full package price remains payable.",
      },
      {
        number: "8",
        title: "Changes or Cancellation by JVTO / Force Majeure",
        text: "8.1 Operational Adjustments\nJVTO may adjust routes, timings, accommodation, or activities where reasonably necessary for:\nSafety and security;\n\nWeather, volcanic, or environmental conditions;\n\nPark or authority regulations;\n\nTraffic or infrastructure constraints;\n\nOther operational reasons.\n\nWhere substitutions are required, JVTO aims to provide services of equal or higher overall standard.\n8.2 Force Majeure & External Events\nJVTO may partially or fully cancel, postpone, or reroute a tour due to events beyond its reasonable control, including but not limited to:\nVolcanic activity, toxic gas, earthquakes, landslides, floods;\n\nGovernment or park closures or restrictions;\n\nStrikes, civil unrest, or security threats;\n\nMajor infrastructure or transportation disruptions;\n\nSevere weather or other conditions rendering services unsafe.\n\n8.3 Compensation Principles (JVTO-Initiated)\nWhere JVTO cancels or significantly alters services not due to guest breach, non-payment, or no-show, JVTO may offer one or more of the following, taking into account irrecoverable costs already paid to third parties:\nReasonable alternative arrangements of comparable value;\n\nJVTO Travel Credit covering the unused portion;\n\nA partial or full cash refund, net of non-recoverable expenses, as agreed in writing.\n\nGuest-initiated cancellations remain governed by Section 7.",
      },
      {
        number: "9",
        title: "Health, Fitness & Eligibility",
        text: "Guests are responsible for ensuring they are medically and physically fit for the chosen itinerary.\n\nCertain activities (e.g. volcano hikes, night trekking, sulphur gas exposure) may be unsuitable for specific conditions.\n\nWhere mandatory health screening or permit conditions are imposed by authorities (e.g. Mount Ijen):\n\nGuests must comply with the process arranged or recognised by JVTO;\n\nIf a guest is denied clearance, affected components are non-refundable, as related costs are pre-committed.\n\nJVTO strongly recommends comprehensive travel insurance including medical cover and trip interruption.",
      },
      {
        number: "10",
        title: "Guest Responsibilities",
        text: "By confirming a booking with JVTO, the lead guest and all participants acknowledge and agree to:\nProvide accurate and complete information during enquiry and booking;\n\nMake all payments through official channels and within the stated deadlines;\n\nReview the Official E-Voucher promptly and report discrepancies;\n\nSubmit required pickup and logistical details within requested timeframes;\n\nBe present on time at the agreed pickup point;\n\nFollow safety instructions from JVTO crew and licensed guides;\n\nRespect local laws, cultures, communities, and environments;\n\nHold appropriate personal travel insurance.\n\nFailure to meet these responsibilities may limit JVTO's ability to deliver services and may trigger the consequences set out in this Policy.",
      },
      {
        number: "11",
        title: "Relationship with Other JVTO Policies",
        text: "This Booking, Payment & Cancellation Policy operates together with:\nJVTO Privacy & Data Protection Policy;\n\nJVTO Official Booking Guide — How to Book;\n\nJVTO Inclusions & Exclusions Policy.\n\nIn the event of any apparent inconsistency:\nThe specific terms on the Official E-Voucher / Invoice (PDF) for the confirmed booking take precedence;\n\nThen this Booking, Payment & Cancellation Policy;\n\nThen the Inclusions & Exclusions Policy and Official Booking Guide.\n\nThis document is an official corporate policy of PT Java Volcano Rendezvous (Java Volcano Tour Operator) and is the authoritative reference for all booking, payment, amendment, cancellation, and related financial terms communicated to guests, partners, and automated systems.",
      },
    ],
  },
};

export const metadata: Metadata = {
  title: policyData.bookingPaymentCancellationPolicy.title,
  description:
    "Official Booking, Payment & Cancellation Policy for Java Volcano Tour Operator (JVTO).",
};

export default function BookingPolicyPage() {
  const { bookingPaymentCancellationPolicy: policy } = policyData;

  const renderTextWithLinks = (text: string) => {
    const parts = text.split(
      /(JVTO Inclusions & Exclusions Policy|JVTO Privacy & Data Protection Policy)/g
    );
    return parts.map((part, index) => {
      if (part === "JVTO Inclusions & Exclusions Policy") {
        return (
          <Link
            key={index}
            href="/policy/inclusions-exclusions"
            className="text-primary hover:underline"
          >
            {part}
          </Link>
        );
      }
      if (part === "JVTO Privacy & Data Protection Policy") {
        return (
          <Link
            key={index}
            href="/policy/privacy"
            className="text-primary hover:underline"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-8 text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/policy" className="hover:text-primary">
                Policy
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">
                Booking Cancellation
              </span>
            </nav>

            <div className="text-center mb-12">
              <h1 className="font-black text-2xl md:text-5xl">{policy.documentTitle}</h1>
              <p className="mt-4 text-sm text-muted-foreground">
                Last updated: {policy.lastUpdated}
              </p>
            </div>

            <div className="prose prose-lg max-w-none mx-auto text-muted-foreground">
              <p className="border-l-4 border-primary pl-4 italic bg-accent p-4 rounded-r-lg">
                {policy.appliesTo}
              </p>

              <div className="my-8">
                <p>
                  <strong>Must be read together with:</strong>
                </p>
                <ul className="list-disc pl-5">
                  {policy.mustBeReadTogetherWith.map((item, index) => {
                    const text = item.replace(";", "");
                    if (text === "JVTO Inclusions & Exclusions Policy") {
                      return (
                        <li key={index}>
                          <Link
                            href="/policy/inclusions-exclusions"
                            className="text-primary hover:underline"
                          >
                            {text}
                          </Link>
                        </li>
                      );
                    }
                    if (text === "JVTO Privacy & Data Protection Policy") {
                      return (
                        <li key={index}>
                          <Link
                            href="/policy/privacy"
                            className="text-primary hover:underline"
                          >
                            {text}
                          </Link>
                        </li>
                      );
                    }
                    return <li key={index}>{text}</li>;
                  })}
                </ul>
                <p>
                  <strong>{policy.precedenceRule}</strong>
                </p>
              </div>

              <hr className="my-8 border-border" />

              {policy.sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="heading-md mt-12 mb-4 text-foreground">
                    {section.number}. {section.title}
                  </h2>
                  <div className="whitespace-pre-line">
                    {renderTextWithLinks(section.text)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}