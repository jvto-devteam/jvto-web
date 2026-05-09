// src/app/(website)/policy/booking-payment-cancellation/page.tsx
import Link from "@/components/website/AppLink";
import { type Metadata } from "next";
import Sidebar from "../sidebar";


const policyData = {
  bookingPaymentCancellationPolicy: {
    title: "JVTO Booking, Payment & Cancellation Policy",
    operatorName: "Java Volcano Tour Operator (JVTO)",
    documentTitle: "JVTO Booking, Payment & Cancellation Policy",
    lastUpdated: "17 January 2026",
    appliesTo:
      "This policy applies to all enquiries, quotations, bookings, amendments, cancellations, and tour participation with Java Volcano Tour Operator (JVTO), operated by PT Java Volcano Rendezvous.",
    mustBeReadTogetherWith: [
      "JVTO Privacy & Data Protection Policy;",
      "JVTO Official Booking Guide — How to Book;",
      "JVTO Inclusions & Exclusions Policy;",
      "The specific terms stated on your Official E-Voucher / Invoice.",
    ],
    precedenceRule:
      "If there is any discrepancy, the following order applies: 1. The specific terms on your Official E-Voucher / Invoice (PDF) for the confirmed booking; 2. This Booking, Payment & Cancellation Policy; 3. The Inclusions & Exclusions Policy; 4. The Official Booking Guide (How to Book).",
    sections: [
      {
        number: "1",
        title: "Operator Identity & Official Channels",
        text: `Official channels (valid booking, support, and payment verification):

Website & secure checkout: https://javavolcano-touroperator.com
WhatsApp: +62 822-4478-8833
Email: hello@javavolcano-touroperator.com

JVTO is not responsible for any offers, instructions, or payment requests made outside these official channels.`,
      },
      {
        number: "2",
        title: "Order of Precedence (If There Is Any Discrepancy)",
        text: `If there is any discrepancy, the following order applies:

1. The specific terms on your Official E-Voucher / Invoice (PDF) for the confirmed booking
2. This Booking, Payment & Cancellation Policy
3. The Inclusions & Exclusions Policy
4. The Official Booking Guide (How to Book)`,
      },
      {
        number: "3",
        title: "Nature of JVTO Products",
        text: `- JVTO operates private, all-inclusive tours.
- JVTO does not operate open join-in group tours and does not sell standalone "transport-only" services as its core product.
- Only inclusions explicitly stated on the official tour page and/or your Official E-Voucher / Invoice (PDF) are contractually binding.`,
      },
      {
        number: "4",
        title: "When a Booking Is Confirmed",
        text: `A booking is confirmed only when all of the following are met:

1. You select a specific official JVTO package; and
2. Your required payment (deposit or full payment) is successfully processed via approved methods; and
3. JVTO issues your Official E-Voucher / Invoice (PDF) confirming the booking details.

Enquiries, messages, and quotations are not binding until the booking is confirmed under the rule above.`,
      },
      {
        number: "5",
        title: "Pricing & Currency",
        text: `- Official pricing and accounting are in Indonesian Rupiah (IDR).`,
      },
      {
        number: "6",
        title: "Payments",
        text: `6.1 Deposit Requirement
- Standard deposit: 20% of the total booking value.
- If Day 1 is within 14 days, JVTO may require up to 100% full payment.

6.2 Approved Payment Methods
Deposit (initial payment):
- Card payment via JVTO secure checkout (credit/debit).

Balance payment (if applicable):
- Card payment via secure checkout (deadline below), or
- Bank transfer / Wise (deadline below), or
- Cash at JVTO office (only if approved in writing).

6.3 Balance Payment Deadlines (If Applicable)
- By card: no later than 5 days before Day 1
- By bank transfer / Wise: no later than 3 days before Day 1

6.4 Bank Transfer Details (Public)
Use these details only for balance payments when instructed through official channels.

- Bank BRI — PT Java Volcano Rendezvous — 001301001779564 — SWIFT: BRINIDJAXXX
- Bank BCA — PT Java Volcano Rendezvous — 1200944352 — SWIFT: CENAIDJAXXX

Any payment instructions outside the above must be verified via official channels before action.

6.5 Payment Security & Anti-Fraud
- Checkout is SSL-encrypted and processed via a PCI DSS-compliant payment gateway.
- JVTO does not store full card numbers, CVV codes, or online banking passwords.
- JVTO will never ask you for full card details, CVV, or banking credentials via chat or email. If you are unsure, verify via WhatsApp or email before paying.`,
      },
      {
        number: "7",
        title: "Amendments & Rescheduling",
        text: `7.1 Amendments
If you need to correct booking details (e.g., passenger name spelling, pickup details, rooming requests), notify JVTO as soon as possible. Some changes may be subject to supplier rules, availability, and cost differences.

7.2 Rescheduling (Date Change)
- Requests made 48 hours or more before Day 1: one reschedule for the same package may be granted without fee, subject to availability and any seasonal/cost differences.
- Requests made less than 48 hours before Day 1: generally not permitted and may be treated as a late cancellation.`,
      },
      {
        number: "8",
        title: "Cancellation Policy (48-Hour Cut-Off)",
        text: `Definitions:
- Day 1: the first day of services for your tour.
- Cut-off time is measured in local Indonesia time.

8.1 Guest-Initiated Cancellation (48 Hours or More Before Day 1)
- Payments are not refundable in cash.
- 100% converts to JVTO Travel Credit.

Travel Credit rules:
- Issued in IDR
- Non-expiring
- Transferable with written confirmation
- Can be used for future tours at prevailing rates

8.2 Guest-Initiated Cancellation (Less Than 48 Hours Before Day 1)
- The booking may be forfeited up to 100%.
- Travel Credit and cash refunds are generally not provided.`,
      },
      {
        number: "9",
        title: "Force Majeure & External Events",
        text: `JVTO may partially or fully cancel, postpone, or reroute a tour due to events beyond reasonable control, including (but not limited to):
- Volcanic activity, toxic gas, earthquakes, landslides, floods
- Government or park closures or restrictions
- Strikes, civil unrest, security threats
- Major infrastructure or transportation disruptions
- Severe weather or conditions rendering services unsafe

Compensation Principles (JVTO-Initiated)
Where JVTO cancels or significantly alters services not due to guest breach, non-payment, or no-show, JVTO may offer one or more of the following (considering irrecoverable third-party costs):
- Reasonable alternative arrangements of comparable value
- JVTO Travel Credit covering the unused portion
- A partial or full cash refund, net of non-recoverable expenses, as agreed in writing

Guest-initiated cancellations remain governed by Section 8.`,
      },
      {
        number: "10",
        title: "Health, Fitness & Eligibility",
        text: `- Guests are responsible for ensuring they are medically and physically fit for the itinerary.
- Certain activities (e.g., volcano hikes, night trekking, sulfur gas exposure) may be unsuitable for specific conditions.
- Where mandatory health screening or permit conditions are imposed by authorities (e.g., Mount Ijen):
  - Guests must comply with the process arranged or recognised by JVTO
  - If a guest is denied clearance, affected components are non-refundable, as related costs are pre-committed
- JVTO strongly recommends comprehensive travel insurance including medical cover and trip interruption.`,
      },
      {
        number: "11",
        title: "Guest Responsibilities",
        text: `By confirming a booking with JVTO, the lead guest and all participants agree to:
- Provide accurate and complete information during enquiry and booking
- Make payments through official channels and within deadlines
- Review the Official E-Voucher promptly and report discrepancies
- Submit pickup/logistical details within requested timeframes
- Be present on time at the agreed pickup point
- Follow safety instructions from JVTO crew and licensed guides
- Respect local laws, cultures, communities, and environments
- Hold appropriate personal travel insurance

Failure to meet these responsibilities may limit JVTO's ability to deliver services and may trigger consequences set out in this policy.`,
      },
      {
        number: "12",
        title: "Group Incentives (FOC) — JVTO Website Only",
        text: `We do offer FOC (Free of Charge) incentives based on group size.
Our current FOC scheme is as follows:
- 18 paying pax → 1 FOC
- 35 paying pax → 2 FOC
- 50 paying pax → 3 FOC

"Pax" refers to paying guests only.`,
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
      /(JVTO Inclusions & Exclusions Policy|JVTO Privacy & Data Protection Policy)/g,
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
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pt-24 md:pt-36 pb-20">
        <section>
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-4  text-sm text-muted-foreground">
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

            <div className=" mb-12">
              <h1 className="font-black text-2xl md:text-5xl">
                {policy.documentTitle}
              </h1>
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
