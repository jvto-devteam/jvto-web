import Link from "next/link";
import { type Metadata } from "next";

const weatherData = {
  "route": "/travel-guide/weather-and-closures",
  "seo": {
    "title": "Weather, Volcano Alerts & Closures – How JVTO Handles Changes",
    "metaDescription": "Understand how weather, volcanic activity and closures can affect private Bromo, Ijen and Tumpak Sewu tours with JVTO, and how alternative plans and Travel Credit work."
  },
  "h1": "Weather, Volcano Alerts & Closures",
  "hero": {
    "introParagraphs": [
      "Volcanoes and waterfalls are part of a changing natural environment. This page explains how weather, volcanic activity and access closures can affect your private tour, and how JVTO responds when plans need to change.",
      "It is a plain-language summary. For legal details and specific cases, your Official E-Voucher and the Booking, Payment & Cancellation Policy remain the final reference."
    ]
  },
  "sections": [
    {
      "id": "factors-that-can-change-itinerary",
      "title": "1. Factors That Can Change a Volcano or Waterfall Tour",
      "paragraphs": [
        "Routes to Mount Bromo, Kawah Ijen and Tumpak Sewu are influenced by:",
        "- Weather – heavy rain, fog, strong winds, lightning.",
        "- Volcanic activity – ash, gas emissions, increased alert status.",
        "- Landslides, floods or road damage.",
        "- Forest fires or smoke.",
        "- Religious or cultural ceremonies.",
        "- Temporary government or park regulations."
      ]
    },
    {
      "id": "how-jvto-monitors-conditions",
      "title": "2. How JVTO Monitors Conditions & Decides on Changes",
      "paragraphs": [
        "JVTO uses:",
        "- Local guide and driver reports from Bromo, Ijen and Tumpak Sewu areas.",
        "- Information from park authorities and local government.",
        "- Updates linked to volcanic alert levels, gas readings and weather.",
        "When conditions are clearly unsafe or access is formally restricted, JVTO adjusts plans in line with:",
        "- Local regulations.",
        "- Safety considerations for guests and crew.",
        "- The options allowed under the Booking, Payment & Cancellation Policy."
      ]
    },
    {
      "id": "partial-vs-full-closures",
      "title": "3. Partial Closures vs Full Closures",
      "paragraphs": [
        "Not all changes are the same. Some examples:",
        "- Partial closure at Bromo:",
        "  - Certain viewpoints or the sea of sand may be off-limits.",
        "  - Other viewpoints or areas may remain open.",
        "- Partial closure at Ijen:",
        "  - Access to the crater floor or blue fire area may be restricted.",
        "  - Hikes may be limited to safer viewpoints higher up.",
        "- Partial closure at Tumpak Sewu:",
        "  - Lower levels or specific paths may be closed after heavy rain.",
        "  - Only upper viewpoints may be open.",
        "- Full closure:",
        "  - Entire sites or access routes can be closed for safety, ceremonies or official orders.",
        "In partial closures, JVTO will typically adapt the program to what is still legally and safely accessible, while keeping the main structure of your tour."
      ]
    },
    {
      "id": "alternative-routes-and-adjustments",
      "title": "4. Alternative Routes & Adjustments",
      "paragraphs": [
        "When a closure or restriction affects your itinerary, JVTO will:",
        "- Inform you as early as reasonably possible.",
        "- Propose alternative viewpoints, routes or activities where they exist and fit the conditions.",
        "- Explain how any changes relate to the Booking, Payment & Cancellation Policy and your Official E-Voucher.",
        "Examples of adjustments can include:",
        "- Moving a viewpoint or timing on the same day.",
        "- Reordering certain stops within the same trip.",
        "- Changing the ratio between volcanoes, waterfalls and cultural stops.",
        "Some alternatives may not fully match the original experience but are chosen to keep your trip running safely and legally."
      ]
    },
    {
      "id": "blue-fire-sunrise-visibility",
      "title": "5. Blue Fire, Sunrise Views & Visibility",
      "paragraphs": [
        "Phenomena such as blue fire at Ijen and specific sunrise views at Bromo depend on:",
        "- Wind direction and gas levels.",
        "- Cloud and fog.",
        "- Park regulations and crowd control.",
        "JVTO plans itineraries based on the best available local knowledge, but:",
        "- Blue fire sightings are never guaranteed.",
        "- Perfect sunrise conditions cannot be promised.",
        "- Some viewpoints may be closed or narrowed to control risk.",
        "Screenshots or photos on the website and social media are examples of past conditions, not promises for your specific date."
      ]
    },
    {
      "id": "closures-travel-credit-force-majeure",
      "title": "6. Closures, Travel Credit & External Events",
      "paragraphs": [
        "When closures or external events (for example, volcanic alerts, landslides, floods or government bans) make it impossible or unsafe to run part or all of a planned activity, JVTO:",
        "- Aligns decisions with local authorities and safety guidance.",
        "- Applies the options described in your Booking, Payment & Cancellation Policy and Official E-Voucher.",
        "Depending on timing and the exact situation, this may include:",
        "- Continuing with a modified route.",
        "- Applying JVTO Travel Credit for affected services, where applicable.",
        "- Other solutions described in the policy.",
        "This page does not describe every scenario; it explains the principles that guide how JVTO responds in practice."
      ]
    },
    {
      "id": "guest-role-uncertain-conditions",
      "title": "7. Your Role as a Guest During Uncertain Conditions",
      "paragraphs": [
        "You can help keep the whole group safe by:",
        "- Reading pre-tour briefings and health notes carefully.",
        "- Following instructions from guides, drivers and local authorities on site.",
        "- Allowing reasonable flexibility when weather or volcano conditions change plans.",
        "If you have specific questions about how a closure or alert could affect an upcoming tour, please contact JVTO using the official channels listed on this website."
      ]
    },
    {
      "id": "document-hierarchy-reminder",
      "title": "8. Which Document Wins if There Is a Difference?",
      "paragraphs": [
        "If there is ever a difference between this page and your booking documents, the order of priority is:",
        "1. The specific terms on your Official E-Voucher / Invoice.",
        "2. The Booking, Payment & Cancellation Policy.",
        "3. The Inclusions & Exclusions Policy.",
        "4. General website text and informal communication."
      ]
    }
  ]
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

export const metadata: Metadata = {
    title: weatherData.seo.title,
    description: weatherData.seo.metaDescription,
};

const renderParagraphs = (paragraphs: string[]) => {
  const elements: JSX.Element[] = [];
  let listItems: { text: string, indent: number }[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListComponent = listType;
      elements.push(
        <ListComponent key={`list-${elements.length}`} className={`list-${listType === 'ul' ? 'disc' : 'decimal'} pl-5 space-y-2 my-4`}>
          {listItems.map((item, i) => (
            <li key={i} className={item.indent > 0 ? `ml-${item.indent * 4}`: ''}>
                <ParagraphRenderer text={item.text} />
            </li>
          ))}
        </ListComponent>
      );
      listItems = [];
      listType = null;
    }
  };

  for (const p of paragraphs) {
    const ulMatch = p.match(/^(\s*)-\s(.*)/);
    const olMatch = p.match(/^(\s*\d+\.)\s(.*)/);

    if (ulMatch) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      const indent = (ulMatch[1].length - 1) / 2;
      listItems.push({ text: ulMatch[2], indent });
    } else if (olMatch) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      const indent = (olMatch[1].length - 2) / 2;
      listItems.push({ text: olMatch[2], indent });
    } else {
      flushList();
      elements.push(<p key={elements.length}><ParagraphRenderer text={p}/></p>);
    }
  }

  flushList();
  return elements;
};


export default function WeatherAndClosuresPage() {
  const { h1, hero, sections } = weatherData;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="mb-8 text-sm text-center text-muted-foreground">
                <Link href="/travel-guide" className="hover:text-primary">Travel Guide</Link>
                <span className="mx-2">›</span>
                <span className="text-foreground font-medium">Weather &amp; Closures</span>
            </nav>
            <div className="text-center">
              <h1 className="font-black text-2xl md:text-5xl mb-6">{h1}</h1>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                {hero.introParagraphs.map((p, i) => <p key={i}><ParagraphRenderer text={p}/></p>)}
              </div>
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
                    {renderParagraphs(section.paragraphs)}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

    