import Link from "next/link";
import { type Metadata } from 'next';
import Button from "@/components/website/UI/Button";
import { Check, ArrowRight } from "lucide-react";

const bookingInfoData = {
  "route": "/travel-guide/booking-information",
  "seo": {
    "title": "Booking Information – Payments, Changes & Travel Credit | Java Volcano Tour Operator",
    "metaDescription": "Learn how private Bromo and Ijen tours with JVTO are booked, paid and changed. Clear rules on deposits, balance payments, cancellations and Travel Credit."
  },
  "h1": "Booking Information – How JVTO Private Tours Work",
  "hero": {
    "introParagraphs": [
      "This page explains, in simple terms, how private tour bookings with Java Volcano Tour Operator (JVTO) work – from choosing a tour and paying the deposit, to final payments, changes, cancellations and Travel Credit.",
      "For anything legal or detailed, your Official E-Voucher / Invoice and the Booking, Payment & Cancellation Policy are the final reference."
    ]
  },
  "sections": [
    {
      "id": "private-tours-and-channels",
      "title": "1. Private Tours Only & Official Channels",
      "paragraphs": [
        "All JVTO routes are private, all-inclusive tours – we do not sell shared-group or transport-only packages.",
        "To protect your booking and your payment, please follow these rules:"
      ],
      "bullets": [
        "Book only through the official JVTO website and secure checkout.",
        "Use only the official WhatsApp number and email address listed on this site.",
        "If you ever receive a different account number, payment link or contact, pause and verify it with us via our official contacts before paying."
      ],
      "inlineCtas": [
        {
          "label": "See how to make a booking (FAQ)",
          "href": "/travel-guide/faq"
        }
      ],
      "notes": [
        "Where available, the Official Booking Guide – How to Book (PDF) and the Booking, Payment & Cancellation Policy provide the full legal wording."
      ]
    },
    {
      "id": "how-to-book",
      "title": "2. How to Book a Private Tour with JVTO",
      "paragraphs": [
        "This step-by-step outline matches the Official Booking Guide – How to Book and shows how a typical private tour is confirmed."
      ],
      "subsections": [
        {
          "subtitle": "2.1 Choose your tour on the official website",
          "paragraphs": [
            "Start by choosing one of our private, all-inclusive routes on the official JVTO website.",
            "Select your starting point (for example, Surabaya or Bali), your preferred duration (2D1N, 3D2N, 4D3N, 5D+) and review the detailed itinerary, including the day-by-day schedule, included services, and the inclusions and exclusions."
          ]
        },
        {
          "subtitle": "2.2 Enter your contact details",
          "paragraphs": [
            "Click Book or Continue on your chosen package and provide:",
            "- Full name of the lead guest.",
            "- Verified email address.",
            "- Active WhatsApp or mobile number.",
            "These details are used to send your Official E-Voucher, manage your booking, and support you before and during the tour."
          ]
        },
        {
          "subtitle": "2.3 Pay the initial deposit (or full amount, if required)",
          "paragraphs": [
            "In most cases, a 20% deposit of the total package price is required at checkout to secure your booking.",
            "If Day 1 of your tour is close (for example, less than 14 days away), the system may request up to 100% full payment at the time of booking.",
            "The deposit is processed by card through JVTO’s secure, encrypted checkout with an authorised payment gateway."
          ]
        },
        {
          "subtitle": "2.4 Receive your Official E-Voucher",
          "paragraphs": [
            "After a successful payment, you will see a successful or complete status on the checkout page and receive:",
            "- An order summary or payment receipt.",
            "- Your Official E-Voucher (PDF).",
            "Your booking is considered confirmed only when payment has been processed and your Official E-Voucher has been issued to your verified email address.",
            "Always check the details on your Official E-Voucher and contact us quickly if something is incorrect."
          ]
        },
        {
          "subtitle": "2.5 Complete additional details (after confirmation)",
          "paragraphs": [
            "Once your booking is confirmed, you may receive a secure link or access to a My Bookings / Customer Portal to provide extra details such as:",
            "- Full guest list.",
            "- Arrival times and transport details.",
            "- Room preferences.",
            "- Dietary needs.",
            "- Relevant health information for high-exertion or high-altitude activities.",
            "Providing accurate and timely information helps us prepare your tour safely and efficiently."
          ]
        }
      ],
      "notes": [
        "This section is a plain-language summary. For precise legal wording and conditions, always refer to the Official Booking Guide – How to Book and the Booking, Payment & Cancellation Policy."
      ]
    },
    {
      "id": "payments",
      "title": "3. Payments – Deposit, Balance & Accepted Methods",
      "subsections": [
        {
          "subtitle": "3.1 Deposit",
          "paragraphs": [
            "As a standard rule, a 20% deposit of the total package price is required to secure a booking, unless a different amount is clearly stated in writing for specific products, promotions or group arrangements.",
            "For tours where Day 1 is less than 14 days away, the system may request up to 100% full payment at checkout."
          ]
        },
        {
          "subtitle": "3.2 How you can pay",
          "paragraphs": [
            "Initial deposit:",
            "- Paid by credit or debit card only, through JVTO’s secure, SSL-encrypted checkout with an authorised payment gateway.",
            "",
            "Remaining balance (if only 20% was paid at first):",
            "- Card (online): pay via JVTO’s secure payment link no later than 5 calendar days before Day 1.",
            "- Bank transfer / Wise: pay to JVTO’s official company bank accounts no later than 3 calendar days before Day 1.",
            "- Cash at the JVTO office: possible only if explicitly approved in writing at the time of booking; must be settled in Indonesian Rupiah at the JVTO office before departure on Day 1.",
            "",
            "If balance payment deadlines are not met, your booking may be handled according to the Booking, Payment & Cancellation Policy, which can include cancellation and forfeiture depending on the timing."
          ]
        },
        {
          "subtitle": "3.3 Payment security (plain language)",
          "paragraphs": [
            "All online card payments are processed via a secure, encrypted checkout using a compliant payment gateway.",
            "JVTO does not store full card numbers or CVV codes on its own systems.",
            "JVTO will never ask you to send full card details or online banking passwords via WhatsApp, email or social media.",
            "If you receive unusual payment instructions, stop and verify them using the official WhatsApp number or email address listed on this site."
          ]
        }
      ]
    },
    {
      "id": "cancellations-and-travel-credit",
      "title": "4. Cancellations, Travel Credit & No-Show (Guest-Initiated)",
      "subsections": [
        {
          "subtitle": "4.1 Cancellation 48 hours or more before Day 1",
          "paragraphs": [
            "If you cancel 48 hours or more before Day 1 (local Indonesia time), any payments already received (including the deposit and any additional amounts) are not refunded in cash.",
            "Instead, JVTO issues JVTO Travel Credit equal to 100% of the payments received for the cancelled services.",
            "JVTO Travel Credit – key characteristics:",
            "- Issued in Indonesian Rupiah (IDR).",
            "- Does not expire.",
            "- Can be transferred or gifted to another traveller with written confirmation from JVTO.",
            "- Can be applied to future JVTO private tours at the prevailing rates at the time of the new booking.",
            "- No rebooking or administration fee is charged for using valid Travel Credit."
          ]
        },
        {
          "subtitle": "4.2 Cancellation less than 48 hours before Day 1",
          "paragraphs": [
            "If you cancel less than 48 hours before Day 1, up to 100% of the total package price may be forfeited.",
            "As a general rule, no Travel Credit or cash refund is provided when cancelling this late."
          ]
        },
        {
          "subtitle": "4.3 No-show & same-day cancellation",
          "paragraphs": [
            "Situations such as the following are treated as no-show or same-day cancellation:",
            "- Not appearing at the confirmed pickup point at the agreed time.",
            "- Refusing to depart after vehicles and crew are already deployed.",
            "- Attempting to cancel on the same day after services are prepared.",
            "- Voluntarily leaving the tour after it has started.",
            "In these cases, up to 100% of the total package price may be forfeited and no refund or Travel Credit is provided for unused services."
          ]
        },
        {
          "subtitle": "4.4 Skipping activities or leaving early",
          "paragraphs": [
            "If a guest chooses to skip activities or end the tour early for personal reasons (for example, tiredness, change of preference, or non-emergency issues), no partial refund or discount applies and the full package price remains payable."
          ]
        }
      ]
    },
    {
      "id": "changes-by-guest",
      "title": "5. Changing Your Booking (Dates, Details & Adjustments)",
      "paragraphs": [
        "Some minor corrections – for example, a typo in a name or small timing adjustments that do not affect permits or room inventory – may be possible without extra charge.",
        "Where a requested change affects issued permits, tickets, accommodation allocations or transport inventory, any extra costs charged by suppliers are normally borne by the guest.",
        "Free or paid reschedule options follow the timings and rules described in the Booking, Payment & Cancellation Policy and on your Official E-Voucher / Invoice."
      ],
      "notes": [
        "For detailed conditions, please refer to the full Booking, Payment & Cancellation Policy."
      ]
    },
    {
      "id": "changes-by-jvto",
      "title": "6. Changes by JVTO & External Events",
      "paragraphs": [
        "JVTO may adjust routes, timings, accommodation or activities when reasonably necessary for safety, legal compliance or operational reasons – for example, due to volcanic activity, toxic gas, landslides, floods, government restrictions or park closures.",
        "In these situations, JVTO will:",
        "- Prioritise guest safety and legal compliance.",
        "- Propose alternative arrangements where feasible (rerouting, changes of timing, or substitutions).",
        "- Apply the rules on Travel Credit or other options as described in the Booking, Payment & Cancellation Policy and your Official E-Voucher / Invoice.",
        "Full details of how force majeure and external events are handled are described in the Booking, Payment & Cancellation Policy."
      ]
    },
    {
      "id": "responsibilities-and-documents",
      "title": "7. Your Responsibilities & Document Hierarchy",
      "paragraphs": [
        "To help us operate your tour safely and accurately, guests are expected to:",
        "- Provide accurate information (names as per ID or passport where required, contact details, arrival and departure times, and any health information they choose to share for safety).",
        "- Review the Official E-Voucher carefully and contact JVTO promptly if anything is incorrect.",
        "- Use only official channels and payment methods listed on this site.",
        "If there is any discrepancy between the website text and official documents, the order of precedence is:",
        "1. The specific terms stated on your Official E-Voucher / Invoice for your confirmed booking.",
        "2. The Booking, Payment & Cancellation Policy.",
        "3. The Inclusions & Exclusions Policy.",
        "4. General website content or informal communication."
      ]
    },
    {
      "id": "verification-and-support",
      "title": "8. Verification & Support",
      "paragraphs": [
        "If you are ever unsure about the authenticity of a link, account number or message claiming to be from JVTO:",
        "- Stop the payment process.",
        "- Contact us directly via the official WhatsApp number or email listed on this website.",
        "JVTO will confirm whether the information is genuine before you proceed."
      ],
      "ctas": [
        {
          "label": "WhatsApp support",
          "href": "https://wa.me/6282244788833"
        },
        {
          "label": "Email support",
          "href": "mailto:hello@javavolcano-touroperator.com"
        }
      ]
    }
  ]
};

