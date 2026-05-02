import Breadcrumbs from "./Breadcrumbs";
import Image from "next/image";

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  image?: string;
  imageAlt?: string;
  reverse?: boolean;
}> = ({ title, children, image, imageAlt, reverse = false }) => (
  <section className="mb-12">
    <div
      className={`grid md:grid-cols-5 gap-8 items-center ${
        reverse ? "md:grid-flow-col-dense" : ""
      }`}
    >
      {image && (
        <div className={`md:col-span-2 ${reverse ? "md:col-start-4" : ""}`}>
          <div className="relative w-full aspect-square rounded-sm shadow-lg overflow-hidden">
            <Image
              src={image}
              alt={imageAlt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              quality={90}
            />
          </div>
        </div>
      )}
      <div className={`md:col-span-3 ${image ? "" : "md:col-span-5"}`}>
        <h2 className="text-3xl font-bold text-ink-primary dark:text-white mb-4">
          {title}
        </h2>
        <div className="prose dark:prose-invert max-w-none text-ink-neutral-700 dark:text-ink-neutral-200">
          {children}
        </div>
      </div>
    </div>
  </section>
);

const OurStoryPage = () => {
  const breadcrumbCrumbs = [
    { name: "Home", path: "/" },
    { name: "Why JVTO", path: "/why-jvto" },
    { name: "Our Story", path: "/why-jvto/our-story" },
  ];

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
          <div className="container mx-auto px-4">
            <Breadcrumbs crumbs={breadcrumbCrumbs} />
            <div className="mt-4 max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-black text-ink-primary dark:text-white">
                Our Story: From Homestay Host to Police-Led Tour Operator
              </h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <Section
              title="Roots in Ijen & Bondowoso"
              image="/history/guest-visit-ijen-bondowoso-homestay-stefan-loose-inspired.jpg"
              imageAlt="Mr. Sam with guests at Ijen Bondowoso Homestay, inspired by Stefan Loose travel guide."
            >
              <p>
                Since 2016, Agung (“Mr. Sam”) has welcomed travelers heading to
                Ijen through a locally-run homestay and early guiding services.
                Those first guests: backpackers, students, families: came for
                the crater and blue fire, and left recommending a small team
                that cared more about safety and fairness than quick profit.
              </p>
            </Section>
            <Section
              title="Becoming a Licensed Operator"
              image="/legal/office-photo.jpg"
              imageAlt="Photo of JVTO office at Jl. Khairil Anwar No.102 A, Bondowoso."
              reverse
            >
              <p>
                As demand grew, informal help was no longer enough. To stay
                accountable and professional, we followed a clear legal path:
              </p>
              <ul>
                <li>
                  <strong>Operating Since 2016:</strong> We began guiding and
                  hosting travelers in East Java.
                </li>
                <li>
                  <strong>Incorporated in 2019:</strong> We formally registered
                  as <strong>PT Java Volcano Rendezvous</strong>, an Indonesian
                  limited company.
                </li>
                <li>
                  <strong>Licensed in 2023:</strong> We were issued Indonesian
                  Tourism Business License (TDUP) <strong>1102230032918</strong>{" "}
                  on 11 February 2023.
                </li>
              </ul>
              <p>
                This transition from a local host to a licensed operator means
                your booking is handled by a legal company with a physical
                office at <strong>Jl. Khairil Anwar No.102 A, Bondowoso</strong>
                , ensuring full accountability.
              </p>
            </Section>
            <Section
              title="Active Tourist Police Leadership"
              image="/founder/mr-sam-tourist-police-portrait.png"
              imageAlt="Mr. Sam, active Tourist Police officer and founder of JVTO."
            >
              <p>
                Alongside building JVTO, founder Agung Sambuko serves as{" "}
                <strong>an on-duty tourism police officer in East Java</strong>{" "}
                (Operator-verified, last confirmed: October 2025). This
                experience directly shapes our safety-first culture.
              </p>
              <p>What this means for guests:</p>
              <ul>
                <li>
                  He works daily with regulations and real cases involving
                  tourists.
                </li>
                <li>
                  He understands where visitors are vulnerable: fake operators,
                  unsafe vehicles, and unprepared hikers.
                </li>
                <li>
                  That experience shapes JVTO’s internal rules: verifiable
                  partners, clear paperwork, and routes designed with real-world
                  risk in mind.
                </li>
              </ul>
            </Section>
            <Section
              title="From Incidents to Innovation: Ijen Health Screening"
              image="/screening/ijen-screening-hotel-01.jpeg"
              imageAlt="Nurse checks blood pressure during Ijen pre-ascent screening at hotel lobby."
              reverse
            >
              <p>
                After seeing the consequences of inadequate health checks and
                falsified letters around Ijen, JVTO helped pioneer a{" "}
                <strong>digital health screening workflow</strong>:
              </p>
              <ul>
                <li>
                  Qualified medical teams perform real checks before the hike
                  (included in JVTO tours).
                </li>
                <li>
                  Results are recorded digitally and can be verified by QR code
                  at the gate.
                </li>
                <li>
                  The system is available via{" "}
                  <strong>health.mountijen.com</strong> so that{" "}
                  <strong>all travelers</strong> can avoid fake certificates.
                </li>
              </ul>
            </Section>
            <Section title="Community, Students & Sustainability">
              <p>JVTO grows by investing locally:</p>
              <ul>
                <li>
                  Working with <strong>local guides and youth</strong> from the
                  Ijen–Bromo region.
                </li>
                <li>
                  Engaging in the <strong>HPWKI</strong> network to align with
                  local operator standards.
                </li>
                <li>
                  Participating in the <strong>Indecon</strong> spotlight
                  network to improve sustainable practices.
                </li>
                <li>
                  Partnering with <strong>ISIC</strong> to give international
                  students fair access and reduce the impact of higher foreign
                  visitor fees.
                </li>
              </ul>
            </Section>
            <Section title="Today & Tomorrow">
              <p>
                Today, JVTO operates as a{" "}
                <strong>
                  police-informed, license-backed, community-rooted operator
                </strong>{" "}
                for East Java volcano routes. You can verify who is behind the
                company, see our office and licenses, and know your trip is
                private, all-inclusive, and designed by people who live this
                landscape.
              </p>
            </Section>
          </div>
        </main>
      </div>
    </>
  );
};

export default OurStoryPage;
