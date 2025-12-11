import Link from "next/link";
import { type Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ijenScreeningData = {
  "route": "/travel-guide/ijen-health-screening",
  "seo": {
    "title": "Ijen Health Screening – Real Checks, Digital Proof & QR | Java Volcano Tour Operator",
    "metaDescription": "Learn how Ijen health screening works with JVTO: real checks by trained staff, digital records with QR codes, and a public tool for non-JVTO travellers."
  },
  "h1": "Ijen Health Screening – Real Checks, Digital Proof",
  "hero": {
    "introParagraphs": [
      "This page explains how Ijen health screening works for JVTO guests and for other travellers using the digital system.",
      "It is a practical safety and verification step designed to support responsible night hikes at Kawah Ijen; it does not replace medical advice from your own doctor or your travel insurance."
    ]
  },
  "sections": [
    {
      "id": "why-ijen-screening-matters",
      "title": "1. Why Ijen Health Screening Matters",
      "paragraphs": [
        "Kawah Ijen is one of East Java’s most famous experiences – but it is also a night hike with steep sections, cold temperatures and exposure to sulfur gas.",
        "In the past, some visitors reached the gate with no real health checks or with fake medical letters, putting themselves, local teams and authorities at risk.",
        "JVTO supports a system where guests attempt the hike only after a real screening, and where results can be checked digitally to prove that the screening actually happened."
      ]
    },
    {
      "id": "for-jvto-guests",
      "title": "2. For JVTO Guests – What We Include",
      "paragraphs": [
        "If your JVTO tour includes the Ijen night hike, your package already includes a health screening before the hike.",
        "In practice, this usually means:",
        "- Screening is done before departure for the night hike, often at a partner accommodation or clinic.",
        "- Checks are performed by trained medical staff following local guidelines.",
        "- Typical checks include simple measurements such as blood pressure, oxygen saturation and heart rate, plus a few questions about relevant conditions.",
        "- The result is recorded in a secure digital system and linked to a QR code.",
        "Your Official E-Voucher and daily briefing will show where and when your screening will take place and what you need to prepare, for example bringing ID or filling in a short form.",
        "The cost of this screening is already included in your Ijen tour price with JVTO."
      ]
    },
    {
      "id": "for-non-jvto-travellers",
      "title": "3. For Non-JVTO Travellers – Using the Public Digital Tool",
      "paragraphs": [
        "The same digital screening workflow that JVTO uses is also available for other travellers through a public web tool, so that more people can avoid fake certificates and incomplete checks.",
        "In simple terms:",
        "1. You register your basic details and your intended hiking time in the digital system.",
        "2. You attend a screening with a participating clinic or hotel partner.",
        "3. If you are cleared, the provider submits your result and the system generates a QR-linked clearance.",
        "Gate staff can then scan or verify this QR code to confirm that a real screening took place.",
        "For access to the public tool, follow the information on health.mountijen.com or as communicated by local authorities and official providers."
      ]
    },
    {
      "id": "at-the-gate",
      "title": "4. At the Ijen Gate – What Happens With Your Screening",
      "paragraphs": [
        "At the Ijen entrance, staff may:",
        "- Ask if you have completed a health screening.",
        "- Check your digital clearance via your QR code or reference.",
        "The goal is not to create extra bureaucracy, but to:",
        "- Make sure screenings are real and traceable.",
        "- Reduce the use of unverified or falsified letters.",
        "- Help identify guests who may not be fit for a high-exertion, high-altitude, gas-exposed night hike."
      ]
    },
    {
      "id": "not-cleared-to-hike",
      "title": "5. If the Screening Says “Not Recommended to Hike”",
      "paragraphs": [
        "Sometimes, a screening result may suggest that it is not safe for you to attempt the Ijen night hike – for example, because of very high blood pressure or other indicators.",
        "In these cases:",
        "- JVTO will not force the hike and will respect the screening result.",
        "- Our team will discuss alternative options for your itinerary in line with the Booking, Payment & Cancellation Policy and your Official E-Voucher.",
        "Health-related decisions are handled seriously and may affect what is possible on your tour, but they do not automatically mean a full refund.",
        "We strongly recommend that all guests consider their own health and fitness before booking, bring any medication they normally require, and speak to their own doctor at home if they have concerns about high-altitude or gas-exposed activities."
      ]
    },
    {
      "id": "what-screening-is-and-is-not",
      "title": "6. What This Screening Is – And What It Is Not",
      "paragraphs": [
        "This screening is a practical, structured step to help identify basic risks before a demanding night hike.",
        "It is also a way to give gate staff a verifiable record that a screening took place.",
        "It is not a hospital admission, a full medical check-up or a guarantee of safety.",
        "Even with screening, volcano hikes remain physically demanding, and conditions can change quickly. JVTO and local authorities may still adjust or cancel access based on weather, gas levels or other safety concerns."
      ]
    },
    {
      "id": "data-and-privacy",
      "title": "7. Data & Privacy",
      "paragraphs": [
        "The digital screening system records only the information required to operate the screening and clearance process.",
        "Details about what data is collected, how long it is kept and how it is protected will be described in a dedicated Privacy Policy once finalised.",
        "If you have questions about your screening data, please ask the screening provider and contact JVTO via the official channels listed on this site."
      ]
    },
    {
      "id": "quick-questions",
      "title": "8. Quick Questions About Ijen Screening",
      "faqs": [
        {
          "question": "Is Ijen health screening mandatory?",
          "answerParagraphs": [
            "For JVTO guests attempting the Ijen night hike, yes – it is built into the tour.",
            "For non-JVTO visitors, we strongly recommend screening through official channels or the digital tool. Local authorities may require proof of screening at certain times."
          ]
        },
        {
          "question": "Does screening guarantee that nothing will happen?",
          "answerParagraphs": [
            "No. Screening reduces risk by identifying obvious issues, but it does not guarantee any outcome.",
            "Conditions at volcano sites can change quickly, and all activities remain subject to safety decisions by local authorities and JVTO."
          ]
        },
        {
          "question": "Does screening affect my insurance?",
          "answerParagraphs": [
            "Screening is intended as a safety and verification step, not a replacement for travel insurance.",
            "You remain responsible for arranging your own travel and medical insurance that covers hiking and adventure activities, and for checking how your insurer treats pre-existing conditions."
          ]
        }
      ]
    }
  ]
};

export const metadata: Metadata = {
    title: ijenScreeningData.seo.title,
    description: ijenScreeningData.seo.metaDescription,
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
            <li key={i}>{item}</li>
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
      elements.push(<p key={elements.length}>{p}</p>);
    }
  }

  flushList();
  return elements;
};