export const metadata: Metadata = {
    title: bookingInfoData.seo.title,
    description: bookingInfoData.seo.metaDescription,
};

const ParagraphRenderer = ({ text }: { text: string }) => {
    const parts = text.split(/(Booking, Payment & Cancellation Policy|The Inclusions & Exclusions Policy)/g);
  
    return (
      <>
        {parts.map((part, index) => {
          if (part === 'Booking, Payment & Cancellation Policy') {
            return (
              <Link key={index} href="/policy/booking-cancellation" className="text-primary hover:underline">
                {part}
              </Link>
            );
          }
          if (part === 'The Inclusions & Exclusions Policy') {
            return (
              <Link key={index} href="/travel-guide/inclusions-exclusions-policy" className="text-primary hover:underline">
                {part}
              </Link>
            );
          }
          return part;
        })}
      </>
    );
  };

const renderParagraphs = (paragraphs: string[]) => {
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListComponent = listType;
      elements.push(
        <ListComponent key={`list-${elements.length}`} className={`list-${listType === 'ul' ? 'disc' : 'decimal'} pl-5 space-y-2 my-4`}>
          {listItems.map((item, i) => (
            <li key={i}><ParagraphRenderer text={item} /></li>
          ))}
        </ListComponent>
      );
      listItems = [];
      listType = null;
    }
  };

  for (const p of paragraphs) {
    if (p.startsWith('- ')) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      listItems.push(p.substring(2));
    } else if (/^\d+\./.test(p)) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      listItems.push(p.substring(p.indexOf(' ') + 1));
    } else {
      flushList();
      elements.push(<p key={elements.length}><ParagraphRenderer text={p} /></p>);
    }
  }

  flushList();
  return elements;
};