export default function IjenHealthScreeningPage() {
    const { h1, hero, sections } = ijenScreeningData;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow pt-24">
                <section className="py-12 md:py-16 bg-accent border-b">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                         <nav className="mb-8 text-sm text-muted-foreground">
                            <Link href="/travel-guide" className="hover:text-primary">Travel Guide</Link>
                            <span className="mx-2">›</span>
                            <span className="text-foreground font-medium">Ijen Health Screening</span>
                        </nav>
                        <h1 className="font-black text-2xl md:text-5xl mb-6">{h1}</h1>
                        <div className="prose prose-lg mx-auto text-muted-foreground">
                            {hero.introParagraphs.map((p, i) => <p key={i}>{p}</p>)}
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
                                        {renderParagraphs(section.paragraphs || [])}
                                    </div>

                                    {section.faqs && (
                                      <Accordion type="single" collapsible className="w-full mt-6">
                                        {section.faqs.map((faq, index) => (
                                          <AccordionItem value={`item-${section.id}-${index}`} key={index}>
                                            <AccordionTrigger className="text-lg text-left font-bold text-foreground hover:text-primary">
                                              {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                              <div className="prose max-w-none text-muted-foreground space-y-4">
                                                {faq.answerParagraphs.map((p, i) => (
                                                  <p key={i}>{p}</p>
                                                ))}
                                              </div>
                                            </AccordionContent>
                                          </AccordionItem>
                                        ))}
                                      </Accordion>
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

    