export default function BookingInformationPage() {
    const { h1, hero, sections } = bookingInfoData;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow pt-24">
                <section className="py-12 md:py-16 bg-accent border-b">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <nav className="mb-8 text-sm text-muted-foreground">
                            <Link href="/travel-guide" className="hover:text-primary">Travel Guide</Link>
                            <span className="mx-2">›</span>
                            <span className="text-foreground font-medium">Booking Information</span>
                        </nav>
                        <h1 className="font-black text-2xl md:text-5xl mb-6">{h1}</h1>
                        <div className="prose prose-lg mx-auto text-muted-foreground">
                            {hero.introParagraphs.map((p, i) => <p key={i}><ParagraphRenderer text={p}/></p>)}
                        </div>
                    </div>
                </section>
                
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="space-y-16">
                            {sections.map(section => (
                                <section key={section.id} id={section.id} className="scroll-mt-24">
                                    <h2 className="heading-md font-black text-2xl mb-6 border-b pb-4">{section.title}</h2>
                                    <div className="prose max-w-none text-muted-foreground space-y-4">
                                        {section.paragraphs && renderParagraphs(section.paragraphs)}
                                    </div>
                                    
                                    {section.bullets && (
                                        <ul className="mt-4 space-y-3">
                                            {section.bullets.map((bullet, i) => (
                                                <li key={i} className="flex items-start">
                                                    <Check className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                                                    <span className="text-muted-foreground">{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {section.subsections?.map((subsection, i) => (
                                        <div key={i} className="mt-8">
                                            <h3 className="font-bold text-lg text-foreground mb-3">{subsection.subtitle}</h3>
                                            <div className="prose max-w-none text-muted-foreground space-y-4">
                                                {renderParagraphs(subsection.paragraphs)}
                                            </div>
                                        </div>
                                    ))}

                                    {section.inlineCtas && (
                                        <div className="mt-6">
                                            {section.inlineCtas.map((cta, i) => (
                                                <Button key={i} asChild variant="link" className="p-0 h-auto">
                                                    <Link className="flex" href={cta.href}>{cta.label} <ArrowRight className="ml-2 w-4 h-4" /></Link>
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {section.ctas && (
                                        <div className="mt-6 flex flex-wrap gap-4">
                                            {section.ctas.map((cta, i) => (
                                                <Button key={i} asChild>
                                                    <a href={cta.href} target="_blank" rel="noopener noreferrer">{cta.label}</a>
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {section.notes && (
                                        <div className="mt-6 border-l-4 border-muted-foreground/20 bg-muted/50 p-4 text-sm text-muted-foreground italic">
                                            {section.notes.map((note, i) => <p key={i}><ParagraphRenderer text={note} /></p> )}
                                        </div>
                                    )}
                                </section>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

    